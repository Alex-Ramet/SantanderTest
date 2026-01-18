#!/bin/bash

# Iniciar backend
node dist/main.js &

# Iniciar nginx
nginx -g 'daemon off;'