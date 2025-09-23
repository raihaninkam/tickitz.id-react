# Build stage
FROM node:20 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

ARG VITE_BE_HOST
ENV VITE_BE_HOST=$VITE_BE_HOST

RUN npm run build

# Serve stage
FROM nginx:alpine
COPY --from=builder /app/nginx/nginx.conf /etc/nginx/
COPY --from=builder /app/nginx/sites-available/app.conf /etc/nginx/sites-available/
COPY --from=builder /app/nginx/includes/proxy.conf /etc/nginx/includes/proxy.conf
# create symlink
RUN mkdir -p /etc/nginx/sites-enabled
RUN ln -s /etc/nginx/sites-available/app.conf /etc/nginx/sites-enabled/
# copy aplikasi dari builder ke lokasi serve
RUN mkdir -p /var/www/client
COPY --from=builder /app/dist /var/www/client
# buka port untuk akses nginx
EXPOSE 80
# jalankan nginx di foreground
CMD [ "nginx", "-g", "daemon off;" ]