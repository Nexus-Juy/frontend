/**
 * Convierte un error de axios en un texto para mostrar.
 * Los servicios responden los errores como ProblemDetail: title, detail y, en los de validación,
 * los campos inválidos en "errors" (shipment y courier) o "invalid-params" (security).
 *
 * @param {any} error error que devolvió axios
 * @returns {{texto: string, detalles: string[]}}
 */
export function describirError(error) {
  if (!error.response) {
    return {
      texto: 'No se pudo conectar con el servidor',
      detalles: ['Revisá que el sistema esté levantado (docker compose up -d).'],
    };
  }
  const problema = error.response.data ?? {};
  const titulo = problema.title ?? `Error ${error.response.status}`;
  const campos = problema.errors ?? problema['invalid-params'] ?? {};
  const detalles = Object.entries(campos).map(([campo, mensaje]) => `${campo}: ${mensaje}`);
  if (problema.detail && detalles.length === 0) {
    detalles.push(problema.detail);
  }
  return { texto: titulo, detalles };
}
