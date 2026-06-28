'use server';

import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'musica_jwt_secret_key_change_in_production';
const TOKEN_COOKIE = 'musica_auth_token';
const TOKEN_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

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
