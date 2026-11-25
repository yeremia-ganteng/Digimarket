FROM php:8.4-fpm

RUN apt-get update && apt-get install -y \
    git curl libpng-dev libonig-dev libxml2-dev zip unzip \
    nginx supervisor gettext-base \
    && rm -rf /var/lib/apt/lists/*

RUN docker-php-ext-install pdo pdo_mysql mbstring exif pcntl bcmath

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# Konfigurasi non-rahasia disimpan di image; nilai rahasia (APP_KEY, DB_PASSWORD,
# Midtrans keys) diisi lewat environment variables platform.
ENV APP_ENV=production \
    APP_DEBUG=false \
    APP_URL=https://digimarket-api-e7c74.containers.snapdeploy.app \
    APP_LOCALE=en \
    APP_FALLBACK_LOCALE=en \
    BCRYPT_ROUNDS=12 \
    LOG_CHANNEL=stderr \
    LOG_STACK=single \
    LOG_LEVEL=error \
    DB_CONNECTION=mysql \
    DB_HOST=gateway01.ap-southeast-1.prod.aws.tidbcloud.com \
    DB_PORT=4000 \
    DB_DATABASE=digimarket \
    DB_USERNAME=2QWmb94LW4ykfHE.root \
    MYSQL_ATTR_SSL_CA=/etc/ssl/certs/ca-certificates.crt \
    SESSION_DRIVER=database \
    SESSION_LIFETIME=120 \
    CACHE_STORE=database \
    QUEUE_CONNECTION=database \
    FILESYSTEM_DISK=local \
    BROADCAST_CONNECTION=log \
    SANCTUM_STATEFUL_DOMAINS=digimarket-self.vercel.app \
    FRONTEND_URL=https://digimarket-self.vercel.app \
    MIDTRANS_IS_PRODUCTION=false

COPY backend/ .

RUN composer install --no-interaction --optimize-autoloader --no-dev
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache
RUN chmod -R 775 /var/www/storage /var/www/bootstrap/cache
RUN php artisan storage:link

COPY backend/docker/nginx.conf.template /etc/nginx/templates/default.conf.template
COPY backend/docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY backend/docker/php-fpm.conf /usr/local/etc/php-fpm.d/zz-digimarket.conf
COPY backend/docker/start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 8080

CMD ["/start.sh"]