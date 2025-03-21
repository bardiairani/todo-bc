# انتخاب تصویر پایه از Node.js
FROM node:16

# تعیین دایرکتوری کاری در کانتینر
WORKDIR /app

# کپی کردن فایل‌های package.json و package-lock.json به دایرکتوری کاری
COPY package*.json ./

# نصب وابستگی‌ها
RUN npm install

# کپی کردن تمام فایل‌ها به کانتینر
COPY . .

# تنظیم پورت برای اپلیکیشن
EXPOSE 5000

# دستور برای شروع سرور
CMD ["node", "server.js"]
