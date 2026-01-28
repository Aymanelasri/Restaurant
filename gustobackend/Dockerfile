# PHP CLI image
FROM php:8.2-cli


RUN apt-get update && apt-get install -y \
    unzip git curl libzip-dev libonig-dev nodejs npm \
    && docker-php-ext-install zip pdo pdo_mysql


RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer


WORKDIR /app
COPY . /app


RUN composer install --ignore-platform-reqs
RUN npm install


EXPOSE 8000


CMD php artisan serve --host=0.0.0.0 --port=8000
