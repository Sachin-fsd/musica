'use client';

import { useState, useTransition } from 'react';
import { LogIn, X, Eye, EyeOff, Loader2 } from 'lucide-react';
import { loginAction, registerAction } from '@/app/actions/auth';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

// ─── Shared Input ─────────────────────────────────────────────────────────────

function Field({ label, type = 'text', name, value, onChange, required }) {
    const [show, setShow] = useState(false);
    const isPassword = type === 'password';

    return (
        <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                {label}
            </label>
            <div className="relative">
                <input
                    name={name}
                    type={isPassword && show ? 'text' : type}
                    value={value}
                    onChange={onChange}
                    required={required}
                    autoComplete={isPassword ? 'current-password' : name === 'email' ? 'email' : 'name'}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 
                               bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100
                               focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                               transition-colors pr-10"
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShow(s => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                        tabIndex={-1}
                    >
                        {show ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                )}
            </div>
        </div>
    );
}

// ─── Login Form ───────────────────────────────────────────────────────────────

function LoginForm({ onSuccess, onSwitchToRegister }) {
    const { setUser } = useAuth();
    const [fields, setFields] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [isPending, startTransition] = useTransition();

    const handleChange = (e) => setFields(f => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        const data = new FormData();
        data.set('email', fields.email);
        data.set('password', fields.password);

        startTransition(async () => {
            const res = await loginAction(data);
            if (res.success) {
                setUser(res.user);
                toast.success(`Welcome back, ${res.user.name}!`);
                onSuccess();
            } else {
                setError(res.message);
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="text-center mb-1">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Sign in</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Welcome back to Musica</p>
            </div>

            <Field label="Email" type="email" name="email" value={fields.email} onChange={handleChange} required />
            <Field label="Password" type="password" name="password" value={fields.password} onChange={handleChange} required />

            {error && (
                <p className="text-xs text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">
                    {error}
                </p>
            )}

            <button
                type="submit"
                disabled={isPending}
                className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-60 
                           text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2"
            >
                {isPending ? <Loader2 size={16} className="animate-spin" /> : null}
                {isPending ? 'Signing in…' : 'Sign in'}
            </button>

            <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                Don&apos;t have an account?{' '}
                <button
                    type="button"
                    onClick={onSwitchToRegister}
                    className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                >
                    Register
                </button>
            </p>
        </form>
    );
}

// ─── Register Form ────────────────────────────────────────────────────────────

function RegisterForm({ onSuccess, onSwitchToLogin }) {
    const { setUser } = useAuth();
    const [fields, setFields] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [isPending, startTransition] = useTransition();

    const handleChange = (e) => setFields(f => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        const data = new FormData();
        data.set('name', fields.name);
        data.set('email', fields.email);
        data.set('password', fields.password);

        startTransition(async () => {
            const res = await registerAction(data);
            if (res.success) {
                setUser(res.user);
                toast.success(`Account created! Welcome, ${res.user.name}!`);
                onSuccess();
            } else {
                setError(res.message);
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="text-center mb-1">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Create account</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Join Musica today</p>
            </div>

            <Field label="Name" name="name" value={fields.name} onChange={handleChange} required />
            <Field label="Email" type="email" name="email" value={fields.email} onChange={handleChange} required />
            <Field label="Password" type="password" name="password" value={fields.password} onChange={handleChange} required />

            {error && (
                <p className="text-xs text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">
                    {error}
                </p>
            )}

            <button
                type="submit"
                disabled={isPending}
                className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-60 
                           text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2"
            >
                {isPending ? <Loader2 size={16} className="animate-spin" /> : null}
                {isPending ? 'Creating account…' : 'Create account'}
            </button>

            <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                Already have an account?{' '}
                <button
                    type="button"
                    onClick={onSwitchToLogin}
                    className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                >
                    Sign in
                </button>
            </p>
        </form>
    );
}

// ─── Modal Shell ──────────────────────────────────────────────────────────────

export default function AuthModal({ onClose }) {
    const [view, setView] = useState('login'); // 'login' | 'register'

    return (
        /* Backdrop */
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 border border-slate-100 dark:border-slate-800">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                    aria-label="Close"
                >
                    <X size={18} />
                </button>

                {view === 'login' ? (
                    <LoginForm
                        onSuccess={onClose}
                        onSwitchToRegister={() => setView('register')}
                    />
                ) : (
                    <RegisterForm
                        onSuccess={onClose}
                        onSwitchToLogin={() => setView('login')}
                    />
                )}
            </div>
        </div>
    );
}

// ─── Trigger Button (used in Navbar) ─────────────────────────────────────────

export function LoginButton({ onClick }) {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold
                       bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm"
            aria-label="Login"
        >
            <LogIn size={15} />
            <span className="hidden sm:inline">Login</span>
        </button>
    );
}
