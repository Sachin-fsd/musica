import nodemailer from 'nodemailer';

const FROM_EMAIL = process.env.EMAIL_FROM || process.env.SMTP_USER || 'no-reply@musica.app';

let transporter = null;

export function getTransporter() {
    if (transporter) return transporter;

    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT || 587),
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    } else {
        // Fallback: Gmail requires an "App Password" set at
        // https://myaccount.google.com/apppasswords
        transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD,
            },
        });
    }

    return transporter;
}

export async function sendEmail({ to, subject, text, html }) {
    const mailer = getTransporter();
    return mailer.sendMail({
        from: FROM_EMAIL,
        to,
        subject,
        text,
        html,
    });
}
