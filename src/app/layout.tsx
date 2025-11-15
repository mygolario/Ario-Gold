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
  title: "Ario-Gold — E-commerce MVP Case Study",
  description:
    "Portfolio case study of a university MVP for a trustworthy online gold shopping experience. Mock checkout; no real payments.",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()

  return (
    <html lang="en" dir="ltr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-neutral-50 text-slate-900 antialiased`}
      >
        <AppProviders session={session}>{children}</AppProviders>
      </body>
    </html>
  )
}
