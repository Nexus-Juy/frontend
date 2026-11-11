import cliente from './cliente';

/**
 * Login contra security-service, pasando por el api-gateway (ruta pública, sin token).
 *
 * @param {string} usuarioOEmail nombre de usuario o email
 * @param {string} clave contraseña
 * @returns {Promise<{token: string, username: string, role: string, userId: string}>}
 */
export async function iniciarSesion(usuarioOEmail, clave) {
  const { data } = await cliente.post('/api/v1/auth/login', { usernameOrEmail: usuarioOEmail, password: clave });
  return data;
}

/**
 * Crea una cuenta nueva con rol CLIENTE (registro público de security-service, por el gateway).
 * Las cuentas ADMIN y REPARTIDOR no se crean desde la web.
 *
 * @param {{username: string, email: string, password: string}} datos
 * @returns {Promise<object>} la respuesta del registro
 */
export async function registrarCliente(datos) {
  const { data } = await cliente.post('/api/v1/auth/register', { ...datos, rol: 'CLIENTE' });
  return data;
}
