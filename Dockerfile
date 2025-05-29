FROM php:8.2-apache

# Instala extensiones necesarias de PHP
RUN apt-get update && apt-get install -y \
    libzip-dev zip unzip git curl libpng-dev libonig-dev libxml2-dev \
    && docker-php-ext-install pdo pdo_mysql zip mbstring exif bcmath

# Activa mod_rewrite para Laravel
RUN a2enmod rewrite

# Copia Composer desde la imagen oficial
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Establece el directorio de trabajo
WORKDIR /var/www/html

# Copia los archivos del proyecto al contenedor
COPY . /var/www/html

# Instala dependencias de Laravel
RUN composer install --no-dev --optimize-autoloader

# Crear archivo .env desde .env.example
RUN cp .env.example .env

# Generar APP_KEY
RUN php artisan key:generate

# Limpiar caché de Laravel
RUN php artisan config:clear && \
    php artisan cache:clear && \
    php artisan view:clear && \
    php artisan route:clear

# Establece permisos adecuados
RUN chmod -R 755 /var/www/html \
    && chown -R www-data:www-data /var/www/html \
    && chmod -R 775 /var/www/html/storage \
    && chmod -R 775 /var/www/html/bootstrap/cache

# Cambia el DocumentRoot a public/
RUN sed -i 's|DocumentRoot /var/www/html|DocumentRoot /var/www/html/public|g' /etc/apache2/sites-available/000-default.conf

# Permite .htaccess en public/
RUN echo '<Directory /var/www/html/public>' >> /etc/apache2/apache2.conf \
    && echo '    Options Indexes FollowSymLinks' >> /etc/apache2/apache2.conf \
    && echo '    AllowOverride All' >> /etc/apache2/apache2.conf \
    && echo '    Require all granted' >> /etc/apache2/apache2.conf \
    && echo '</Directory>' >> /etc/apache2/apache2.conf

# Configurar ServerName para evitar warnings de Apache
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Expone el puerto 80
EXPOSE 80

# Comando de arranque del contenedor
CMD ["apache2-foreground"]