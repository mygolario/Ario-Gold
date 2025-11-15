"use client"

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
  fullName: z.string().min(3, "??? ???? ?? ???? ????"),
  phone: z.string().min(10, "????? ????? ????"),
  email: z.string().email("????? ????? ????"),
  password: z.string().min(8, "????? ? ???????"),
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: "", phone: "", email: "", password: "" },
  })

  const onSubmit = async (values: RegisterFormData) => {
    setIsSubmitting(true)
    setError(null)

    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    })

    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      setError(data.error ?? "??????? ?????? ???")
      setIsSubmitting(false)
      return
    }

    await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    })

    router.push("/kyc")
    router.refresh()
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-100 px-4 py-12" dir="rtl">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold">??????? ????? ????</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">??? ? ??? ????????</Label>
              <Input id="fullName" disabled={isSubmitting} {...form.register("fullName")} />
              {form.formState.errors.fullName && (
                <p className="text-sm text-destructive">{form.formState.errors.fullName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">????? ??????</Label>
              <Input id="phone" disabled={isSubmitting} {...form.register("phone")} />
              {form.formState.errors.phone && (
                <p className="text-sm text-destructive">{form.formState.errors.phone.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">?????</Label>
              <Input id="email" type="email" disabled={isSubmitting} {...form.register("email")} />
              {form.formState.errors.email && (
                <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">???? ????</Label>
              <Input id="password" type="password" disabled={isSubmitting} {...form.register("password")} />
              {form.formState.errors.password && (
                <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
              )}
            </div>
            {error && <p className="text-center text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "?? ??? ????? ????..." : "???????"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center text-sm">
          <span className="text-muted-foreground">???? ??????? ????????? </span>
          <Link href="/login" className="ml-1 text-primary">
            ???? ????
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
