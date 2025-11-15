"use client"

// تست حروف فارسی - این فایل باید با UTF-8 ذخیره شود
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const registerSchema = z.object({
  fullName: z.string().min(3, "حداقل ۳ کاراکتر"),
  contact: z.string().min(5, "شماره تماس یا ایمیل معتبر نیست"),
  username: z.string().min(3, "نام کاربری حداقل ۳ کاراکتر"),
  password: z.string().min(8, "رمز عبور حداقل ۸ کاراکتر"),
  passwordConfirm: z.string().min(8, "تکرار رمز عبور حداقل ۸ کاراکتر"),
}).refine((d) => d.password === d.passwordConfirm, {
  path: ["passwordConfirm"],
  message: "رمز عبور و تکرار آن یکسان نیست",
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: "", contact: "", username: "", password: "", passwordConfirm: "" },
  })

  const onSubmit = async (values: RegisterFormData) => {
    setIsSubmitting(true)
    setError(null)

    // سازگاری با API موجود: فیلدهای اصلی را نگه می‌داریم
    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: values.fullName,
        phone: values.contact, // ذخیره به عنوان phone
        email: values.contact.includes("@") ? values.contact : undefined,
        password: values.password,
      }),
    })

    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      setError(data.error ?? "ثبت‌نام ناموفق بود")
      setIsSubmitting(false)
      return
    }

    await signIn("credentials", {
      email: values.contact,
      password: values.password,
      redirect: false,
    })

    router.push("/kyc")
    router.refresh()
  }

  return (
    <div className="font-vazirmatn flex min-h-screen items-center justify-center bg-neutral-100 px-4 py-12" dir="rtl">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold">ایجاد حساب کاربری</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">نام و نام خانوادگی</Label>
              <Input id="fullName" placeholder="مثال: علی رضایی" disabled={isSubmitting} {...form.register("fullName")} />
              {form.formState.errors.fullName && (
                <p className="text-sm text-destructive">{form.formState.errors.fullName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact">شماره تماس یا ایمیل</Label>
              <Input id="contact" placeholder="0912xxxxxxxx یا user@example.com" disabled={isSubmitting} {...form.register("contact")} />
              {form.formState.errors.contact && (
                <p className="text-sm text-destructive">{form.formState.errors.contact.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">نام کاربری</Label>
              <Input id="username" placeholder="نام کاربری" disabled={isSubmitting} {...form.register("username")} />
              {form.formState.errors.username && (
                <p className="text-sm text-destructive">{form.formState.errors.username.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">رمز عبور</Label>
              <Input id="password" placeholder="رمز عبور" type="password" disabled={isSubmitting} {...form.register("password")} />
              {form.formState.errors.password && (
                <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="passwordConfirm">تکرار رمز عبور</Label>
              <Input id="passwordConfirm" placeholder="تکرار رمز عبور" type="password" disabled={isSubmitting} {...form.register("passwordConfirm")} />
              {form.formState.errors.passwordConfirm && (
                <p className="text-sm text-destructive">{form.formState.errors.passwordConfirm.message}</p>
              )}
            </div>
            {error && <p className="text-center text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "در حال ثبت‌نام..." : "ثبت‌نام"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center text-sm">
          <span className="text-muted-foreground">قبلاً ثبت‌نام کرده‌اید؟</span>
          <Link href="/login" className="ml-1 text-primary">
            وارد شوید
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
