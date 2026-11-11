import { nombreEstado } from '../formatos';

/** Etiqueta de color con el estado de un envío o de un repartidor. @param {{valor: string}} props */
export default function Estado({ valor }) {
  return <span className={`estado estado-${(valor ?? '').toLowerCase()}`}>{nombreEstado(valor)}</span>;
}
