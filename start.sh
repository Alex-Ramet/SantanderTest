#!/bin/bash

node /app/backend/dist/main.js &

nginx -g 'daemon off;'
