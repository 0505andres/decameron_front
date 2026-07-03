# Stage 1: build application
FROM node:26-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build -- --configuration production

# Stage 2: runtime with nginx
FROM nginx:1.26-alpine
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist/decameron_front/browser /usr/share/nginx/html
COPY --from=builder /app/public /usr/share/nginx/html
EXPOSE 4200
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --quiet --spider http://localhost:4200/healthz || exit 1
CMD ["nginx", "-g", "daemon off;"]
