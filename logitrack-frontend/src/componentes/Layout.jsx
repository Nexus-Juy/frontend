import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { PERMISOS } from '../auth/roles';

/** Barra de arriba con el menú (según el rol) y el usuario logueado; abajo, la página actual. */
export default function Layout() {
  const { usuario, logout, tieneAlgunRol } = useAuth();

  return (
    <>
      <header className="barra">
        <div className="barra-contenido">
          <span className="marca">
            <img src="/logitrack.svg" alt="" width="28" height="28" /> LogiTrack
          </span>
          <nav>
            <NavLink to="/envios">Envíos</NavLink>
            {tieneAlgunRol(PERMISOS.verRepartidores) && <NavLink to="/repartidores">Repartidores</NavLink>}
          </nav>
          <div className="usuario">
            <span>{usuario.username}</span>
            {usuario.roles.map((rol) => (
              <span key={rol} className={`rol rol-${rol.toLowerCase()}`}>
                {rol}
              </span>
            ))}
            <button type="button" className="secundario" onClick={() => logout('Cerraste la sesión.')}>
              Salir
            </button>
          </div>
        </div>
      </header>
      <main className="contenido">
        <Outlet />
      </main>
    </>
  );
}
