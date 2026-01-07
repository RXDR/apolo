# 🚀 Despliegue APOLO CRM en Dokploy

## Configuración para Dokploy

### Paso 1: Configurar el proyecto en Dokploy
1. En el panel de Dokploy, crear un nuevo proyecto
2. Usar el tipo: **Dockerfile**
3. Puerto: **8080**

### Paso 2: Variables de entorno requeridas
```bash
PORT=8080
NODE_ENV=production
HOSTNAME=0.0.0.0

# Variables de Supabase (configura con tus valores)
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima
SUPABASE_SERVICE_ROLE_KEY=tu_clave_de_servicio
```

### Paso 3: Health Check
- **Endpoint**: `/health`
- **Puerto**: `8080` 
- **Intervalo**: `30s`
- **Timeout**: `10s`
- **Reintentos**: `3`

### Paso 4: Construir y desplegar
```bash
# El Dockerfile ya está optimizado para puerto 8080
# Dokploy automáticamente:
# 1. Construirá la imagen usando el Dockerfile
# 2. Expondrá el puerto 8080
# 3. Configurará el health check en /health
# 4. Reiniciará automáticamente si falla
```

## ✅ Solución al problema de performance

Este setup resuelve el problema de los health checks fallidos que estaban causando lentitud en el servidor Docker porque:

1. **Puerto correcto**: La aplicación ahora corre en puerto 8080 (que Dokploy espera)
2. **Health check funcional**: El endpoint `/health` responde correctamente
3. **Headers optimizados**: Sin cache para health checks
4. **Información detallada**: El health check incluye métricas útiles
5. **Múltiples métodos HTTP**: Soporta GET, POST, PUT, HEAD

## 🔍 Verificación

Una vez desplegado, puedes verificar:

```bash
# Health check
curl http://tu-dominio.com/health

# Respuesta esperada:
{
  "status": "OK",
  "timestamp": "2026-01-07T...",
  "uptime": 123.45,
  "environment": "production",
  "port": "8080",
  "version": "1.0.0",
  "memory": {
    "used": 45.67,
    "total": 128.0,
    "percentage": 35
  }
}
```

## 📁 Archivos importantes para Dokploy
- `Dockerfile` - Configurado para puerto 8080
- `start.sh` - Script de inicio optimizado
- `docker-compose.yml` - Configuración de contenedor
- `dokploy.json` - Configuración específica de Dokploy
- `.env.production` - Variables de entorno de producción
- `app/api/health/route.ts` - Endpoint de health check