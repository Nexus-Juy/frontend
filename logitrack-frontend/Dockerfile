# =====================================================================
# logitrack-frontend · imagen multietapa (S4-09)
#
# Etapa 1: Node compila la SPA (npm run build -> carpeta dist/).
# Etapa 2: Nginx sirve esos archivos y le pasa /api al api-gateway por la red interna de Docker.
#
# Construir desde la carpeta logitrack-frontend:
#   docker build -t macostag26/logitrack-frontend:dev .
# =====================================================================

FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY index.html vite.config.js ./
COPY public ./public
COPY src ./src
RUN npm run build

FROM nginx:stable-alpine
LABEL org.opencontainers.image.title="logitrack-frontend" \
      org.opencontainers.image.description="LogiTrack · Cliente web (SPA React servida por Nginx)" \
      org.opencontainers.image.source="https://github.com/Nexus-Juy/frontend"

# Dirección del gateway dentro de la red de Docker. Nginx la completa en la configuración al arrancar.
ENV GATEWAY_URL=http://api-gateway:8066

COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
HEALTHCHECK --interval=15s --timeout=3s --start-period=10s --retries=5 \
    CMD wget -qO- http://127.0.0.1/salud || exit 1
