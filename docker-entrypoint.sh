#!/bin/bash
set -e

echo "=== Iniciando aplicación Laravel ==="

# Función para verificar la conexión a la base de datos
check_db_connection() {
    php -r "
    try {
        \$pdo = new PDO('mysql:host=db;dbname=laravel_db', 'alvaroadmin', '1234');
        echo 'Conexión exitosa';
        exit(0);
    } catch (PDOException \$e) {
        exit(1);
    }
    "
}

# Esperar a que la base de datos esté disponible
echo "Esperando conexión a la base de datos..."
attempt=0
max_attempts=30

while ! check_db_connection > /dev/null 2>&1; do
    attempt=$((attempt + 1))
    if [ $attempt -ge $max_attempts ]; then
        echo "Error: No se pudo conectar a la base de datos después de $max_attempts intentos"
        exit 1
    fi
    echo "Intento $attempt/$max_attempts - Base de datos no disponible, esperando 3 segundos..."
    sleep 3
done

echo "✅ Base de datos conectada exitosamente!"

# Ejecutar comandos de Laravel que requieren base de datos
echo "Limpiando cachés de Laravel..."
php artisan config:clear
php artisan cache:clear
php artisan view:clear
php artisan route:clear

echo "✅ Cachés limpiados"

# Ejecutar migraciones (opcional - descomenta si lo necesitas)
echo "Ejecutando migraciones..."
php artisan migrate --force
echo "✅ Migraciones ejecutadas"

# Crear enlace simbólico para storage (opcional)
if [ ! -L "public/storage" ]; then
    echo "Creando enlace simbólico para storage..."
    php artisan storage:link
    echo "✅ Enlace simbólico creado"
fi

echo "=== Aplicación Laravel lista ==="
echo "Iniciando servidor web..."

# Ejecutar el comando pasado como argumento (apache2-foreground)
exec "$@"