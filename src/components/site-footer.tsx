import Link from "next/link"
import { Mail, MapPin, PhoneCall } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <p className="text-lg font-semibold">آریو طلا</p>
          <p className="mt-2 text-sm text-slate-600">
            پلتفرم امن خرید و فروش طلا با پشتوانه خزانه بیمه‌شده و احراز هویت چندسطحی.
          </p>
        </div>
        <div className="space-y-3 text-sm text-slate-700">
          <div className="flex items-center gap-3">
            <PhoneCall className="h-4 w-4 text-blue-600" />
            ۰۲۱-۴۲۱۷۱۷
          </div>
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-blue-600" />
            support@ario-gold.ir
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="h-4 w-4 text-blue-600" />
            تهران، خیابان ولیعصر، برج مالی آریو
          </div>
        </div>
        <div className="text-sm text-slate-600">
          <p>دسترسی سریع</p>
          <div className="mt-3 flex flex-col gap-2">
            <Link href="/about" className="text-blue-600">
              درباره ما
            </Link>
            <Link href="/faq" className="text-blue-600">
              سوالات متداول
            </Link>
            <Link href="/contact" className="text-blue-600">
              تماس با ما
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-neutral-100 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} آریو طلا - تمامی حقوق محفوظ است
      </div>
    </footer>
  )
}
