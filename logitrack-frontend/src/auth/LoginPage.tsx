import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from './authApi';
import { useAuth } from './AuthContext';
import { useNotification } from '../core/notifications';
import { extraerMensajeError } from '../core/errors';

export const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const { notifySuccess, notifyError } = useNotification();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await authApi.login({ username, password });
            login(response.token);
            notifySuccess('¡Sesión iniciada con éxito!');
            navigate('/');
        } catch (err) {
            notifyError(extraerMensajeError(err, 'Credenciales inválidas.'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '40px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>Iniciar Sesión en LogiTrack</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Usuario:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Contraseña:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>
                <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px', cursor: 'pointer' }}>
                    {loading ? 'Ingresando...' : 'Ingresar'}
                </button>
            </form>
            <p style={{ marginTop: '15px', textAlign: 'center' }}>
                ¿No tenés cuenta? <Link to="/register">Registrate como cliente</Link>
            </p>
        </div>
    );
};