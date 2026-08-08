import mongoose from 'mongoose';
import crypto from 'crypto';

const OtpRequestSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, 'Email is required'],
            lowercase: true,
            trim: true,
        },
        otpHash: {
            type: String,
            required: [true, 'OTP hash is required'],
        },
        expiresAt: {
            type: Date,
            required: [true, 'Expiry is required'],
        },
        used: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

OtpRequestSchema.index({ email: 1, used: 1 });

// Hash OTP with SHA-256 before persisting so plaintext is never stored.
OtpRequestSchema.statics.hashOtp = (otp) =>
    crypto.createHash('sha256').update(String(otp)).digest('hex');

OtpRequestSchema.methods.isExpired = function () {
    return this.expiresAt.getTime() < Date.now();
};

// Prevent model re-compilation in dev (hot-reload)
const OtpRequest = mongoose.models.OtpRequest || mongoose.model('OtpRequest', OtpRequestSchema);

export default OtpRequest;
