import React from 'react';
import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

interface RequireAuthProps {
    children: ReactNode;
    rolesPermitidos?: string[];
}

export const RequireAuth: React.FC<RequireAuthProps> = ({ children, rolesPermitidos }) => {
    const { isAuthenticated, roles } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (rolesPermitidos && rolesPermitidos.length > 0) {
        const tieneRolRequerido = rolesPermitidos.some((rol) => roles.includes(rol));
        if (!tieneRolRequerido) {
            return <Navigate to="/sin-permiso" replace />;
        }
    }

    return <>{children}</>;
};