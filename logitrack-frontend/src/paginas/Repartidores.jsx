import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { PERMISOS } from '../auth/roles';
import { cambiarEstadoRepartidor, consultarDisponibilidad, ESTADOS_REPARTIDOR, listarRepartidores } from '../api/repartidores';
import { avisar } from '../notificaciones/avisos';
import Estado from '../componentes/Estado';
import { nombreEstado } from '../formatos';

/** Listado de repartidores (courier-service). Alta, edición y activar/desactivar son solo del ADMIN. */
export default function Repartidores() {
  const { tieneAlgunRol } = useAuth();
  const esAdmin = tieneAlgunRol(PERMISOS.gestionarRepartidores);
  const [estado, setEstado] = useState('');
  const [repartidores, setRepartidores] = useState([]);
  const [cargando, setCargando] = useState(true);

  const cargar = useCallback(() => {
    setCargando(true);
    return listarRepartidores(estado)
      .then(setRepartidores)
      .catch(() => setRepartidores([]))
      .finally(() => setCargando(false));
  }, [estado]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const verDisponibilidad = async (repartidor) => {
    try {
      const resultado = await consultarDisponibilidad(repartidor.id);
      avisar(
        `${repartidor.nombre} ${resultado.disponible ? 'está disponible' : 'no está disponible'}`,
        resultado.disponible ? 'exito' : 'advertencia',
        [`Estado: ${nombreEstado(resultado.estado)}`],
      );
    } catch {
      /* el aviso ya lo mostró el interceptor */
    }
  };

  const alternarEstado = async (repartidor) => {
    const nuevo = repartidor.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO';
    try {
      await cambiarEstadoRepartidor(repartidor.id, nuevo);
      avisar(`${repartidor.nombre} ahora está ${nombreEstado(nuevo).toLowerCase()}`, 'exito');
      await cargar();
    } catch {
      /* el aviso ya lo mostró el interceptor */
    }
  };

  return (
    <section>
      <div className="encabezado">
        <h1>Repartidores</h1>
        {esAdmin && (
          <Link className="boton" to="/repartidores/nuevo">
            + Nuevo repartidor
          </Link>
        )}
      </div>

      <div className="filtros tarjeta">
        <label>
          Estado
          <select value={estado} onChange={(e) => setEstado(e.target.value)}>
            <option value="">Todos</option>
            {ESTADOS_REPARTIDOR.map((valor) => (
              <option key={valor} value={valor}>
                {nombreEstado(valor)}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="tarjeta tabla-contenedor">
        {cargando ? (
          <p className="tenue">Cargando repartidores…</p>
        ) : repartidores.length === 0 ? (
          <p className="tenue">No hay repartidores para mostrar.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Vehículo</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Estado</th>
                <th aria-label="Acciones" />
              </tr>
            </thead>
            <tbody>
              {repartidores.map((r) => (
                <tr key={r.id}>
                  <td>{r.nombre}</td>
                  <td>{nombreEstado(r.tipoVehiculo)}</td>
                  <td>{r.email}</td>
                  <td>{r.telefono}</td>
                  <td>
                    <Estado valor={r.estado} />
                  </td>
                  <td className="botones-fila">
                    <button type="button" className="secundario" onClick={() => verDisponibilidad(r)}>
                      Disponibilidad
                    </button>
                    {esAdmin && (
                      <>
                        <Link className="boton secundario" to={`/repartidores/${r.id}/editar`}>
                          Editar
                        </Link>
                        <button type="button" className={r.estado === 'ACTIVO' ? 'peligro' : ''} onClick={() => alternarEstado(r)}>
                          {r.estado === 'ACTIVO' ? 'Desactivar' : 'Activar'}
                        </button>
                      </>
                    )}
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
