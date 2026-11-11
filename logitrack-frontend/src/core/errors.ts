import { AxiosError } from 'axios';

/** Estructura estándar RFC 7807 ProblemDetail emitida por el backend */
export interface ProblemDetail {
    type?: string;
    title?: string;
    status?: number;
    detail?: string;
    instance?: string;
    properties?: Record<string, unknown>;
}

/**
 * Extrae un mensaje de error claro a partir de una excepción de Axios o ProblemDetail.
 */
export function extraerMensajeError(error: unknown, defaultMsg: string = 'Ocurrió un error inesperado.'): string {
    if (!error) return defaultMsg;

    if (typeof error === 'string') return error;

    const axiosErr = error as AxiosError<ProblemDetail>;
    if (axiosErr.response?.data?.detail) {
        return axiosErr.response.data.detail;
    }

    if (axiosErr.response?.data?.title) {
        return axiosErr.response.data.title;
    }

    if (axiosErr.message) {
        return axiosErr.message;
    }

    return defaultMsg;
}