import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { shipmentsApi } from './shipmentsApi';
import type { Shipment } from './shipmentsApi';
import { useAuth } from '../auth/AuthContext';
import { useNotification } from '../core/notifications';
import { extraerMensajeError } from '../core/errors';

export const ShipmentsPage: React.FC = () => {
    const [shipments, setShipments] = useState<Shipment[]>([]);
    const [filtroEstado, setFiltroEstado] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const { roles } = useAuth();
    const { notifyError } = useNotification();
    const esCliente = roles.includes('CLIENTE');

    const cargarEnvios = async () => {
        setLoading(true);
        try {
            const data = await shipmentsApi.getAll(filtroEstado || undefined);
            setShipments(data);
        } catch (err) {
            notifyError(extraerMensajeError(err, 'Error al obtener la lista de envíos.'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void cargarEnvios();
    }, [filtroEstado]);

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Gestión de Envíos</h2>
                {esCliente && (
                    <Link to="/shipments/nuevo" style={{ padding: '8px 16px', backgroundColor: '#2e7d32', color: '#fff', textDecoration: 'none', borderRadius: '4px' }}>
                        + Crear Envío
                    </Link>
                )}
            </div>

            <div style={{ marginBottom: '15px' }}>
                <label style={{ marginRight: '10px' }}>Filtrar por estado:</label>
                <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} style={{ padding: '6px' }}>
                    <option value="">Todos</option>
                    <option value="PENDIENTE">PENDIENTE</option>
                    <option value="EN_CAMINO">EN_CAMINO</option>
                    <option value="ENTREGADO">ENTREGADO</option>
                    <option value="CANCELADO">CANCELADO</option>
                </select>
            </div>

            {loading ? (
                <p>Cargando envíos...</p>
            ) : shipments.length === 0 ? (
                <p>No se encontraron envíos.</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                    <tr style={{ backgroundColor: '#f5f5f5', textAlign: 'left' }}>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>ID</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Código Tracking</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Origen</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Destino</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Estado</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {shipments.map((item) => (
                        <tr key={item.id}>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{item.id}</td>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{item.trackingCode}</td>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{item.origen}</td>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{item.destino}</td>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                <strong>{item.estado}</strong>
                            </td>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                <Link to={`/shipments/${item.id}`} style={{ color: '#1976d2' }}>Ver Detalle</Link>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};