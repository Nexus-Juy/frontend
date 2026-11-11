/** Funciones chicas para mostrar datos lindos en pantalla. */

/** @param {string} instante fecha ISO @returns {string} por ejemplo "4/11/2026, 10:30" */
export function fecha(instante) {
  return instante ? new Date(instante).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' }) : '—';
}

/** @param {number} valor @returns {string} por ejemplo "$ 1.250,00" */
export function moneda(valor) {
  return valor == null ? '—' : Number(valor).toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
}

/** @param {string} estado por ejemplo EN_RUTA @returns {string} "En ruta" */
export function nombreEstado(estado) {
  const texto = (estado ?? '').replace('_', ' ').toLowerCase();
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

/** @param {{calle: string, numero: string, ciudad: string}} d dirección @returns {string} */
export function direccion(d) {
  return d ? `${d.calle} ${d.numero}, ${d.ciudad}` : '—';
}
