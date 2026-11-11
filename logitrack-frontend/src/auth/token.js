/**
 * Lee los datos del JWT (sin validarlo: eso lo hacen el gateway y los servicios).
 * El token tiene tres partes separadas por puntos; la del medio es un JSON en base64url con los claims
 * que pone security-service: sub (id del usuario), roles (por ejemplo ["ADMIN"]), repartidorId y exp.
 *
 * @param {string} token JWT
 * @returns {{usuarioId: string, roles: string[], repartidorId: string|null, vence: number}|null}
 */
export function leerClaims(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join(''),
    );
    const claims = JSON.parse(json);
    return {
      usuarioId: claims.sub,
      roles: Array.isArray(claims.roles) ? claims.roles : [],
      repartidorId: claims.repartidorId ?? null,
      vence: claims.exp ? claims.exp * 1000 : 0,
    };
  } catch {
    return null;
  }
}

/**
 * @param {{vence: number}|null} claims datos del token
 * @returns {boolean} true si el token ya venció o no se pudo leer
 */
export function estaVencido(claims) {
  return !claims || (claims.vence > 0 && claims.vence <= Date.now());
}
