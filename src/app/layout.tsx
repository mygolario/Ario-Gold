import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { AppProviders } from "@/components/providers/app-providers"
import { auth } from "@/lib/auth"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "آریو طلا | خرید آنلاین طلا با پشتوانه فیزیکی",
  description:
    "پلتفرم خرید و فروش آنلاین طلا با احراز هویت چندمرحله‌ای، کیف پول دیجیتال و تسویه مبتنی بر قیمت‌های لحظه‌ای بازار ایران.",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()

  return (
    <html lang="fa" dir="rtl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-neutral-50 text-slate-900 antialiased`}
      >
        <AppProviders session={session}>{children}</AppProviders>
      </body>
    </html>
  )
}
