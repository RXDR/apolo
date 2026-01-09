#!/bin/sh

echo "🚀 Iniciando aplicación APOLO en puerto 8080..."

export PORT=8080
export NODE_ENV=production

echo "▶️ Ejecutando aplicación..."
node server.js
