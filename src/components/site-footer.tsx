import Link from "next/link"
import { Mail, Phone } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="border-t border-neutral-200 bg-white" dir="rtl">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <p className="text-lg font-semibold">آریو طلا</p>
          <p className="mt-2 text-sm text-slate-600">
            پلتفرم امن خرید و فروش طلای فیزیکی با قیمت‌های لحظه‌ای و کیف پول دیجیتال طلا
          </p>
        </div>
        <div className="space-y-3 text-sm text-slate-700">
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-amber-600" />
            support@ario-gold.ir
          </div>
          <div className="flex items-center gap-3">
            <Phone className="h-4 w-4 text-amber-600" />
            ۰۲۱-۴۲۱۷۱۷
          </div>
          <div className="text-xs text-slate-500">پشتیبانی ۲۴ ساعته</div>
        </div>
        <div className="text-sm text-slate-600">
          <p className="font-semibold text-slate-900">لینک‌های سریع</p>
          <div className="mt-3 flex flex-col gap-2">
            <Link href="/" className="text-amber-600 hover:underline">خانه</Link>
            <Link href="/about" className="text-amber-600 hover:underline">درباره ما</Link>
            <Link href="/contact" className="text-amber-600 hover:underline">تماس با ما</Link>
            <Link href="/faq" className="text-amber-600 hover:underline">سوالات متداول</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-neutral-100 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} آریو طلا — تمام حقوق محفوظ است
      </div>
    </footer>
  )
}
