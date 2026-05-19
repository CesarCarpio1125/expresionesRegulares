#!/bin/bash
# Build frontend assets only - PHP/Composer will be handled by Render's PHP runtime
npm install --include=dev && npm run build
php artisan key:generate --force