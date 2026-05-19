# Use PHP 8.4 with Apache
FROM php:8.4-apache

# Habilitar extensiones SQLite que vienen incluidas en la imagen base
RUN docker-php-ext-enable pdo_sqlite

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Install PHP extensions - solo las básicas
RUN docker-php-ext-install pdo bcmath

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Configure Apache - enable rewrite
RUN a2enmod rewrite

# Configure Apache to use public folder as DocumentRoot
RUN sed -i 's|DocumentRoot /var/www/html|DocumentRoot /var/www/html/public|' /etc/apache2/sites-available/000-default.conf
RUN sed -i 's|<Directory /var/www/html>|<Directory /var/www/html/public>|' /etc/apache2/sites-available/000-default.conf
RUN sed -i 's|AllowOverride None|AllowOverride All|' /etc/apache2/sites-available/000-default.conf

# Allow .htaccess in Apache config
RUN sed -i 's/AllowOverride None/AllowOverride All/g' /etc/apache2/apache2.conf

# Set working directory
WORKDIR /var/www/html

# Copy composer files first for better caching
COPY composer.json composer.lock ./

# Install dependencies
RUN composer install --optimize-autoloader --no-dev

# Copy rest of application
COPY . /var/www/html

# Build Vite assets for production
RUN npm ci && npm run build

# Fix ownership
RUN chown -R www-data:www-data /var/www/html

# Set permissions
RUN find /var/www/html -type d -exec chmod 755 {} \; \
    && find /var/www/html -type f -exec chmod 644 {} \;

# Ensure storage and bootstrap/cache are writable
RUN chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Generate optimized class map
RUN php artisan optimize

# Expose port 80
EXPOSE 80

# Start Apache
CMD ["apache2-foreground"]