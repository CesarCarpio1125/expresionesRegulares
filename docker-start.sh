#!/bin/bash
set -e

echo "Running Laravel startup commands..."

# Cache configuration
php artisan config:cache --force || true

# Cache routes
php artisan route:cache --force || true

# Create storage symlink if needed
php artisan storage:link --force || true

# Start Apache
echo "Starting Apache..."
exec apache2-foreground
