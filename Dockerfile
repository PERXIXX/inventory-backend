FROM php:8.2-apache

# Enable Apache rewrite
RUN a2enmod rewrite

# Install PostgreSQL PDO
RUN apt-get update && apt-get install -y libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql

# Copy project files
COPY . /var/www/html/

# Apache permission fix
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

EXPOSE 80
