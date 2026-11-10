import { http } from '../core/http';

export interface Courier {
    id: number;
    nombre: string;
    email: string;
    telefono: string;
    estado: string;
    vehiculo?: string;
}

export interface CreateCourierRequest {
    nombre: string;
    email: string;
    telefono: string;
    vehiculo?: string;
}

export const couriersApi = {
    async getAll(): Promise<Courier[]> {
        const response = await http.get<Courier[]>('/api/v1/repartidores');
        return response.data;
    },

    async getById(id: number): Promise<Courier> {
        const response = await http.get<Courier>(`/api/v1/repartidores/${id}`);
        return response.data;
    },

    async create(data: CreateCourierRequest): Promise<Courier> {
        const response = await http.post<Courier>('/api/v1/repartidores', data);
        return response.data;
    },

    async updateEstado(id: number, activo: boolean): Promise<Courier> {
        const response = await http.put<Courier>(`/api/v1/repartidores/${id}/estado`, { activo });
        return response.data;
    },
};