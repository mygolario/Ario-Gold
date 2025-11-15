"use client"

import Link from "next/link"

const navItems = [
  { label: "Overview", href: "#overview" },
  { label: "Features", href: "#features" },
  { label: "Tech Stack", href: "#tech-stack" },
  { label: "Screenshots", href: "#screenshots" },
  { label: "Learnings", href: "#learnings" },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white">
            A
          </span>
          Ario-Gold
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 lg:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition-colors hover:text-blue-600">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="text-xs text-slate-500 hidden lg:block">
          MVP demo → <Link href="/dashboard" className="text-blue-700 underline">Dashboard</Link>
        </div>
      </div>
    </header>
  )
}
