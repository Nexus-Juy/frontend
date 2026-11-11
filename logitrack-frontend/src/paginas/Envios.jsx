import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { PERMISOS, REPARTIDOR } from '../auth/roles';
import { buscarPorCodigo, ESTADOS_ENVIO, listarEnvios } from '../api/envios';
import { listarRepartidores } from '../api/repartidores';
import Estado from '../componentes/Estado';
import { fecha, moneda, nombreEstado } from '../formatos';

/**
 * Listado de envíos. Cada rol ve lo suyo (lo filtra shipment-service): el ADMIN todos, el CLIENTE los
 * de su cuenta y el REPARTIDOR solo los que tiene asignados.
 */
export default function Envios() {
  const { tieneAlgunRol } = useAuth();
  const navigate = useNavigate();
  const [estado, setEstado] = useState('');
  const [envios, setEnvios] = useState([]);
  const [nombres, setNombres] = useState({});
  const [cargando, setCargando] = useState(true);
  const [codigo, setCodigo] = useState('');
  const esRepartidor = tieneAlgunRol([REPARTIDOR]);

  useEffect(() => {
    let vigente = true;
    setCargando(true);
    listarEnvios({ estado })
      .then((datos) => vigente && setEnvios(datos))
      .catch(() => vigente && setEnvios([]))
      .finally(() => vigente && setCargando(false));
    return () => {
      vigente = false;
    };
  }, [estado]);

  useEffect(() => {
    listarRepartidores()
      .then((lista) => setNombres(Object.fromEntries(lista.map((r) => [r.id, r.nombre]))))
      .catch(() => setNombres({}));
  }, []);

  const buscar = async (evento) => {
    evento.preventDefault();
    if (!codigo.trim()) {
      return;
    }
    try {
      const envio = await buscarPorCodigo(codigo.trim());
      navigate(`/envios/${envio.id}`);
    } catch {
      /* el aviso ya lo mostró el interceptor */
    }
  };

  return (
    <section>
      <div className="encabezado">
        <h1>{esRepartidor ? 'Mi hoja de ruta' : 'Envíos'}</h1>
        {tieneAlgunRol(PERMISOS.crearEnvio) && (
          <Link className="boton" to="/envios/nuevo">
            + Nuevo envío
          </Link>
        )}
      </div>

      <div className="filtros tarjeta">
        <label>
          Estado
          <select value={estado} onChange={(e) => setEstado(e.target.value)}>
            <option value="">Todos</option>
            {ESTADOS_ENVIO.map((valor) => (
              <option key={valor} value={valor}>
                {nombreEstado(valor)}
              </option>
            ))}
          </select>
        </label>
        <form className="buscar" onSubmit={buscar}>
          <label>
            Seguimiento
            <input placeholder="LT-2026-000001" value={codigo} onChange={(e) => setCodigo(e.target.value)} />
          </label>
          <button type="submit" className="secundario">
            Buscar
          </button>
        </form>
      </div>

      <div className="tarjeta tabla-contenedor">
        {cargando ? (
          <p className="tenue">Cargando envíos…</p>
        ) : envios.length === 0 ? (
          <p className="tenue">No hay envíos para mostrar.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Estado</th>
                <th>Origen → Destino</th>
                <th>Peso</th>
                <th>Tarifa</th>
                <th>Repartidor</th>
                <th>Creado</th>
              </tr>
            </thead>
            <tbody>
              {envios.map((envio) => (
                <tr key={envio.id} className="fila-link" onClick={() => navigate(`/envios/${envio.id}`)}>
                  <td>
                    <Link to={`/envios/${envio.id}`} onClick={(e) => e.stopPropagation()}>
                      {envio.codigoSeguimiento}
                    </Link>
                  </td>
                  <td>
                    <Estado valor={envio.estado} />
                  </td>
                  <td>
                    {envio.origen?.ciudad} → {envio.destino?.ciudad}
                  </td>
                  <td>{envio.pesoKg} kg</td>
                  <td>{moneda(envio.tarifa)}</td>
                  <td>{envio.repartidorId ? nombres[envio.repartidorId] ?? 'Asignado' : <span className="tenue">Sin asignar</span>}</td>
                  <td>{fecha(envio.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
