/**
 * Avisos (notificaciones) que se muestran arriba a la derecha.
 * Cualquier parte de la app, incluso el cliente HTTP que no es un componente, puede llamar a avisar().
 */
const suscriptores = new Set();
let proximoId = 1;

/**
 * Muestra un aviso.
 *
 * @param {string} texto mensaje principal
 * @param {'exito'|'error'|'advertencia'|'info'} [tipo] color del aviso
 * @param {string[]} [detalles] líneas extra (por ejemplo, los campos inválidos)
 */
export function avisar(texto, tipo = 'info', detalles = []) {
  const aviso = { id: proximoId++, texto, tipo, detalles };
  suscriptores.forEach((escuchar) => escuchar(aviso));
}

/**
 * @param {Function} escuchar función que recibe cada aviso nuevo
 * @returns {Function} función para dejar de escuchar
 */
export function suscribirse(escuchar) {
  suscriptores.add(escuchar);
  return () => suscriptores.delete(escuchar);
}
