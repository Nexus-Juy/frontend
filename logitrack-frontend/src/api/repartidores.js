import cliente from './cliente';

export const TIPOS_VEHICULO = ['BICICLETA', 'MOTO', 'AUTO', 'CAMIONETA'];
export const ESTADOS_REPARTIDOR = ['ACTIVO', 'INACTIVO'];

/** @param {string} [estado] ACTIVO o INACTIVO; vacío trae todos @returns {Promise<object[]>} */
export async function listarRepartidores(estado) {
  const { data } = await cliente.get('/api/v1/repartidores', { params: estado ? { estado } : {} });
  return data;
}

/** @param {string} id @returns {Promise<object>} */
export async function obtenerRepartidor(id) {
  const { data } = await cliente.get(`/api/v1/repartidores/${id}`);
  return data;
}

/** @param {object} repartidor nombre, tipoVehiculo, email y teléfono @returns {Promise<object>} */
export async function crearRepartidor(repartidor) {
  const { data } = await cliente.post('/api/v1/repartidores', repartidor);
  return data;
}

/** @param {string} id @param {object} repartidor datos nuevos @returns {Promise<object>} */
export async function actualizarRepartidor(id, repartidor) {
  const { data } = await cliente.put(`/api/v1/repartidores/${id}`, repartidor);
  return data;
}

/** @param {string} id @param {string} estado ACTIVO o INACTIVO @returns {Promise<object>} */
export async function cambiarEstadoRepartidor(id, estado) {
  const { data } = await cliente.patch(`/api/v1/repartidores/${id}/estado`, { estado });
  return data;
}

/** @param {string} id @returns {Promise<{disponible: boolean, estado: string}>} */
export async function consultarDisponibilidad(id) {
  const { data } = await cliente.get(`/api/v1/repartidores/${id}/disponibilidad`);
  return data;
}
