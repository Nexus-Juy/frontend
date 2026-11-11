import { useEffect, useState } from 'react';
import { suscribirse } from './avisos';

const DURACION_MS = 6000;

/** Lista de avisos flotantes; cada uno se cierra solo o con la X. */
export default function Avisos() {
  const [avisos, setAvisos] = useState([]);

  useEffect(
    () =>
      suscribirse((aviso) => {
        setAvisos((actuales) => [...actuales.slice(-3), aviso]);
        setTimeout(() => setAvisos((actuales) => actuales.filter((a) => a.id !== aviso.id)), DURACION_MS);
      }),
    [],
  );

  const cerrar = (id) => setAvisos((actuales) => actuales.filter((a) => a.id !== id));

  return (
    <div className="avisos" role="status" aria-live="polite">
      {avisos.map((aviso) => (
        <div key={aviso.id} className={`aviso aviso-${aviso.tipo}`}>
          <div>
            <strong>{aviso.texto}</strong>
            {aviso.detalles.length > 0 && (
              <ul>
                {aviso.detalles.map((detalle) => (
                  <li key={detalle}>{detalle}</li>
                ))}
              </ul>
            )}
          </div>
          <button type="button" className="aviso-cerrar" onClick={() => cerrar(aviso.id)} aria-label="Cerrar aviso">
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
