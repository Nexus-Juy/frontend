import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export const NavBar: React.FC = () => {
    const { isAuthenticated, roles, logout } = useAuth();
    const navigate = useNavigate();

    if (!isAuthenticated) return null;

    const esAdmin = roles.includes('ADMIN');
    const esCliente = roles.includes('CLIENTE');
    const esRepartidor = roles.includes('REPARTIDOR');

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav style={{ padding: '10px 20px', backgroundColor: '#1976d2', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <strong style={{ fontSize: '1.2rem' }}>LogiTrack</strong>
                <Link to="/shipments" style={{ color: '#fff', textDecoration: 'none' }}>Envíos</Link>

                {esCliente && (
                    <Link to="/shipments/nuevo" style={{ color: '#fff', textDecoration: 'none' }}>+ Crear Envío</Link>
                )}

                {(esAdmin || esRepartidor) && (
                    <Link to="/couriers" style={{ color: '#fff', textDecoration: 'none' }}>Repartidores</Link>
                )}
            </div>

            <div>
        <span style={{ marginRight: '15px', fontSize: '0.9rem', opacity: 0.9 }}>
          Roles: {roles.join(', ') || 'Sin rol'}
        </span>
                <button onClick={handleLogout} style={{ padding: '6px 12px', cursor: 'pointer', backgroundColor: '#d32f2f', color: '#fff', border: 'none', borderRadius: '4px' }}>
                    Cerrar Sesión
                </button>
            </div>
        </nav>
    );
};