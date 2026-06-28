'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getCurrentUserAction, logoutAction } from '@/app/actions/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    // Hydrate user from server cookie on mount
    useEffect(() => {
        getCurrentUserAction().then((res) => {
            if (res.success && res.user) setUser(res.user);
        }).finally(() => setAuthLoading(false));
    }, []);

    const logout = useCallback(async () => {
        await logoutAction();
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, authLoading, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
