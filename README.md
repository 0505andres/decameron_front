# DecameronFront

## Versiones principales

### Frontend
- Angular CLI: `22.0.5`
- Angular Core / Common / Compiler / Forms / Router / Platform Browser / Platform Browser Dynamic / Animations: `^22.0.0`
- Angular SSR: `^22.0.5`
- Angular Material: `^22.0.0`
- Angular CDK: `^22.0.0`
- RxJS: `~7.8.0`
- ngx-papaparse: `^8.0.0`
- Express: `^5.1.0`
- tslib: `^2.3.0`
- TypeScript: `~6.0.2`

### Backend
- Express: `^5.1.0`
- CORS: `^2.8.5`
- body-parser: `^1.20.3`

## Archivos clave

- `angular.json` — configuración del build y entornos.
- `src/environments/environment.ts` — URL de la API en desarrollo.
- `src/environments/environment.prod.ts` — URL de la API en producción.
- `Dockerfile` — build del frontend y runtime de nginx.
- `docker-compose.yml` — define los servicios `frontend` y `backend`.
- `backend/server.js` — backend placeholder con endpoints mock.
- `src/app/services/*` — consumo de API desde Angular.
- `src/app/pages/*` — componentes de reserva y reporte.

## Desarrollo local

1. Instala dependencias:

```bash
npm install
```

2. Inicia el servidor de desarrollo de Angular:

```bash
npm run start
```

3. Abre la app en el navegador:

```text
http://localhost:4200
```

## Build de producción

Para compilar el frontend en modo producción:

```bash
npm run build -- --configuration production
```

Los artefactos se generan en:

```text
dist/decameron_front/browser
```

## Despliegue con Docker

### Levantar la aplicación completa

```bash
docker compose up --build -d
```

Esto crea y arranca los servicios:

- `frontend` en `http://localhost:4200`
- `backend` en `http://localhost:8080`

### Reconstruir solo frontend

```bash
docker compose build frontend
docker compose up -d frontend
```

### Reconstruir solo backend

```bash
docker compose up -d --no-deps --build backend
```

## Configuración de API

En desarrollo, la base URL de la API se configura en:

- `src/environments/environment.ts`

En producción o build con Docker se configura en:

- `src/environments/environment.prod.ts`
- `docker-compose.yml` para la variable de entorno `API_BASE_URL`

### Endpoints relevantes

- `GET /api/hotel`
- `GET /api/tipo-acomodacion`
- `GET /api/tipo-habitacion`
- `GET /api/habitacion/disponible?hotelId=...&tipoHabitacionId=...&acomodacionId=...`
- `GET /api/reserva`
- `POST /api/reserva`
- `GET /api/hotel/rooms-report`

## Notas

- El frontend usa Angular standalone components con Material.
- El backend placeholder es un mock funcional para pruebas locales.
- Si cambias la URL de la API, recompila el frontend o reconstruye el contenedor Docker.
