import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { tokenStorage } from './tokenStorage';
import { decodeJwt } from './jwt';

interface AuthContextType {
    token: string | null;
    roles: string[];
    isAuthenticated: boolean;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(tokenStorage.getToken());
    const [roles, setRoles] = useState<string[]>([]);

    useEffect(() => {
        if (token) {
            const payload = decodeJwt(token);
            if (payload && Array.isArray(payload.roles)) {
                setRoles(payload.roles);
            } else {
                setRoles([]);
            }
        } else {
            setRoles([]);
        }
    }, [token]);

    const login = (newToken: string) => {
        tokenStorage.setToken(newToken);
        setToken(newToken);
    };

    const logout = () => {
        tokenStorage.clearToken();
        setToken(null);
        setRoles([]);
    };

    return (
        <AuthContext.Provider
            value={{
                token,
                roles,
                isAuthenticated: !!token,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de AuthProvider');
    }
    return context;
};