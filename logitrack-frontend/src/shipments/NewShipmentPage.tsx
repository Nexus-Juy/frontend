import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { shipmentsApi } from './shipmentsApi';
import { useNotification } from '../core/notifications';
import { extraerMensajeError } from '../core/errors';

export const NewShipmentPage: React.FC = () => {
    const [origen, setOrigen] = useState('');
    const [destino, setDestino] = useState('');
    const [detalles, setDetalles] = useState('');
    const [loading, setLoading] = useState(false);

    const { notifySuccess, notifyError } = useNotification();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const nuevo = await shipmentsApi.create({ origen, destino, detalles });
            notifySuccess(`Envío creado correctamente. Tracking: ${nuevo.trackingCode}`);
            navigate('/shipments');
        } catch (err) {
            notifyError(extraerMensajeError(err, 'No se pudo crear el envío.'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '500px', margin: '30px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>Crear Nuevo Envío</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Dirección de Origen:</label>
                    <input
                        type="text"
                        value={origen}
                        onChange={(e) => setOrigen(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Dirección de Destino:</label>
                    <input
                        type="text"
                        value={destino}
                        onChange={(e) => setDestino(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Detalles / Observaciones:</label>
                    <textarea
                        value={detalles}
                        onChange={(e) => setDetalles(e.target.value)}
                        rows={3}
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        type="submit"
                        disabled={loading}
                        style={{ flex: 1, padding: '10px', backgroundColor: '#1976d2', color: '#fff', border: 'none', cursor: 'pointer' }}
                    >
                        {loading ? 'Guardando...' : 'Crear Envío'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/shipments')}
                        style={{ padding: '10px', backgroundColor: '#757575', color: '#fff', border: 'none', cursor: 'pointer' }}
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};