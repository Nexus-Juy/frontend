/**
 * Guarda el JWT en sessionStorage: dura lo que dura la pestaña y se borra al cerrarla.
 * No se usa localStorage para que el token no quede guardado en la compu después de salir.
 */
const CLAVE = 'logitrack.token';

/** @returns {string|null} el token guardado, o null si no hay sesión */
export function leerToken() {
  try {
    return sessionStorage.getItem(CLAVE);
  } catch {
    return null;
  }
}

/** @param {string} token JWT recibido en el login */
export function guardarToken(token) {
  try {
    sessionStorage.setItem(CLAVE, token);
  } catch {
    /* sin almacenamiento disponible: la sesión dura hasta recargar */
  }
}

/** Borra el token (logout). */
export function borrarToken() {
  try {
    sessionStorage.removeItem(CLAVE);
  } catch {
    /* nada que borrar */
  }
}
