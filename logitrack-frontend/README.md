# logitrack-frontend

SPA (React + Vite) que usa todas las funciones de LogiTrack **solo a través del api-gateway**.

## Funcionalidades

| Requisito | Dónde está |
|---|---|
| Login por el gateway (`POST /api/v1/auth/login`) | `src/paginas/Login.jsx`, `src/api/auth.js` |
| Crear cuenta de cliente (`POST /api/v1/auth/register`, siempre con rol CLIENTE) | `src/paginas/Registro.jsx` |
| JWT guardado en `sessionStorage` (se borra al cerrar la pestaña) | `src/auth/sesion.js` |
| Rutas privadas (route guards), también por rol | `src/auth/RutaPrivada.jsx`, `src/App.jsx` |
| Menú y botones según el rol del token (ADMIN, CLIENTE, REPARTIDOR) | `src/auth/roles.js`, `src/componentes/Layout.jsx` |
| Interceptor que agrega `Authorization: Bearer <token>` | `src/api/cliente.js` |
| 401 y 403 centralizados: cierre de sesión y vuelta al login | `src/api/cliente.js` |
| Errores del backend (`ProblemDetail`) como avisos en pantalla | `src/api/errores.js`, `src/notificaciones/` |
| Envíos: listado con filtro, seguimiento por código, alta, detalle con historial, cambio de estado, cancelación y asignación de repartidor | `src/paginas/Envios.jsx`, `EnvioNuevo.jsx`, `EnvioDetalle.jsx` |
| Repartidores: listado con filtro, alta, edición, activar/desactivar y disponibilidad | `src/paginas/Repartidores.jsx`, `RepartidorForm.jsx` |

### Qué ve cada rol

| Acción | ADMIN | CLIENTE | REPARTIDOR |
|---|---|---|---|
| Ver envíos | Todos | Los suyos | Los asignados (hoja de ruta) |
| Crear, cancelar y asignar repartidor | Sí | Sí | No |
| Cambiar estado (En ruta, Entregado) | Sí | No | Sí |
| Pantalla de repartidores y su disponibilidad | Sí | No (su interfaz es solo de envíos) | Sí |
| Crear, editar y activar/desactivar repartidores | Sí | No | No |

Ocultar botones es solo para la pantalla: la seguridad real la aplican el gateway y los servicios.

## Ejecutar

### Con Docker (todo el sistema)

Desde el repositorio `infra`, con este repositorio clonado al lado (`../frontend`):

```bash
docker compose up -d
```

Abrir http://localhost:3000. Nginx sirve la app y le pasa `/api/...` al `api-gateway` por la red interna
de Docker, así que el navegador siempre le habla al mismo origen.

### En desarrollo

Con el gateway corriendo en el 8066:

```bash
npm ci
npm run dev
```

Abrir http://localhost:5173. Vite le pasa `/api` al gateway (se cambia con `GATEWAY_URL`, ver `.env.example`).

## Usuarios

Desde la pantalla de login se puede **crear una cuenta de cliente**. Las cuentas ADMIN y REPARTIDOR no se
crean desde la web: se crean con los requests de `infra/http/security.http` (registro con `"rol": "ADMIN"`
o `"rol": "REPARTIDOR"` y su `repartidorId`).

## Docker

`Dockerfile` multietapa: Node 22 compila (`npm run build`) y **Nginx** sirve la carpeta `dist`.

| Archivo | Qué hace |
|---|---|
| `Dockerfile` | Etapa de build con Node y etapa final con `nginx:stable-alpine`; healthcheck en `/salud` |
| `nginx/default.conf.template` | Fallback a `index.html` para las rutas de la SPA y proxy de `/api/` al gateway (`GATEWAY_URL`) |

```bash
docker build -t macostag26/logitrack-frontend:dev .
```

El CI de GitHub compila la app, construye la imagen y prueba el contenedor en cada push.
