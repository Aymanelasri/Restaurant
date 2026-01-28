# PHP CLI image
FROM php:8.2-cli

# تثبيت الأدوات الضرورية
RUN apt-get update && apt-get install -y \
    unzip git curl libzip-dev libonig-dev nodejs npm \
    && docker-php-ext-install zip pdo pdo_mysql

# تثبيت Composer عالميًا
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# نسخ ملفات المشروع
WORKDIR /app
COPY . /app

# تثبيت مكتبات PHP و Node.js
RUN composer install --ignore-platform-reqs
RUN npm install

# فتح البورت باش Laravel يخدم
EXPOSE 8000

# الأمر الرئيسي لتشغيل Laravel
CMD php artisan serve --host=0.0.0.0 --port=8000
