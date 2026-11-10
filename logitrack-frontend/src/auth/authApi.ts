import { http } from '../core/http';

export interface LoginRequest {
    username?: string;
    email?: string;
    password?: string;
}

export interface AuthResponse {
    token: string;
}

export const authApi = {
    async login(credentials: LoginRequest): Promise<AuthResponse> {
        const response = await http.post<AuthResponse>('/api/v1/auth/login', credentials);
        return response.data;
    },
    async register(data: Record<string, unknown>): Promise<void> {
        await http.post('/api/v1/auth/register', data);
    },
};