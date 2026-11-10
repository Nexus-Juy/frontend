import axios from 'axios';
import { API_BASE_URL } from './config';

/**
 * Cliente Axios base configurado con la URL del API Gateway.
 */
export const http = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});