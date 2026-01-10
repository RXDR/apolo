#!/bin/sh

echo "🚀 Iniciando aplicación APOLO en puerto 3000..."

export PORT=3000
export NODE_ENV=production

echo "▶️ Ejecutando aplicación..."
node server.js
