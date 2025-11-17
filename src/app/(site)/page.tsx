import Link from "next/link"
import { ArrowLeft, CheckCircle2, Shield, Sparkles, TrendingUp, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function HomePage() {
  return (
    <div className="space-y-20 pb-16" dir="rtl">
      {/* Hero */}
      <section id="hero" className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-white to-amber-100">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20">
          <div className="mx-auto max-w-3xl text-center space-y-6">
            <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 hover:text-amber-700">
              خرید و فروش طلای فیزیکی
            </Badge>
            <h1 className="text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
              آریو طلا — پلتفرم امن خرید و فروش طلا
            </h1>
            <p className="text-lg text-slate-600">
              خرید و فروش طلای فیزیکی با قیمت‌های لحظه‌ای، کیف پول دیجیتال طلا و امکان تحویل فیزیکی. تجربه‌ای شفاف و
              مطمئن برای سرمایه‌گذاری در طلا.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button asChild>
                <Link href="/login" className="flex items-center gap-2">
                  شروع خرید و فروش
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/about" className="flex items-center gap-2">
                  درباره ما
                </Link>
              </Button>
            </div>
            <div className="pt-2 text-xs text-slate-500">
              برای مشاهده قیمت‌های لحظه‌ای و شروع معامله،{" "}
              <Link href="/login" className="text-amber-700 underline">
                وارد حساب کاربری شوید
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-4">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900">ویژگی‌های پلتفرم</h2>
          <p className="mt-2 text-slate-600">امکاناتی که تجربه خرید و فروش طلا را برای شما آسان می‌کند</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <TrendingUp className="h-5 w-5 text-amber-600" />
              <CardTitle>قیمت‌های لحظه‌ای</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-600">
              قیمت‌های به‌روز طلا (۱۸ عیار، ۲۴ عیار، سکه امامی) با به‌روزرسانی خودکار هر ۳۰ ثانیه
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <Shield className="h-5 w-5 text-amber-600" />
              <CardTitle>کیف پول دیجیتال</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-600">
              نگهداری طلا و ریال در کیف پول دیجیتال امن با امکان مشاهده موجودی و تاریخچه تراکنش‌ها
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <Sparkles className="h-5 w-5 text-amber-600" />
              <CardTitle>تحویل فیزیکی</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-600">
              امکان درخواست تحویل فیزیکی طلا (سکه، شمش، آب‌شده) با پشتیبانی از ارسال به سراسر کشور
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <Users className="h-5 w-5 text-amber-600" />
              <CardTitle>احراز هویت سریع</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-600">
              فرآیند KYC ساده و سریع با سطوح مختلف برای کاربران عادی و ویژه
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="bg-white py-16">
        <div className="mx-auto max-w-4xl space-y-6 px-4">
          <h2 className="text-3xl font-bold text-slate-900 text-center">چرا آریو طلا؟</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-amber-600 flex-shrink-0" />
              <div>
                <p className="font-semibold text-slate-900">شفافیت کامل قیمت‌ها</p>
                <p className="text-sm text-slate-600">
                  قیمت‌های لحظه‌ای و محاسبه شفاف کارمزد قبل از ثبت سفارش. هیچ هزینه پنهانی وجود ندارد.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-amber-600 flex-shrink-0" />
              <div>
                <p className="font-semibold text-slate-900">امنیت بالا</p>
                <p className="text-sm text-slate-600">
                  طلای شما در خزانه بیمه‌شده نگهداری می‌شود. تمام تراکنش‌ها ثبت و قابل ردیابی هستند.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-amber-600 flex-shrink-0" />
              <div>
                <p className="font-semibold text-slate-900">کارمزد پایین</p>
                <p className="text-sm text-slate-600">
                  کارمزد ثابت ۰.۲٪ بر مبلغ تراکنش که در مقایسه با روش‌های سنتی بسیار مقرون به صرفه است.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-amber-600 flex-shrink-0" />
              <div>
                <p className="font-semibold text-slate-900">دسترسی ۲۴ ساعته</p>
                <p className="text-sm text-slate-600">
                  خرید و فروش طلا در هر ساعت از شبانه‌روز. قیمت‌ها به‌صورت خودکار به‌روز می‌شوند.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="mx-auto max-w-6xl px-4">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900">چگونه کار می‌کند؟</h2>
          <p className="mt-2 text-slate-600">فرآیند ساده خرید و فروش طلا در سه مرحله</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-700 font-bold">
                  ۱
                </div>
                <CardTitle>ثبت‌نام و احراز هویت</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-slate-600">
              ثبت‌نام با شماره موبایل و تکمیل فرآیند KYC برای دسترسی به تمام امکانات پلتفرم
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-700 font-bold">
                  ۲
                </div>
                <CardTitle>واریز و خرید طلا</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-slate-600">
              واریز ریال به کیف پول و خرید طلا با قیمت لحظه‌ای. طلای خریداری شده در کیف پول دیجیتال شما ذخیره می‌شود
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-700 font-bold">
                  ۳
                </div>
                <CardTitle>فروش یا تحویل</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-slate-600">
              فروش طلا و تبدیل به ریال یا درخواست تحویل فیزیکی طلا (سکه، شمش) به آدرس شما
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="bg-gradient-to-br from-amber-50 to-amber-100 py-16">
        <div className="mx-auto max-w-4xl text-center space-y-6 px-4">
          <h2 className="text-3xl font-bold text-slate-900">آماده شروع هستید؟</h2>
          <p className="text-lg text-slate-600">
            همین حالا ثبت‌نام کنید و از مزایای خرید و فروش طلا به‌صورت آنلاین بهره‌مند شوید
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" asChild>
              <Link href="/register">ثبت‌نام رایگان</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">تماس با پشتیبانی</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
