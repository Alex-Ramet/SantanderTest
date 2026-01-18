FROM node:20 AS build-frontend
ARG CONFIGURATION='production'

WORKDIR /app/frontend
COPY frontend/package*.json ./

RUN npm install

COPY frontend/ .

RUN npm run build -- --configuration=$CONFIGURATION --output-path=dist/frontend --output-hashing=all


FROM node:20 AS build-backend

WORKDIR /app/backend
COPY backend/package*.json ./

RUN npm install

COPY backend/ .

RUN npm run build

FROM node:20-alpine

RUN apk add --no-cache nginx bash

COPY --from=build-frontend /app/frontend/dist/frontend /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build-backend /app/backend/dist /app/backend/dist
COPY --from=build-backend /app/backend/package*.json /app/backend/

WORKDIR /app/backend

ENV NODE_ENV=production


COPY start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 80 3000
CMD ["/start.sh"]