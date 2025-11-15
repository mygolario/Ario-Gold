export const dynamic = "force-dynamic";

import Link from "next/link"
import { ArrowLeft, Mail, MapPin, PhoneCall, Shield, ShieldCheck, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LivePriceCard } from "@/components/pricing/live-price-card"
import { getLatestPrices } from "@/lib/price-service"

const advantageItems = [
  {
    title: "پوشش کامل با طلا فیزیکی",
    description: "هر گرم طلای دیجیتال شما در خزانه‌های بیمه‌شده سپرده‌گذاری می‌شود.",
  },
  {
    title: "احراز هویت چندسطحی",
    description: "KYC هوشمند برای جلوگیری از تقلب و رعایت قوانین مبارزه با پولشویی.",
  },
  {
    title: "تسویه فوری",
    description: "ثبت سفارش و تسویه کیف پولی در کمتر از چند دقیقه.",
  },
]

const steps = [
  { step: "۱", title: "ثبت‌نام سریع", text: "ورود اطلاعات اولیه و تایید موبایل/ایمیل." },
  { step: "۲", title: "احراز هویت", text: "بارگذاری مدارک و تایید توسط افسران KYC." },
  { step: "۳", title: "خرید طلا", text: "انتخاب محصول و پرداخت با کیف پول ریالی." },
  { step: "۴", title: "تحویل یا نگهداری", text: "درخواست تحویل فیزیکی یا نگهداری امن در خزانه." },
]

const productTypes = [
  {
    title: "طلای گرمی ۱۸ عیار",
    description: "خرید با حداقل مبلغ و نقدشوندگی بالا برای افراد حقیقی.",
  },
  {
    title: "طلای ۲۴ عیار",
    description: "پوشش سرمایه‌گذاران حرفه‌ای با امکان تسویه بین‌المللی.",
  },
  {
    title: "سکه امامی",
    description: "خرید و فروش آنی همراه با امکان تحویل حضوری یا پستی.",
  },
  {
    title: "طلای آب‌شده",
    description: "دسترسی مستقیم به بازار آب‌شده با کارمزد شفاف.",
  },
]

const securityHighlights = [
  "ذخیره فیزیکی در خزانه‌های بیمه‌شده و تحت نظارت اتحادیه",
  "رمزنگاری داده‌ها، OTP و لیست دستگاه‌های مجاز",
  "افسران ریسک برای پایش تراکنش‌های مشکوک",
  "گزارش‌گیری کامل برای حسابرس و واحد تطبیق",
]

const contactItems = [
  { title: "پشتیبانی ۲۴/۷", value: "۰۲۱-۴۲۱۷۱۷", icon: <PhoneCall className="h-5 w-5" /> },
  { title: "پست الکترونیک", value: "support@ario-gold.ir", icon: <Mail className="h-5 w-5" /> },
  { title: "دفتر مرکزی", value: "تهران، برج مالی آریو", icon: <MapPin className="h-5 w-5" /> },
]

export default async function LandingPage() {
  const prices = await getLatestPrices()

  return (
    <div className="space-y-20 pb-16">
      <section id="hero" className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-[1.1fr,0.9fr]">
          <div className="space-y-6">
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 hover:text-blue-700">خرید امن طلا با پشتوانه فیزیکی</Badge>
            <div className="space-y-4">
              <h1 className="text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">پلتفرم بانکی خرید و فروش طلا با احراز هویت دیجیتال و کیف پول طلایی</h1>
              <p className="text-lg text-slate-600">
                آریو طلا تجربه‌ای شفاف برای معامله طلا بر اساس قیمت‌های لحظه‌ای بازار تهران فراهم می‌کند؛ با KYC چندسطحی و امکان تحویل فیزیکی در هر زمان.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-blue-600" />
                مجوز رسمی اتحادیه طلا و جواهر
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-blue-600" />
                کیف پول طلایی با تسویه لحظه‌ای
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/register">شروع احراز هویت</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="#how-it-works" className="flex items-center gap-2">
                  نحوه کار سیستم
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
          <div id="prices">
            <LivePriceCard initialPrices={prices} />
          </div>
        </div>
      </section>

      <section id="advantages" className="mx-auto max-w-6xl px-4">
        <div className="mb-10 space-y-3 text-center">
          <p className="text-sm font-semibold text-blue-600">چرا آریو طلا؟</p>
          <h2 className="text-3xl font-bold text-slate-900">مزیت رقابتی</h2>
          <p className="text-slate-600">زیرساخت بانکی، بیمه بار و پایش ریسک مداوم</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {advantageItems.map((item) => (
            <Card key={item.title} className="border-blue-100 bg-white">
              <CardHeader>
                <CardTitle className="text-xl text-slate-900">{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-600">{item.description}</CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-12 space-y-2 text-center">
            <p className="text-sm font-semibold text-blue-600">نحوه خرید طلا</p>
            <h2 className="text-3xl font-bold text-slate-900">چهار مرحله ساده</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-4">
            {steps.map((step) => (
              <div key={step.step} className="rounded-3xl border border-neutral-200 bg-neutral-50 p-6">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-lg font-semibold text-white">
                  {step.step}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-slate-900">{step.title}</h3>
                <p className="text-sm text-slate-600">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="products" className="mx-auto max-w-6xl px-4">
        <div className="mb-10 space-y-2 text-center">
          <p className="text-sm font-semibold text-blue-600">سبد محصولات</p>
          <h2 className="text-3xl font-bold text-slate-900">انواع طلایی که ارائه می‌کنیم</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {productTypes.map((product) => (
            <Card key={product.title} className="border-neutral-200 bg-white">
              <CardHeader>
                <CardTitle className="text-lg text-slate-900">{product.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-600">{product.description}</CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="security" className="bg-neutral-100 py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 md:grid-cols-2">
          <div className="space-y-4">
            <p className="text-sm font-semibold text-blue-600">امنیت و KYC</p>
            <h2 className="text-3xl font-bold text-slate-900">فرایند احراز هویت چندسطحی</h2>
            <p className="text-slate-600">
              تمامی کاربران پیش از معامله، تحت فرایند احراز هویت چندسطحی قرار می‌گیرند. داده‌ها رمزنگاری شده و توسط افسران تطبیق به صورت لحظه‌ای کنترل می‌شود.
            </p>
            <div className="space-y-3">
              {securityHighlights.map((item) => (
                <div key={item} className="flex items-start gap-3 text-sm text-slate-700">
                  <Shield className="mt-0.5 h-4 w-4 text-blue-600" />
                  {item}
                </div>
              ))}
            </div>
          </div>
          <Card className="self-center border-blue-100 bg-white">
            <CardHeader>
              <CardTitle>سطوح KYC</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-slate-600">
              <div>
                <p className="font-semibold text-slate-900">سطح ۱ - اطلاعات پایه</p>
                <p>ثبت مشخصات هویتی، تلفن و شماره شبای بانکی.</p>
              </div>
              <div>
                <p className="font-semibold text-slate-900">سطح ۲ - مدارک تصویری</p>
                <p>بارگذاری کارت ملی، سلفی زنده و قبض محل سکونت.</p>
              </div>
              <div>
                <p className="font-semibold text-slate-900">سطح ۳ - کاربران VIP</p>
                <p>مصاحبه ویدئویی و محدودیت‌های ویژه برای تراکنش‌های بزرگ.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-6xl px-4">
        <div className="mb-8 space-y-2 text-center">
          <p className="text-sm font-semibold text-blue-600">ارتباط با ما</p>
          <h2 className="text-3xl font-bold text-slate-900">همراه شما در تمام مسیر</h2>
          <p className="text-slate-600">برای دریافت مشاوره یا دمو سازمانی با ما تماس بگیرید.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {contactItems.map((item) => (
            <Card key={item.title} className="border-neutral-200">
              <CardContent className="flex flex-col gap-3 pt-6 text-slate-700">
                <div className="text-blue-600">{item.icon}</div>
                <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                <p className="text-sm">{item.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
