# Build frontend
FROM node:20 AS build
ARG CONFIGURATION='development'
WORKDIR /app

COPY ./frontend/package.json .

RUN npm install

COPY ./frontend/. .
RUN npm run build -- --configuration=$CONFIGURATION --output-path=dist/frontend --output-hashing=all

FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]

# Build backend
FROM node:20-alpine

WORKDIR /app

COPY ./backend/package*.json ./
RUN npm install

COPY ./backend. .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]