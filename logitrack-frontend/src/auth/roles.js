/** Roles de LogiTrack, tal como vienen en el claim "roles" del JWT. */
export const ADMIN = 'ADMIN';
export const CLIENTE = 'CLIENTE';
export const REPARTIDOR = 'REPARTIDOR';

/**
 * Qué puede hacer cada rol en la pantalla. Son las mismas reglas que aplican el gateway y los
 * servicios: acá solo sirven para mostrar u ocultar botones; la seguridad real está en el backend.
 */
export const PERMISOS = {
  crearEnvio: [ADMIN, CLIENTE],
  cancelarEnvio: [ADMIN, CLIENTE],
  asignarRepartidor: [ADMIN, CLIENTE],
  cambiarEstadoEnvio: [ADMIN, REPARTIDOR],
  verRepartidores: [ADMIN, CLIENTE, REPARTIDOR],
  gestionarRepartidores: [ADMIN],
};
