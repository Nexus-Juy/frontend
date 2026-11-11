import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { actualizarRepartidor, crearRepartidor, obtenerRepartidor, TIPOS_VEHICULO } from '../api/repartidores';
import { avisar } from '../notificaciones/avisos';
import { nombreEstado } from '../formatos';

const VACIO = { nombre: '', tipoVehiculo: 'MOTO', email: '', telefono: '' };

/** Alta y edición de un repartidor (solo ADMIN). Con :id en la ruta edita; sin id, crea uno nuevo. */
export default function RepartidorForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [datos, setDatos] = useState(VACIO);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (id) {
      obtenerRepartidor(id)
        .then((r) => setDatos({ nombre: r.nombre, tipoVehiculo: r.tipoVehiculo, email: r.email, telefono: r.telefono }))
        .catch(() => navigate('/repartidores'));
    }
  }, [id, navigate]);

  const campo = (nombre) => ({
    name: nombre,
    value: datos[nombre],
    onChange: (e) => setDatos((actual) => ({ ...actual, [nombre]: e.target.value })),
  });

  const enviar = async (evento) => {
    evento.preventDefault();
    setEnviando(true);
    try {
      if (id) {
        await actualizarRepartidor(id, datos);
        avisar(`Repartidor ${datos.nombre} actualizado`, 'exito');
      } else {
        await crearRepartidor(datos);
        avisar(`Repartidor ${datos.nombre} creado`, 'exito');
      }
      navigate('/repartidores');
    } catch {
      setEnviando(false);
    }
  };

  return (
    <section>
      <div className="encabezado">
        <h1>{id ? 'Editar repartidor' : 'Nuevo repartidor'}</h1>
        <Link to="/repartidores">← Volver</Link>
      </div>
      <form className="formulario" onSubmit={enviar}>
        <fieldset className="tarjeta">
          <legend>Datos del repartidor</legend>
          <label>
            Nombre <input {...campo('nombre')} required maxLength={120} />
          </label>
          <label>
            Vehículo
            <select {...campo('tipoVehiculo')}>
              {TIPOS_VEHICULO.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {nombreEstado(tipo)}
                </option>
              ))}
            </select>
          </label>
          <label>
            Email <input type="email" {...campo('email')} required maxLength={150} />
          </label>
          <label>
            Teléfono <input {...campo('telefono')} required minLength={6} maxLength={30} />
          </label>
        </fieldset>
        <div className="acciones">
          <button type="submit" disabled={enviando}>
            {enviando ? 'Guardando…' : 'Guardar'}
          </button>
        </div>
      </form>
    </section>
  );
}
