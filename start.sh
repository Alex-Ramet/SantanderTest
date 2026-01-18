#!/bin/bash

node dist/main.js &

nginx -g 'daemon off;'