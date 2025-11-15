# خلاصه سامانه آریو طلا

## معماری
- **Next.js 16 (App Router)** با ساختار ماژولار (`src/app/(site)`, `(auth)`, `(app)`, `(admin)`).
- **Prisma + PostgreSQL** برای مدل داده‌ها و تراکنش‌های اتمیک.
- **NextAuth (JWT strategy)** جهت مدیریت نشست کاربران و نقش‌ها.
- **shadcn/ui + Tailwind** برای UI سازگار با RTL.

## مدل‌های داده
- `User`, `KycProfile`, `Document`, `Wallet`, `WalletTransaction`, `Order`, `PriceSnapshot`, `DeliveryRequest`, `RiskProfile`, `AuditLog`.
- نقش‌ها: `USER`, `ADMIN`, `KYC_OFFICER`.
- کیف‌ها: `FIAT` (IRR) و `GOLD` (گرم).

## جریان خرید طلا
1. دریافت قیمت لحظه‌ای از `price-service`.
2. ثبت سفارش (`createBuyOrder`) → کسر ریالی از کیف پول و افزودن طلا.
3. ثبت `WalletTransaction` و `AuditLog`.

## جریان فروش طلا
1. انتخاب مقدار طلا و قیمت خرید.
2. `createSellOrder` طلای کیف را کسر و معادل ریالی را واریز می‌کند.
3. سفارش، تراکنش و لاگ مطابق خرید ثبت می‌شود.

## جریان KYC
1. کاربر مدارک مرحله‌ای را در `/kyc` بارگذاری می‌کند (Document with status).
2. KYC Officer در `/admin/kyc` مدارک را مشاهده و تایید/رد می‌کند.
3. تصمیمات در `AuditLog` ثبت و وضعیت در داشبورد نمایش داده می‌شود.

## تحویل فیزیکی
1. کاربر در `/delivery-requests` درخواست خود را ثبت می‌کند؛ طلا به صورت موقت بلوکه می‌شود.
2. ادمین در `/admin/delivery-requests` وضعیت را تغییر می‌دهد؛ در صورت `REJECTED` طلا برگشت داده می‌شود.

## امنیت و مجوزها
- **Middleware + Auth Guards**: مسیرهای کاربری فقط برای USER، مسیرهای ادمین فقط ADMIN/KYC.
- **AuditLog** برای تمام عملیات حساس (سفارش، KYC، تنظیم کیف پول، تحویل).
- **Upload sanitization**: مدارک در `/public/uploads` ذخیره و هر بار بازنویسی می‌شوند.

## حالت دمو
- اجرای `npm run seed:demo` کاربران نمونه، سفارش‌ها، KYC و قیمت‌ها را ایجاد می‌کند.
- حساب مدیر: `admin@ario-gold.ir`، حساب کاربر: `user@ario-gold.ir` (رمز `DemoPass123!`).

## نکات استقرار
- `DATABASE_URL` با Pooling (`?pgbouncer=true&pgbouncer_transaction_mode=true`).
- `NEXTAUTH_URL` و `NEXTAUTH_SECRET` در محیط Production تنظیم شود.
- اجرای `npm run build` برای آماده‌سازی خروجی Vercel.
