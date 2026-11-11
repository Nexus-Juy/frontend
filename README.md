# frontend · LogiTrack

Cliente web de LogiTrack (Sprint 4): una SPA en React que consume todo el sistema a través del
**api-gateway**. El proyecto está en la carpeta [`logitrack-frontend`](logitrack-frontend).

| | |
|---|---|
| Tecnología | React 19 + Vite, React Router y axios |
| En Docker | http://localhost:3000 (Nginx) |
| En desarrollo | http://localhost:5173 (`npm run dev`) |

El sistema completo (servicios, gateway, bases y este frontend) se levanta desde el repositorio
[`infra`](https://github.com/Nexus-Juy/infra) con `docker compose up -d`. El detalle está en el
[README del frontend](logitrack-frontend/README.md).
