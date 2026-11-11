import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { PERMISOS } from '../auth/roles';
import {
  asignarRepartidor,
  cambiarEstadoEnvio,
  cancelarEnvio,
  obtenerEnvio,
  obtenerHistorial,
  TRANSICIONES,
} from '../api/envios';
import { listarRepartidores, obtenerRepartidor } from '../api/repartidores';
import { avisar } from '../notificaciones/avisos';
import Estado from '../componentes/Estado';
import { direccion, fecha, moneda, nombreEstado } from '../formatos';

/**
 * Detalle de un envío con su historial y las acciones que permite el rol del usuario:
 * cambiar estado (ADMIN y REPARTIDOR), cancelar y asignar repartidor (ADMIN y CLIENTE).
 */
export default function EnvioDetalle() {
  const { id } = useParams();
  const { tieneAlgunRol } = useAuth();
  const [envio, setEnvio] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [repartidor, setRepartidor] = useState(null);
  const [activos, setActivos] = useState([]);
  const [elegido, setElegido] = useState('');
  const [confirmarCancelacion, setConfirmarCancelacion] = useState(false);
  const [ocupado, setOcupado] = useState(false);

  const puedeCambiarEstado = tieneAlgunRol(PERMISOS.cambiarEstadoEnvio);
  const puedeCancelar = tieneAlgunRol(PERMISOS.cancelarEnvio);
  const puedeAsignar = tieneAlgunRol(PERMISOS.asignarRepartidor);

  const cargar = useCallback(async () => {
    const [datos, cambios] = await Promise.all([obtenerEnvio(id), obtenerHistorial(id)]);
    setEnvio(datos);
    setHistorial(cambios);
    setRepartidor(datos.repartidorId ? await obtenerRepartidor(datos.repartidorId).catch(() => null) : null);
  }, [id]);

  useEffect(() => {
    cargar().catch(() => setEnvio(undefined));
  }, [cargar]);

  useEffect(() => {
    if (puedeAsignar && envio?.estado === 'PENDIENTE') {
      listarRepartidores('ACTIVO').then(setActivos).catch(() => setActivos([]));
    }
  }, [puedeAsignar, envio?.estado]);

  const ejecutar = async (accion, mensaje) => {
    setOcupado(true);
    try {
      await accion();
      avisar(mensaje, 'exito');
      setConfirmarCancelacion(false);
      setElegido('');
      await cargar();
    } catch {
      /* el aviso ya lo mostró el interceptor */
    } finally {
      setOcupado(false);
    }
  };

  if (envio === undefined) {
    return (
      <div className="tarjeta vacio">
        <p>No se pudo cargar el envío.</p>
        <Link to="/envios">Volver a envíos</Link>
      </div>
    );
  }
  if (!envio) {
    return <p className="tenue">Cargando envío…</p>;
  }

  const siguientes = TRANSICIONES[envio.estado] ?? [];
  const esPendiente = envio.estado === 'PENDIENTE';

  return (
    <section>
      <div className="encabezado">
        <h1>
          Envío {envio.codigoSeguimiento} <Estado valor={envio.estado} />
        </h1>
        <Link to="/envios">← Volver</Link>
      </div>

      <div className="grilla">
        <div className="tarjeta">
          <h2>Datos</h2>
          <dl>
            <dt>Origen</dt>
            <dd>{direccion(envio.origen)}</dd>
            <dt>Destino</dt>
            <dd>{direccion(envio.destino)}</dd>
            <dt>Paquete</dt>
            <dd>
              {envio.pesoKg} kg · {envio.anchoCm} × {envio.altoCm} × {envio.largoCm} cm
            </dd>
            <dt>Tarifa</dt>
            <dd>{moneda(envio.tarifa)}</dd>
            <dt>Repartidor</dt>
            <dd>{repartidor ? `${repartidor.nombre} (${repartidor.tipoVehiculo.toLowerCase()})` : 'Sin asignar'}</dd>
            <dt>Creado</dt>
            <dd>{fecha(envio.createdAt)}</dd>
          </dl>
        </div>

        <div className="tarjeta">
          <h2>Acciones</h2>
          {puedeCambiarEstado && siguientes.length > 0 && (
            <div className="accion">
              <span>Cambiar estado:</span>
              {siguientes.map((destino) => (
                <button
                  key={destino}
                  type="button"
                  disabled={ocupado}
                  onClick={() => ejecutar(() => cambiarEstadoEnvio(envio.id, destino), `Envío pasado a ${nombreEstado(destino)}`)}
                >
                  Pasar a {nombreEstado(destino)}
                </button>
              ))}
            </div>
          )}

          {puedeAsignar && esPendiente && (
            <div className="accion">
              <span>Asignar repartidor:</span>
              <select value={elegido} onChange={(e) => setElegido(e.target.value)}>
                <option value="">Elegir un repartidor activo…</option>
                {activos.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.nombre} · {r.tipoVehiculo.toLowerCase()}
                  </option>
                ))}
              </select>
              <button
                type="button"
                disabled={!elegido || ocupado}
                onClick={() => ejecutar(() => asignarRepartidor(envio.id, elegido), 'Repartidor asignado')}
              >
                Asignar
              </button>
            </div>
          )}

          {puedeCancelar && esPendiente && (
            <div className="accion">
              {confirmarCancelacion ? (
                <>
                  <span>¿Cancelar el envío? No se puede deshacer.</span>
                  <button
                    type="button"
                    className="peligro"
                    disabled={ocupado}
                    onClick={() => ejecutar(() => cancelarEnvio(envio.id), 'Envío cancelado')}
                  >
                    Sí, cancelar
                  </button>
                  <button type="button" className="secundario" onClick={() => setConfirmarCancelacion(false)}>
                    No
                  </button>
                </>
              ) : (
                <button type="button" className="peligro" onClick={() => setConfirmarCancelacion(true)}>
                  Cancelar envío
                </button>
              )}
            </div>
          )}

          {!(puedeCambiarEstado && siguientes.length > 0) && !(esPendiente && (puedeAsignar || puedeCancelar)) && (
            <p className="tenue">No hay acciones disponibles para este envío.</p>
          )}
        </div>
      </div>

      <div className="tarjeta">
        <h2>Historial</h2>
        {historial.length === 0 ? (
          <p className="tenue">Todavía no tuvo cambios de estado.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>De</th>
                <th>A</th>
              </tr>
            </thead>
            <tbody>
              {historial.map((cambio) => (
                <tr key={`${cambio.fechaHora}-${cambio.estadoNuevo}`}>
                  <td>{fecha(cambio.fechaHora)}</td>
                  <td>{cambio.estadoAnterior ? <Estado valor={cambio.estadoAnterior} /> : '—'}</td>
                  <td>
                    <Estado valor={cambio.estadoNuevo} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
