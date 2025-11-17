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
  title: "آریو طلا — پلتفرم خرید و فروش طلای فیزیکی",
  description:
    "خرید و فروش طلای فیزیکی با قیمت‌های لحظه‌ای، کیف پول دیجیتال طلا و امکان تحویل فیزیکی. تجربه‌ای شفاف و مطمئن برای سرمایه‌گذاری در طلا.",
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
