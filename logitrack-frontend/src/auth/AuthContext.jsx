import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { configurarCierreDeSesion } from '../api/cliente';
import { iniciarSesion } from '../api/auth';
import { avisar } from '../notificaciones/avisos';
import { borrarToken, guardarToken, leerToken } from './sesion';
import { estaVencido, leerClaims } from './token';

const AuthContext = createContext(null);

/**
 * Arma el usuario de la sesión a partir del token guardado.
 *
 * @param {string|null} token JWT
 * @param {string} [username] nombre que devolvió el login
 * @returns {object|null} usuario, o null si no hay token o venció
 */
function usuarioDesdeToken(token, username) {
  if (!token) {
    return null;
  }
  const claims = leerClaims(token);
  if (estaVencido(claims)) {
    return null;
  }
  return { ...claims, username: username ?? sessionStorage.getItem('logitrack.usuario') ?? '' };
}

/**
 * Guarda quién está logueado y ofrece login y logout al resto de la app.
 *
 * @param {{children: React.ReactNode}} props
 */
export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(() => {
    const actual = usuarioDesdeToken(leerToken());
    if (!actual) {
      borrarToken();
    }
    return actual;
  });

  const logout = useCallback(
    (motivo) => {
      borrarToken();
      sessionStorage.removeItem('logitrack.usuario');
      setUsuario(null);
      navigate('/login', { replace: true });
      if (motivo) {
        avisar(motivo, 'advertencia');
      }
    },
    [navigate],
  );

  const login = useCallback(
    async (usuarioOEmail, clave) => {
      const respuesta = await iniciarSesion(usuarioOEmail, clave);
      guardarToken(respuesta.token);
      sessionStorage.setItem('logitrack.usuario', respuesta.username);
      setUsuario(usuarioDesdeToken(respuesta.token, respuesta.username));
      avisar(`Bienvenido, ${respuesta.username}`, 'exito');
    },
    [],
  );

  useEffect(() => {
    configurarCierreDeSesion(logout);
  }, [logout]);

  useEffect(() => {
    if (!usuario?.vence) {
      return undefined;
    }
    const restante = usuario.vence - Date.now();
    const temporizador = setTimeout(() => logout('Tu sesión venció. Volvé a iniciar sesión.'), Math.max(restante, 0));
    return () => clearTimeout(temporizador);
  }, [usuario, logout]);

  const valor = useMemo(
    () => ({
      usuario,
      login,
      logout,
      tieneAlgunRol: (roles) => Boolean(usuario?.roles.some((rol) => roles.includes(rol))),
    }),
    [usuario, login, logout],
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

/** @returns {{usuario: object|null, login: Function, logout: Function, tieneAlgunRol: Function}} */
export function useAuth() {
  return useContext(AuthContext);
}
