FROM node:20 AS build-frontend
ARG CONFIGURATION='production'

WORKDIR /app/frontend
COPY frontend/package*.json ./

RUN npm install

COPY frontend/ .

RUN npm run build -- --configuration=$CONFIGURATION


FROM node:20 AS build-backend

WORKDIR /app/backend
COPY backend/package*.json ./

RUN npm install

COPY backend/ .

RUN npm run build

FROM node:20-alpine

RUN apk add --no-cache nginx bash

COPY --from=build-frontend /app/frontend/dist/frontend /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

WORKDIR /app/backend

COPY --from=build-backend /app/backend/dist /app/backend/dist
COPY --from=build-backend /app/backend/package*.json /app/backend/
COPY --from=build-backend /app/backend/node_modules ./node_modules



ENV NODE_ENV=production


COPY start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 80 3000
CMD ["/start.sh"]