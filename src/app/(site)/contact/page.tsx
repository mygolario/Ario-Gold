import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-10 px-4 py-16" dir="rtl">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-slate-900">تماس با آریو طلا</h1>
        <p className="text-slate-600">برای دریافت اطلاعات تکمیلی، فرم زیر را تکمیل کنید یا با ما تماس بگیرید.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>دفتر مرکزی</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-600">
            <p>تهران، خیابان ولیعصر، برج مالی آریو، طبقه ۱۲</p>
            <p>تلفن: ۰۲۱-۴۲۱۷۱۷</p>
            <p>ایمیل: support@ario-gold.ir</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>ساعات پاسخگویی</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-600">
            <p>شنبه تا چهارشنبه: ۹ الی ۱۸</p>
            <p>پنجشنبه: ۹ الی ۱۴</p>
            <p>پشتیبانی اضطراری: ۲۴ ساعته</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>فرم ارتباط</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div>
              <Label htmlFor="name">نام و نام خانوادگی</Label>
              <Input id="name" placeholder="مثلا علی رضایی" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="email">ایمیل</Label>
                <Input id="email" type="email" placeholder="you@example.com" />
              </div>
              <div>
                <Label htmlFor="phone">شماره تماس</Label>
                <Input id="phone" placeholder="۰۹۱۲XXXXXXX" />
              </div>
            </div>
            <div>
              <Label htmlFor="message">پیام</Label>
              <Textarea id="message" rows={4} placeholder="متن درخواست" />
            </div>
            <Button type="button" className="w-full">ارسال (به زودی)</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
