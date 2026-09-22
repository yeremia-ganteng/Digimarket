#!/bin/sh
set -e

# Railway inject $PORT secara dinamis, substitusikan ke config nginx
export PORT="${PORT:-8080}"
envsubst '${PORT}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

# Jalankan supervisor (mengelola nginx + php-fpm sekaligus)
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf