import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { NotificationProvider } from './core/notifications';
import { AuthProvider } from './auth/AuthContext';
import { LoginPage } from './auth/LoginPage';
import { RegisterPage } from './auth/RegisterPage';
import { RequireAuth } from './auth/RequireAuth';
import { NavBar } from './core/NavBar';

const SinPermisoPage: React.FC = () => (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>403 - Acceso Denegado</h2>
        <p>No tenés los permisos necesarios para acceder a esta sección.</p>
        <Link to="/shipments">Volver a Envíos</Link>
    </div>
);

export const App: React.FC = () => {
    return (
        <NotificationProvider>
            <AuthProvider>
                <BrowserRouter>
                    <NavBar />
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/sin-permiso" element={<SinPermisoPage />} />

                        {/* Próximamente se activan aquí las rutas de /shipments y /couriers */}
                        <Route
                            path="/shipments"
                            element={
                                <RequireAuth>
                                    <div style={{ padding: '20px' }}><h2>Sección de Envíos (En desarrollo S4-05)</h2></div>
                                </RequireAuth>
                            }
                        />

                        <Route path="*" element={<Navigate to="/shipments" replace />} />
                    </Routes>
                </BrowserRouter>
            </AuthProvider>
        </NotificationProvider>
    );
};

export default App;