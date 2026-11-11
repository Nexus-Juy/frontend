import { Link } from 'react-router-dom';

/** Página para rutas que no existen. */
export default function NoEncontrada() {
  return (
    <div className="tarjeta vacio">
      <h2>No encontramos esa página</h2>
      <Link to="/envios">Volver a envíos</Link>
    </div>
  );
}
