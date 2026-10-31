# LogiTrack · infraestructura

Repositorio que **levanta todo el sistema LogiTrack** (Desarrollo y Arquitecturas Avanzadas de Software, FI UNJu
2026): los cuatro servicios y sus tres bases MySQL, con Docker Compose.

## Repositorios del proyecto

| Repositorio | Puerto | Qué hace |
|---|---|---|
| `config-server` | 8888 | Entrega la configuración de cada servicio (Spring Cloud Config) |
| `security-service` | 8083 | Usuarios, login (BCrypt) y emisión de JWT (HS256) |
| `courier-service` | 8082 | Gestión de repartidores y su disponibilidad |
| `shipment-service` | 8081 | Envíos; consulta a courier-service con OpenFeign para asignar repartidores |
| `logitrack-config` | — | Archivos `.yml` por servicio y ambiente (lo lee el config-server) |
| **`infra`** (este) | — | `docker-compose`, scripts de base de datos y requests de prueba |

## Cómo levantarlo (con las imágenes de Docker Hub)

Solo hace falta **Docker Desktop** abierto.

```bash
cp .env.example .env        # en PowerShell: copy .env.example .env
# completar .env (ver abajo)
docker compose up -d
docker compose ps
```

En 1 o 2 minutos tienen que aparecer los 7 contenedores en `healthy`.

### Completar el `.env`

| Variable | Qué poner |
|---|---|
| `DOCKERHUB_USER` / `IMAGE_TAG` | Usuario de Docker Hub y versión de las imágenes |
| `DB_USER` / `DB_PASSWORD` / `MYSQL_ROOT_PASSWORD` | Credenciales de MySQL (las que quieran) |
| `JWT_SECRET` | Obligatoria, **mínimo 32 caracteres**. Generar con `openssl rand -base64 48` |

PowerShell, sin `openssl`:

```powershell
$b = New-Object byte[] 48; [Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($b); [Convert]::ToBase64String($b)
```

El `.env` tiene secretos y **no se sube a Git** (está en el `.gitignore`).

## Construir las imágenes desde el código

Hace falta cuando se cambió algo en un servicio y todavía no está publicado. Se clonan los repos uno al lado
del otro:

```
ProyectoFinalDAAS/
├── infra/
├── config-server/
├── security-service/
├── courier-service/
└── shipment-service/
```

```bash
cd infra
docker compose -f docker-compose.yml -f docker-compose.build.yml up -d --build
```

## Publicar una versión nueva en Docker Hub

Las imágenes publicadas como `1.0.0` se construyeron con el código del monorepo original. Después de cambiar
los servicios (independencia de módulos, OpenFeign, cifrado), conviene publicar una versión nueva:

```bash
docker login
# en .env: IMAGE_TAG=1.1.0
docker compose -f docker-compose.yml -f docker-compose.build.yml build
docker compose -f docker-compose.yml -f docker-compose.build.yml push
```

## Probar que funciona

- Swagger de envíos: http://localhost:8081/swagger-ui.html
- Health: http://localhost:8081/actuator/health (también 8082, 8083 y 8888)
- Configuración servida: http://localhost:8888/shipment-service/prod
- Carpeta `http/`: requests listos para ejecutar desde IntelliJ (el primero registra un usuario ADMIN y guarda el
  token para los demás).

## Detener

```bash
docker compose down        # frena y borra los contenedores
docker compose down -v     # además borra las bases (se recrean con los scripts de db/init)
```

## Problemas frecuentes

| Síntoma | Causa y solución |
|---|---|
| `Falta DB_PASSWORD` / `Falta JWT_SECRET` | No existe el `.env` o está incompleto |
| `security-service` (o cualquier servicio) se reinicia | `JWT_SECRET` con menos de 32 caracteres. Ver `docker compose logs security-service` |
| `config-server` no queda `healthy` | No llega a GitHub para clonar `logitrack-config`, o el repo es privado |
| Puertos ocupados (8081-8083, 8888, 3307-3309) | Frenar lo que los usa, por ejemplo servicios corriendo desde el IDE |
| Datos viejos o esquema desactualizado | `docker compose down -v` y volver a levantar |
