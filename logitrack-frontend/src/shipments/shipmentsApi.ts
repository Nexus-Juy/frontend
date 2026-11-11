import { http } from '../core/http';

export interface Shipment {
    id: number;
    trackingCode: string;
    origen: string;
    destino: string;
    estado: string;
    clienteId?: number;
    repartidorId?: number;
    fechaCreacion?: string;
    detalles?: string;
}

export interface CreateShipmentRequest {
    origen: string;
    destino: string;
    detalles?: string;
}

export const shipmentsApi = {
    async getAll(estado?: string): Promise<Shipment[]> {
        const params = estado ? { estado } : {};
        const response = await http.get<Shipment[]>('/api/v1/envios', { params });
        return response.data;
    },

    async getById(id: number): Promise<Shipment> {
        const response = await http.get<Shipment>(`/api/v1/envios/${id}`);
        return response.data;
    },

    async getByTrackingCode(trackingCode: string): Promise<Shipment> {
        const response = await http.get<Shipment>(`/api/v1/envios/tracking/${trackingCode}`);
        return response.data;
    },

    async create(data: CreateShipmentRequest): Promise<Shipment> {
        const response = await http.post<Shipment>('/api/v1/envios', data);
        return response.data;
    },

    async updateEstado(id: number, nuevoEstado: string): Promise<Shipment> {
        const response = await http.put<Shipment>(`/api/v1/envios/${id}/estado`, { estado: nuevoEstado });
        return response.data;
    },

    async cancelar(id: number): Promise<void> {
        await http.delete(`/api/v1/envios/${id}`);
    },

    async asignarRepartidor(id: number, repartidorId: number): Promise<Shipment> {
        const response = await http.put<Shipment>(`/api/v1/envios/${id}/asignar`, { repartidorId });
        return response.data;
    },
};