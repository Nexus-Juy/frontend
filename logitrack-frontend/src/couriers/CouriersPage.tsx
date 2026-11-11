import React, { useEffect, useState } from 'react';
import { couriersApi } from './couriersApi';
import type { Courier } from './couriersApi';
import { useNotification } from '../core/notifications';
import { extraerMensajeError } from '../core/errors';

export const CouriersPage: React.FC = () => {
    const [couriers, setCouriers] = useState<Courier[]>([]);
    const [loading, setLoading] = useState(false);

    // Formulario nuevo repartidor
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [telefono, setTelefono] = useState('');
    const [vehiculo, setVehiculo] = useState('');
    const [creando, setCreando] = useState(false);

    const { notifySuccess, notifyError } = useNotification();

    const cargarRepartidores = async () => {
        setLoading(true);
        try {
            const data = await couriersApi.getAll();
            setCouriers(data);
        } catch (err) {
            notifyError(extraerMensajeError(err, 'Error al obtener la lista de repartidores.'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void cargarRepartidores();
    }, []);

    const handleCrear = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreando(true);
        try {
            await couriersApi.create({ nombre, email, telefono, vehiculo });
            notifySuccess('Repartidor registrado con éxito.');
            setNombre('');
            setEmail('');
            setTelefono('');
            setVehiculo('');
            void cargarRepartidores();
        } catch (err) {
            notifyError(extraerMensajeError(err, 'Error al registrar repartidor.'));
        } finally {
            setCreando(false);
        }
    };

    const handleToggleEstado = async (id: number, estadoActual: string) => {
        const nuevoEstadoActivo = estadoActual !== 'ACTIVO';
        try {
            await couriersApi.updateEstado(id, nuevoEstadoActivo);
            notifySuccess(`Estado del repartidor #${id} actualizado.`);
            void cargarRepartidores();
        } catch (err) {
            notifyError(extraerMensajeError(err, 'No se pudo cambiar el estado del repartidor.'));
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Gestión de Repartidores</h2>

            <div style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ddd', borderRadius: '6px', maxWidth: '500px' }}>
                <h3>Registrar Nuevo Repartidor</h3>
                <form onSubmit={handleCrear}>
                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'block' }}>Nombre:</label>
                        <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required style={{ width: '100%', padding: '6px' }} />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'block' }}>Email:</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '6px' }} />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'block' }}>Teléfono:</label>
                        <input type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)} required style={{ width: '100%', padding: '6px' }} />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'block' }}>Vehículo:</label>
                        <input type="text" value={vehiculo} onChange={(e) => setVehiculo(e.target.value)} style={{ width: '100%', padding: '6px' }} />
                    </div>
                    <button type="submit" disabled={creando} style={{ padding: '8px 16px', backgroundColor: '#1976d2', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>
                        {creando ? 'Guardando...' : 'Crear Repartidor'}
                    </button>
                </form>
            </div>

            <h3>Listado de Repartidores</h3>
            {loading ? (
                <p>Cargando repartidores...</p>
            ) : couriers.length === 0 ? (
                <p>No hay repartidores registrados.</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                    <tr style={{ backgroundColor: '#f5f5f5', textAlign: 'left' }}>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>ID</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Nombre</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Email</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Teléfono</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Vehículo</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Estado</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Acción</th>
                    </tr>
                    </thead>
                    <tbody>
                    {couriers.map((c) => (
                        <tr key={c.id}>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{c.id}</td>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{c.nombre}</td>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{c.email}</td>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{c.telefono}</td>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{c.vehiculo || 'N/A'}</td>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                <strong>{c.estado}</strong>
                            </td>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                <button onClick={() => void handleToggleEstado(c.id, c.estado)} style={{ padding: '4px 8px', cursor: 'pointer' }}>
                                    {c.estado === 'ACTIVO' ? 'Desactivar' : 'Activar'}
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};