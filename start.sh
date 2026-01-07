#!/bin/bash

# Script de inicio para Dokploy
# Este script asegura que la aplicación se ejecute en el puerto 8080

echo "🚀 Iniciando aplicación APOLO en puerto 8080..."

# Exportar variables de entorno necesarias
export PORT=8080
export NODE_ENV=production

# Verificar que el puerto esté disponible
if lsof -i:8080; then
    echo "⚠️  Puerto 8080 está en uso, liberando..."
    pkill -f "node.*server.js" || true
    sleep 2
fi

# Iniciar la aplicación
echo "▶️  Ejecutando aplicación..."
node server.js

echo "✅ Aplicación iniciada en http://localhost:8080"
echo "🔍 Health check disponible en: http://localhost:8080/health"