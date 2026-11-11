import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

/**
 * Guardia de navegación (route guard).
 * Sin sesión manda al login. Si se pasan roles y el usuario no tiene ninguno, lo manda a envíos.
 *
 * @param {{roles?: string[]}} props roles que pueden entrar; si no se pasan, alcanza con estar logueado
 */
export default function RutaPrivada({ roles }) {
  const { usuario, tieneAlgunRol } = useAuth();
  const ubicacion = useLocation();

  if (!usuario) {
    return <Navigate to="/login" replace state={{ desde: ubicacion.pathname }} />;
  }
  if (roles && !tieneAlgunRol(roles)) {
    return <Navigate to="/envios" replace />;
  }
  return <Outlet />;
}
