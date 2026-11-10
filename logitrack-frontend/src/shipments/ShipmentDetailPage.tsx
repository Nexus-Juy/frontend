import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { shipmentsApi } from './shipmentsApi';
import type { Shipment } from './shipmentsApi';
import { useAuth } from '../auth/AuthContext';
import { useNotification } from '../core/notifications';
import { extraerMensajeError } from '../core/errors';

export const ShipmentDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [shipment, setShipment] = useState<Shipment | null>(null);
    const [loading, setLoading] = useState(false);
    const [nuevoEstado, setNuevoEstado] = useState('');
    const [repartidorId, setRepartidorId] = useState('');

    const { roles } = useAuth();
    const { notifySuccess, notifyError } = useNotification();
    const navigate = useNavigate();

    const esAdmin = roles.includes('ADMIN');
    const esRepartidor = roles.includes('REPARTIDOR');

    const cargarDetalle = async () => {
        if (!id) return;
        setLoading(true);
        try {
            const data = await shipmentsApi.getById(Number(id));
            setShipment(data);
            setNuevoEstado(data.estado);
        } catch (err) {
            notifyError(extraerMensajeError(err, 'Error al cargar el detalle del envío.'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void cargarDetalle();
    }, [id]);

    const handleCambiarEstado = async () => {
        if (!shipment) return;
        try {
            const actualizado = await shipmentsApi.updateEstado(shipment.id, nuevoEstado);
            setShipment(actualizado);
            notifySuccess(`Estado actualizado a ${nuevoEstado}`);
        } catch (err) {
            notifyError(extraerMensajeError(err, 'No se pudo cambiar el estado.'));
        }
    };

    const handleAsignarRepartidor = async () => {
        if (!shipment || !repartidorId) return;
        try {
            const actualizado = await shipmentsApi.asignarRepartidor(shipment.id, Number(repartidorId));
            setShipment(actualizado);
            notifySuccess(`Repartidor #${repartidorId} asignado exitosamente.`);
        } catch (err) {
            notifyError(extraerMensajeError(err, 'Error al asignar repartidor (Verifique Feign fallback / disponibilidad).'));
        }
    };

    const handleCancelar = async () => {
        if (!shipment || !window.confirm('¿Seguro que desea cancelar este envío?')) return;
        try {
            await shipmentsApi.cancelar(shipment.id);
            notifySuccess('Envío cancelado.');
            navigate('/shipments');
        } catch (err) {
            notifyError(extraerMensajeError(err, 'No se puede cancelar un envío que no está PENDIENTE.'));
        }
    };

    if (loading) return <p style={{ padding: '20px' }}>Cargando detalle...</p>;
    if (!shipment) return <p style={{ padding: '20px' }}>Envío no encontrado.</p>;

    return (
        <div style={{ maxWidth: '600px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>Detalle del Envío #{shipment.id}</h2>
            <p><strong>Tracking:</strong> {shipment.trackingCode}</p>
            <p><strong>Origen:</strong> {shipment.origen}</p>
            <p><strong>Destino:</strong> {shipment.destino}</p>
            <p><strong>Estado Actual:</strong> {shipment.estado}</p>
            <p><strong>Repartidor Asignado:</strong> {shipment.repartidorId ? `#${shipment.repartidorId}` : 'Ninguno'}</p>
            {shipment.detalles && <p><strong>Detalles:</strong> {shipment.detalles}</p>}

            <hr style={{ margin: '20px 0' }} />

            {(esAdmin || esRepartidor) && (
                <div style={{ marginBottom: '20px' }}>
                    <h4>Cambiar Estado:</h4>
                    <select value={nuevoEstado} onChange={(e) => setNuevoEstado(e.target.value)} style={{ padding: '6px', marginRight: '10px' }}>
                        <option value="PENDIENTE">PENDIENTE</option>
                        <option value="EN_CAMINO">EN_CAMINO</option>
                        <option value="ENTREGADO">ENTREGADO</option>
                    </select>
                    <button onClick={handleCambiarEstado} style={{ padding: '6px 12px', cursor: 'pointer' }}>Actualizar Estado</button>
                </div>
            )}

            {esAdmin && (
                <div style={{ marginBottom: '20px' }}>
                    <h4>Asignar Repartidor:</h4>
                    <input
                        type="number"
                        placeholder="ID Repartidor"
                        value={repartidorId}
                        onChange={(e) => setRepartidorId(e.target.value)}
                        style={{ padding: '6px', marginRight: '10px' }}
                    />
                    <button onClick={handleAsignarRepartidor} style={{ padding: '6px 12px', cursor: 'pointer' }}>Asignar</button>
                </div>
            )}

            {shipment.estado === 'PENDIENTE' && (
                <button onClick={handleCancelar} style={{ padding: '8px 16px', backgroundColor: '#d32f2f', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>
                    Cancelar Envío
                </button>
            )}

            <button onClick={() => navigate('/shipments')} style={{ marginLeft: '10px', padding: '8px 16px', cursor: 'pointer' }}>
                Volver
            </button>
        </div>
    );
};