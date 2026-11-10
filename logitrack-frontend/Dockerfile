# syntax=docker/dockerfile:1

# =====================================================================
# logitrack-frontend · imagen multietapa (S4-09)
# SPA de React compilada con Vite y servida por Nginx.
# Se construye desde la raíz de este repositorio:
#   docker build -t <usuario>/logitrack-frontend:4.0.0 .
# =====================================================================

# ---------- Etapa 1: compilación ----------
FROM node:22-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY ../../../AppData/Local/Temp .
# Vacío: en el contenedor el frontend llama a /api/... en su mismo origen y Nginx lo reenvía al gateway.
ARG VITE_API_URL=
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# ---------- Etapa 2: servidor Nginx ----------
FROM nginx:1.27-alpine

LABEL org.opencontainers.image.title="logitrack-frontend" \
      org.opencontainers.image.description="LogiTrack · SPA servida con Nginx" \
      org.opencontainers.image.source="https://github.com/Nexus-Juy/logitrack-frontend"

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

# 127.0.0.1 y no localhost: en Alpine localhost puede resolver a IPv6 y Nginx escucha solo en IPv4.
HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=5 \
    CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1
