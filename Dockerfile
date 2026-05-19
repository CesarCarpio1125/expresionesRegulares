FROM php:8.2-apache

# Instalar extensiones necesarias
RUN docker-php-ext-install pdo bcmath

# Habilitar mod_rewrite
RUN a2enmod rewrite

# Configurar Apache para Laravel
RUN sed -i 's|DocumentRoot /var/www/html|DocumentRoot /var/www/html/public|' /etc/apache2/sites-available/000-default.conf
RUN sed -i 's|<Directory /var/www/html>|<Directory /var/www/html/public>|' /etc/apache2/sites-available/000-default.conf
RUN sed -i 's|AllowOverride None|AllowOverride All|' /etc/apache2/sites-available/000-default.conf

WORKDIR /var/www/html

COPY . .

# Instalar composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Instalar dependencias con retry
RUN composer install --no-dev --optimize-autoloader --ignore-platform-reqs --no-interaction || \
    composer update --no-dev --optimize-autoloader --ignore-platform-reqs --no-interaction

# Build assets
RUN npm ci --legacy-peer-deps && npm run build

# Permisos
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
RUN chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Optimizar Laravel
RUN php artisan config:cache && php artisan route:cache && php artisan view:cache

EXPOSE 80

CMD ["apache2-foreground"]