"use client"

// تست حروف فارسی - این فایل باید با UTF-8 ذخیره شود
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn, getSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const loginSchema = z.object({
  email: z.string().email("ایمیل معتبر نیست"),
  password: z.string().min(8, "رمز عبور حداقل ۸ کاراکتر"),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  const onSubmit = async (values: LoginFormData) => {
    setError(null)
    setIsSubmitting(true)

    const result = await signIn("credentials", {
      ...values,
      redirect: false,
    })

    if (result?.error) {
      setError("ورود ناموفق بود، لطفاً دوباره تلاش کنید.")
      setIsSubmitting(false)
      return
    }

    const session = await getSession()
    const role = session?.user.role

    router.push(role === "ADMIN" || role === "KYC_OFFICER" ? "/admin" : "/dashboard")
    router.refresh()
  }

  return (
    <div className="font-vazirmatn flex min-h-screen items-center justify-center bg-neutral-100 px-4 py-12" dir="rtl">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold">ورود به حساب کاربری</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">ایمیل یا نام کاربری</Label>
              <Input id="email" placeholder="مثال: user@example.com" type="text" disabled={isSubmitting} {...form.register("email")} />
              {form.formState.errors.email && (
                <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">رمز عبور</Label>
              <Input id="password" placeholder="رمز عبور" type="password" disabled={isSubmitting} {...form.register("password")} />
              {form.formState.errors.password && (
                <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
              )}
            </div>
            {error && <p className="text-center text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "در حال ورود..." : "ورود"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center text-sm">
          <span className="text-muted-foreground">هنوز حساب کاربری ندارید؟</span>
          <Link href="/register" className="ml-1 text-primary">
            ثبت‌نام کنید
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
