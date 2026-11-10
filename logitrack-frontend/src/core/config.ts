/**
 * Configuración centralizada del frontend.
 */

/**
 * URL base del API Gateway.
 * En desarrollo apunta a localhost:8066 (o la variable VITE_API_URL).
 * En producción (Docker con Nginx proxy) puede ser /api si Nginx redirige al gateway.
 */
export const API_BASE_URL: string =
    (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:8066';

/**
 * Si es true, ante un 403 Forbidden se cierra la sesión (limpia token y redirige a login).
 * Si es false, solo se redirige a /sin-permiso manteniendo la sesión activa.
 */
export const CERRAR_SESION_EN_403 = false;

/**
 * Rutas que no requieren token (evita adjuntar la cabecera Authorization).
 */
export const RUTAS_PUBLICAS = ['/api/v1/auth/login', '/api/v1/auth/register'];