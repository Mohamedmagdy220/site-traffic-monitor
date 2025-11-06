# استخدم صورة Node.js الرسمية كأساس
FROM node:18-alpine

# حدد مجلد العمل داخل الحاوية
WORKDIR /app

# انسخ ملفات المشروع إلى داخل الحاوية
COPY . .
Run npm install prom-client
# أخبر Docker إن التطبيق بيشتغل على البورت 3000
EXPOSE 3000

# الأمر اللي يشغل التطبيق
CMD ["node", "server.js"]
