import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const milestones = [
  { title: "سال ۱۳۹۹", description: "شروع توسعه پلتفرم خرید طلا برای بانک‌های خصوصی" },
  { title: "سال ۱۴۰۱", description: "اخذ مجوز رسمی اتحادیه طلا و استقرار خزانه اختصاصی" },
  { title: "سال ۱۴۰۳", description: "ارائه کیف پول دیجیتال طلا و اتصال به بازار ثانویه" },
]

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4 py-16" dir="rtl">
      <div className="space-y-4 text-center">
        <h1 className="text-3xl font-bold text-slate-900">درباره آریو طلا</h1>
        <p className="text-slate-600">
          آریو طلا زیرساختی بانکی برای خرید، فروش و نگهداری طلای فیزیکی است. ما با تکیه بر تیمی از متخصصان مالی و
          فناوری، تجربه‌ای شفاف و مطمئن برای سرمایه‌گذاران حقیقی و حقوقی فراهم می‌کنیم.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>ماموریت ما</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-slate-600">
          <p>• ایجاد دسترسی عادلانه به طلای فیزیکی با هزینه نگهداری نزدیک به صفر</p>
          <p>• تسهیل فرآیند احراز هویت و نظارت بر تراکنش‌ها طبق استانداردهای ضدپولشویی</p>
          <p>• فراهم کردن ابزارهای مدیریت ریسک برای صرافی‌ها و فین‌تک‌های همکار</p>
        </CardContent>
      </Card>
      <div className="grid gap-4 md:grid-cols-3">
        {milestones.map((item) => (
          <Card key={item.title}>
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-600">{item.description}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
