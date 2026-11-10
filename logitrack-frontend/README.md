# logitrack-frontend

SPA de React + TypeScript (Vite) para LogiTrack. Consume todo a través del `api-gateway` (puerto 8066).

## Desarrollo

```bash
npm install
npm run dev        # http://localhost:5173
```

Necesita el gateway levantado y `VITE_API_URL` (ver `.env.example`). El gateway debe permitir el origen
`http://localhost:5173` en `CORS_ALLOWED_ORIGINS`.

## Con Docker

```bash
docker compose up -d      # desde el repo infra; el frontend queda en http://localhost:3000
```

En el contenedor Nginx sirve la SPA y reenvía `/api/` al `api-gateway`, así que el navegador usa un solo origen.

## Estructura

| Carpeta | Contenido |
|---|---|
| `src/core` | configuración, cliente HTTP con interceptores, errores y notificaciones |
| `src/auth` | login, registro, sesión (JWT) y guardia de rutas |
| `src/shipments` | módulo de envíos |
| `src/couriers` | módulo de repartidores (ADMIN) |

## Usuarios de prueba

Completar con los usuarios ADMIN, CLIENTE y REPARTIDOR de demo (sin contraseñas reales en el repositorio).
