# ใช้ภาพ PHP + Apache
FROM php:8.2-apache

# เปิด mod_rewrite
RUN a2enmod rewrite

# ติดตั้ง extension ที่จำเป็น
RUN docker-php-ext-install mysqli pdo pdo_mysql

# ตั้งค่า Document Root
WORKDIR /var/www/html

# คัดลอกโค้ดทั้งหมดเข้า container
COPY . /var/www/html

# ให้ Apache เข้าถึงไฟล์ทุกตัว
RUN chown -R www-data:www-data /var/www/html
