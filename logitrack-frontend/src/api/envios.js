import cliente from './cliente';

/** Estados de un envío y a cuáles puede pasar cada uno (las mismas reglas que shipment-service). */
export const ESTADOS_ENVIO = ['PENDIENTE', 'EN_RUTA', 'ENTREGADO', 'CANCELADO'];
export const TRANSICIONES = {
  PENDIENTE: ['EN_RUTA'],
  EN_RUTA: ['ENTREGADO'],
  ENTREGADO: [],
  CANCELADO: [],
};

/**
 * @param {{estado?: string, repartidorId?: string}} filtros filtros opcionales
 * @returns {Promise<object[]>} envíos que el usuario puede ver
 */
export async function listarEnvios(filtros = {}) {
  const params = Object.fromEntries(Object.entries(filtros).filter(([, valor]) => valor));
  const { data } = await cliente.get('/api/v1/envios', { params });
  return data;
}

/** @param {string} id @returns {Promise<object>} */
export async function obtenerEnvio(id) {
  const { data } = await cliente.get(`/api/v1/envios/${id}`);
  return data;
}

/** @param {string} codigo código de seguimiento, por ejemplo LT-2026-000001 @returns {Promise<object>} */
export async function buscarPorCodigo(codigo) {
  const { data } = await cliente.get(`/api/v1/envios/seguimiento/${encodeURIComponent(codigo)}`);
  return data;
}

/** @param {string} id @returns {Promise<object[]>} cambios de estado del envío */
export async function obtenerHistorial(id) {
  const { data } = await cliente.get(`/api/v1/envios/${id}/historial`);
  return data;
}

/** @param {object} envio datos del formulario de alta @returns {Promise<object>} envío creado */
export async function registrarEnvio(envio) {
  const { data } = await cliente.post('/api/v1/envios', envio);
  return data;
}

/** @param {string} id @param {string} estado estado nuevo @returns {Promise<object>} */
export async function cambiarEstadoEnvio(id, estado) {
  const { data } = await cliente.patch(`/api/v1/envios/${id}/estado`, { estado });
  return data;
}

/** @param {string} id @returns {Promise<object>} envío cancelado */
export async function cancelarEnvio(id) {
  const { data } = await cliente.post(`/api/v1/envios/${id}/cancelacion`);
  return data;
}

/** @param {string} id envío @param {string} repartidorId repartidor a asignar @returns {Promise<object>} */
export async function asignarRepartidor(id, repartidorId) {
  const { data } = await cliente.put(`/api/v1/envios/${id}/repartidor`, { repartidorId });
  return data;
}
