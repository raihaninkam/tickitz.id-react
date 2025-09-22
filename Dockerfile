FROM node:22-alpine3.21 as builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM nginx:stable-bookworm

COPY --from=builder /app/nginx/nginx.conf /etc/nginx/

COPY --from=builder /app/nginx/sites-available/app.conf /etc/nginx/sites-available/

RUN mkdir -p /etc/nginx/sites-enabled
RUN ln -s /etc/nginx/sites-available/app.conf /etc/nginx/sites-enabled/

RUN mkdir -p /var/www/client
COPY --from=builder /app/dist /var/www/client

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]