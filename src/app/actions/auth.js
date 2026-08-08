'use server';

import { connectDB } from '@/lib/mongodb';
import { sendEmail } from '@/lib/mailer';
import User from '@/models/User';
import OtpRequest from '@/models/OtpRequest';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'musica_jwt_secret_key_change_in_production';
const TOKEN_COOKIE = 'musica_auth_token';
const TOKEN_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds
const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes

// ─── Register ────────────────────────────────────────────────────────────────

export async function registerAction(formData) {
    const name = formData.get('name')?.toString().trim();
    const email = formData.get('email')?.toString().trim().toLowerCase();
    const password = formData.get('password')?.toString();

    // Basic validation
    if (!name || !email || !password) {
        return { success: false, message: 'All fields are required.' };
    }
    if (password.length < 6) {
        return { success: false, message: 'Password must be at least 6 characters.' };
    }

    try {
        await connectDB();

        const existing = await User.findOne({ email });
        if (existing) {
            return { success: false, message: 'An account with this email already exists.' };
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await User.create({ name, email, password: hashedPassword });

        const token = jwt.sign(
            { id: user._id.toString(), name: user.name, email: user.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        const cookieStore = cookies();
        cookieStore.set(TOKEN_COOKIE, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: TOKEN_MAX_AGE,
            path: '/',
        });

        return {
            success: true,
            user: { id: user._id.toString(), name: user.name, email: user.email },
        };
    } catch (error) {
        console.error('Register error:', error);
        return { success: false, message: 'Registration failed. Please try again.' };
    }
}

// ─── Login ───────────────────────────────────────────────────────────────────

export async function loginAction(formData) {
    const email = formData.get('email')?.toString().trim().toLowerCase();
    const password = formData.get('password')?.toString();

    if (!email || !password) {
        return { success: false, message: 'Email and password are required.' };
    }

    try {
        await connectDB();

        const user = await User.findOne({ email });
        if (!user) {
            return { success: false, message: 'Invalid email or password.' };
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return { success: false, message: 'Invalid email or password.' };
        }

        const token = jwt.sign(
            { id: user._id.toString(), name: user.name, email: user.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        const cookieStore = cookies();
        cookieStore.set(TOKEN_COOKIE, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: TOKEN_MAX_AGE,
            path: '/',
        });

        return {
            success: true,
            user: { id: user._id.toString(), name: user.name, email: user.email },
        };
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, message: 'Login failed. Please try again.' };
    }
}

// ─── Forgot password (send OTP) ───────────────────────────────────────────────

function generateOtp() {
    return String(Math.floor(100000 + Math.random() * 900000)); // 6-digit
}

export async function sendPasswordResetOtpAction(formData) {
    const email = formData.get('email')?.toString().trim().toLowerCase();

    if (!email) {
        return { success: false, message: 'Email is required.' };
    }

    try {
        await connectDB();

        const user = await User.findOne({ email });
        if (!user) {
            // Do not reveal whether the account exists.
            return { success: true, message: 'If that email is registered, an OTP has been sent.' };
        }

        const otp = generateOtp();

        // Invalidate any previously sent, unused OTPs for this email.
        await OtpRequest.deleteMany({ email, used: false });

        await OtpRequest.create({
            email,
            otpHash: OtpRequest.hashOtp(otp),
            expiresAt: new Date(Date.now() + OTP_TTL_MS),
        });

        await sendEmail({
            to: email,
            subject: 'Reset your Musica password',
            text: `Your Musica password reset OTP is ${otp}. It is valid for 10 minutes. If you did not request this, you can safely ignore this email.`,
            html: `
                <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;border:1px solid #e2e8f0;border-radius:12px;">
                    <h2 style="color:#1d4ed8;margin:0 0 12px;">Reset your Musica password</h2>
                    <p style="color:#475569;font-size:14px;line-height:1.6;">Use the OTP below to set a new password. It expires in 10 minutes.</p>
                    <div style="margin:20px 0;padding:16px;background:#eff6ff;border-radius:8px;text-align:center;">
                        <span style="font-size:28px;font-weight:700;letter-spacing:6px;color:#1e3a8a;">${otp}</span>
                    </div>
                    <p style="color:#94a3b8;font-size:12px;">If you didn't request this, you can safely ignore this email.</p>
                </div>
            `,
        });

        return { success: true, message: 'OTP sent to your email. It expires in 10 minutes.' };
    } catch (error) {
        console.error('sendPasswordResetOtp error:', error);
        return { success: false, message: 'Failed to send OTP. Please try again.' };
    }
}

// ─── Reset password (verify OTP) ──────────────────────────────────────────────

export async function resetPasswordAction(formData) {
    const email = formData.get('email')?.toString().trim().toLowerCase();
    const otp = formData.get('otp')?.toString().trim();
    const password = formData.get('password')?.toString();

    if (!email || !otp || !password) {
        return { success: false, message: 'All fields are required.' };
    }
    if (password.length < 6) {
        return { success: false, message: 'Password must be at least 6 characters.' };
    }

    try {
        await connectDB();

        const record = await OtpRequest.findOne({ email, used: false }).sort({ createdAt: -1 });
        if (!record || record.otpHash !== OtpRequest.hashOtp(otp)) {
            return { success: false, message: 'Invalid or expired OTP.' };
        }
        if (record.isExpired()) {
            return { success: false, message: 'OTP has expired. Please request a new one.' };
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        await User.updateOne({ email }, { $set: { password: hashedPassword } });

        // OTP is single-use.
        record.used = true;
        await record.save();

        return { success: true, message: 'Password updated. You can now sign in.' };
    } catch (error) {
        console.error('resetPassword error:', error);
        return { success: false, message: 'Failed to reset password. Please try again.' };
    }
}

// ─── Logout ──────────────────────────────────────────────────────────────────

export async function logoutAction() {
    try {
        const cookieStore = cookies();
        cookieStore.delete(TOKEN_COOKIE);
        return { success: true };
    } catch (error) {
        console.error('Logout error:', error);
        return { success: false, message: 'Logout failed.' };
    }
}

// ─── Token helper (use in other server actions to get current user) ───────────

export async function getAuthToken() {
    try {
        const cookieStore = cookies();
        return cookieStore.get(TOKEN_COOKIE)?.value || null;
    } catch {
        return null;
    }
}

export async function verifyAuthToken(token) {
    if (!token) return null;
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch {
        return null;
    }
}

export async function getCurrentUserAction() {
    try {
        const cookieStore = cookies();
        const token = cookieStore.get(TOKEN_COOKIE)?.value;

        if (!token) return { success: false, user: null };

        const decoded = jwt.verify(token, JWT_SECRET);
        return {
            success: true,
            user: { id: decoded.id, name: decoded.name, email: decoded.email },
        };
    } catch {
        return { success: false, user: null };
    }
}
