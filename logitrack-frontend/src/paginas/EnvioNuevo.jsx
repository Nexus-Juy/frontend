import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registrarEnvio } from '../api/envios';
import { avisar } from '../notificaciones/avisos';

const VACIO = {
  clienteNombre: '',
  clienteEmail: '',
  clienteTelefono: '',
  origenCalle: '',
  origenNumero: '',
  origenCiudad: 'San Salvador de Jujuy',
  origenCodigoPostal: '4600',
  destinoCalle: '',
  destinoNumero: '',
  destinoCiudad: 'San Salvador de Jujuy',
  destinoCodigoPostal: '4600',
  peso: '',
  ancho: '',
  alto: '',
  largo: '',
};

/** Alta de un envío (ADMIN y CLIENTE). La tarifa la calcula shipment-service. */
export default function EnvioNuevo() {
  const navigate = useNavigate();
  const [datos, setDatos] = useState(VACIO);
  const [enviando, setEnviando] = useState(false);

  const campo = (nombre) => ({
    name: nombre,
    value: datos[nombre],
    onChange: (e) => setDatos((actual) => ({ ...actual, [nombre]: e.target.value })),
  });

  const enviar = async (evento) => {
    evento.preventDefault();
    setEnviando(true);
    try {
      const envio = await registrarEnvio({
        cliente: { nombre: datos.clienteNombre, email: datos.clienteEmail, telefono: datos.clienteTelefono || null },
        origenCalle: datos.origenCalle,
        origenNumero: datos.origenNumero,
        origenCiudad: datos.origenCiudad,
        origenCodigoPostal: datos.origenCodigoPostal,
        destinoCalle: datos.destinoCalle,
        destinoNumero: datos.destinoNumero,
        destinoCiudad: datos.destinoCiudad,
        destinoCodigoPostal: datos.destinoCodigoPostal,
        peso: Number(datos.peso),
        ancho: Number(datos.ancho),
        alto: Number(datos.alto),
        largo: Number(datos.largo),
      });
      avisar(`Envío ${envio.codigoSeguimiento} registrado`, 'exito');
      navigate(`/envios/${envio.id}`);
    } catch {
      setEnviando(false);
    }
  };

  return (
    <section>
      <div className="encabezado">
        <h1>Nuevo envío</h1>
        <Link to="/envios">← Volver</Link>
      </div>
      <form className="formulario" onSubmit={enviar}>
        <fieldset className="tarjeta">
          <legend>Cliente</legend>
          <label>
            Nombre <input {...campo('clienteNombre')} required maxLength={120} />
          </label>
          <label>
            Email <input type="email" {...campo('clienteEmail')} required maxLength={150} />
          </label>
          <label>
            Teléfono <input {...campo('clienteTelefono')} maxLength={30} />
          </label>
        </fieldset>

        {['origen', 'destino'].map((lado) => (
          <fieldset className="tarjeta" key={lado}>
            <legend>{lado === 'origen' ? 'Origen' : 'Destino'}</legend>
            <label>
              Calle <input {...campo(`${lado}Calle`)} required maxLength={120} />
            </label>
            <label>
              Número <input {...campo(`${lado}Numero`)} required maxLength={10} />
            </label>
            <label>
              Ciudad <input {...campo(`${lado}Ciudad`)} required maxLength={80} />
            </label>
            <label>
              Código postal <input {...campo(`${lado}CodigoPostal`)} required maxLength={10} />
            </label>
          </fieldset>
        ))}

        <fieldset className="tarjeta">
          <legend>Paquete</legend>
          <label>
            Peso (kg) <input type="number" step="0.001" min="0.001" {...campo('peso')} required />
          </label>
          <label>
            Ancho (cm) <input type="number" step="0.01" min="0.01" {...campo('ancho')} required />
          </label>
          <label>
            Alto (cm) <input type="number" step="0.01" min="0.01" {...campo('alto')} required />
          </label>
          <label>
            Largo (cm) <input type="number" step="0.01" min="0.01" {...campo('largo')} required />
          </label>
        </fieldset>

        <div className="acciones">
          <button type="submit" disabled={enviando}>
            {enviando ? 'Registrando…' : 'Registrar envío'}
          </button>
        </div>
      </form>
    </section>
  );
}
