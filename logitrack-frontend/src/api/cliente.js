import axios from 'axios';
import { leerToken } from '../auth/sesion';
import { avisar } from '../notificaciones/avisos';
import { describirError } from './errores';

/**
 * Cliente HTTP de toda la app. Todas las llamadas van a /api/..., que en Docker atiende Nginx y le pasa
 * al api-gateway; en desarrollo hace lo mismo el proxy de Vite.
 */
const cliente = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '',
  timeout: 15000,
});

let cerrarSesion = () => {};

/**
 * El AuthProvider registra acá su logout, para que el interceptor pueda cerrar la sesión.
 *
 * @param {Function} funcion recibe el motivo del cierre
 */
export function configurarCierreDeSesion(funcion) {
  cerrarSesion = funcion;
}

/** Interceptor de salida: agrega "Authorization: Bearer <token>" a cada petición si hay sesión. */
cliente.interceptors.request.use((config) => {
  const token = leerToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Interceptor de respuesta: manejo centralizado de errores.
 * 401 y 403 cierran la sesión y llevan al login (una sola vez, aunque fallen varias peticiones a la vez).
 * El resto se muestra como aviso con el ProblemDetail.
 * Los errores del login no cierran nada: solo se avisan (por ejemplo, credenciales inválidas).
 */
cliente.interceptors.response.use(
  (respuesta) => respuesta,
  (error) => {
    const status = error.response?.status;
    const esAutenticacion = error.config?.url?.startsWith('/api/v1/auth/');
    const cierraSesion = !esAutenticacion && (status === 401 || status === 403);

    if (cierraSesion) {
      if (leerToken()) {
        cerrarSesion(
          status === 401
            ? 'Tu sesión no es válida o venció. Volvé a iniciar sesión.'
            : 'No tenés permiso para esa operación. Se cerró la sesión por seguridad.',
        );
      }
    } else {
      const { texto, detalles } = describirError(error);
      avisar(texto, 'error', detalles);
    }
    return Promise.reject(error);
  },
);

export default cliente;
