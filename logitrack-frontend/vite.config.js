import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Configuración de Vite.
 * En desarrollo (npm run dev) la app corre en http://localhost:5173 y las llamadas a /api se pasan al
 * api-gateway (http://localhost:8066), igual que hace Nginx en Docker. Así el navegador siempre le
 * habla al mismo origen.
 */
export default defineConfig(({ mode }) => {
  const variables = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/api': variables.GATEWAY_URL ?? 'http://localhost:8066',
      },
    },
  };
});
