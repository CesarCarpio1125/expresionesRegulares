#!/bin/bash
# Build command for Render
# Install PHP dependencies with composer
composer install --no-dev --optimize-autoloader

# Install and build Node assets
npm install --include=dev && npm run build

# Generate Laravel key if needed
php artisan key:generate --force