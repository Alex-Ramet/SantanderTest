#!/bin/bash

# Iniciar backend
node /app/backend/dist/main.js &

# Iniciar nginx
nginx -g 'daemon off;'