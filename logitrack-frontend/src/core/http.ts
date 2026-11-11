import axios from 'axios';
import { API_BASE_URL, CERRAR_SESION_EN_403, RUTAS_PUBLICAS } from './config';
import { tokenStorage } from '../auth/tokenStorage';

/**
 * Instancia de Axios configurada para comunicarse con el API Gateway.
 */
export const http = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Interceptor de Peticiones (Request):
 * Adjunta la cabecera Authorization Bearer si el token existe y la ruta no es pública.
 */
http.interceptors.request.use(
    (config) => {
        const token = tokenStorage.getToken();
        const esRutaPublica = RUTAS_PUBLICAS.some((ruta) =>
            config.url?.includes(ruta)
        );

        if (token && !esRutaPublica && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

/**
 * Interceptor de Respuestas (Response):
 * Maneja respuestas de error HTTP globales (401 Unauthorized y 403 Forbidden).
 */
http.interceptors.response.use(
    (response) => response,
    (error) => {
        if (axios.isAxiosError(error) && error.response) {
            const status = error.response.status;

            // 401 Unauthorized: token expirado o inválido -> limpiar y redirigir a login
            if (status === 401) {
                tokenStorage.clearToken();
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
            }

            // 403 Forbidden: sin permisos suficientes -> redirigir o cerrar sesión según config
            if (status === 403) {
                if (CERRAR_SESION_EN_403) {
                    tokenStorage.clearToken();
                    if (window.location.pathname !== '/login') {
                        window.location.href = '/login';
                    }
                } else if (window.location.pathname !== '/sin-permiso') {
                    window.location.href = '/sin-permiso';
                }
            }
        }

        return Promise.reject(error);
    }
);