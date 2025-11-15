import Link from "next/link"
import { Mail } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <p className="text-lg font-semibold">Ario-Gold</p>
          <p className="mt-2 text-sm text-slate-600">
            Portfolio case study of an e-commerce MVP for physical gold shopping.
          </p>
        </div>
        <div className="space-y-3 text-sm text-slate-700">
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-blue-600" />
            support@ario-gold.example
          </div>
          <div className="text-xs text-slate-500">This is a demo/MVP. No real payments.</div>
        </div>
        <div className="text-sm text-slate-600">
          <p>Quick links</p>
          <div className="mt-3 flex flex-col gap-2">
            <Link href="#overview" className="text-blue-600">Overview</Link>
            <Link href="#features" className="text-blue-600">Features</Link>
            <Link href="#tech-stack" className="text-blue-600">Tech Stack</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-neutral-100 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Ario-Gold — Case Study
      </div>
    </footer>
  )
}
