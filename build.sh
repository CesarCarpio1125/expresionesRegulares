#!/bin/bash
# Install PHP dependencies (this will be handled by Render's PHP buildpack)
# The vendor folder should be included in the repo or built separately

# Build frontend assets if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    npm install --include=dev
fi

# Build Vue assets
npm run build

# Generate Laravel key if not set
php artisan key:generate --force