# Restaurant Management System

نظام إدارة مطعم متكامل يربط بين Laravel backend و React Dashboard frontend.

## المكونات

### 1. Laravel Backend (gustobackend)
- **المسار**: `gustobackend/`
- **التقنيات**: Laravel 10, MySQL, Laravel Sanctum
- **الوظائف**: REST API, Authentication, Database Management

### 2. React Dashboard (Dashboard)
- **المسار**: `Dashboard/`
- **التقنيات**: React, Bootstrap, Recharts
- **الوظائف**: Admin Dashboard, Data Visualization, CRUD Operations

### 3. React Frontend (gusto)
- **المسار**: `gusto/`
- **التقنيات**: React, React Router
- **الوظائف**: Customer Interface, Menu, Reservations

## التشغيل

### Laravel Backend
```bash
cd gustobackend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed
php artisan serve
```

### React Dashboard
```bash
cd Dashboard
npm install
npm start
```

### React Frontend
```bash
cd gusto
npm install
npm start
```

## API Endpoints

### Authentication
- `POST /api/login` - تسجيل دخول
- `POST /api/register` - تسجيل جديد
- `POST /api/logout` - تسجيل خروج

### Users Management
- `GET /api/users` - جلب جميع المستخدمين
- `PUT /api/users/{id}` - تحديث مستخدم
- `DELETE /api/users/{id}` - حذف مستخدم

### Orders Management
- `GET /api/orders` - جلب جميع الطلبات
- `POST /api/orders` - إنشاء طلب جديد
- `PUT /api/orders/{id}` - تحديث حالة الطلب

### Reservations Management
- `GET /api/reservations` - جلب جميع الحجوزات
- `POST /api/reservations` - إنشاء حجز جديد
- `PUT /api/reservations/{id}` - تحديث حالة الحجز

### Analytics
- `GET /api/analytics` - جلب إحصائيات Dashboard

## الميزات

### Dashboard Features
- ✅ إحصائيات شاملة (المستخدمين، الطلبات، الإيرادات)
- ✅ إدارة المستخدمين (عرض، تعديل، حذف)
- ✅ إدارة الطلبات (تتبع الحالة، تحديث)
- ✅ إدارة الحجوزات (تأكيد، إلغاء)
- ✅ الرسوم البيانية والتحليلات
- ✅ واجهة مستجيبة
- ✅ نظام تسجيل دخول

### API Features
- ✅ Laravel Sanctum Authentication
- ✅ CORS Support
- ✅ RESTful API Design
- ✅ Data Validation
- ✅ Error Handling

## قاعدة البيانات

### الجداول الرئيسية
- `users` - المستخدمين
- `orders` - الطلبات
- `reservations` - الحجوزات
- `reviews` - التقييمات
- `tables` - الطاولات

## التكوين

### Laravel Environment
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=restaurant_db
DB_USERNAME=root
DB_PASSWORD=
```

### React Environment
```env
REACT_APP_API_URL=http://localhost:8000/api
```

## الاستخدام

1. تشغيل Laravel backend على `http://localhost:8000`
2. تشغيل React Dashboard على `http://localhost:3000`
3. تسجيل الدخول باستخدام بيانات admin
4. إدارة البيانات من خلال Dashboard

## المطورين

- Laravel Backend: PHP, MySQL, Sanctum
- React Frontend: JavaScript, Bootstrap, Recharts
- API Integration: Fetch API, Axios

## الدعم

للمساعدة أو الاستفسارات، يرجى مراجعة الكود أو إنشاء issue جديد.