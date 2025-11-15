import Link from "next/link"
import { ArrowRight, Box, CheckCircle2, Database, FileDown, Layout, ShoppingCart, Shield, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function CaseStudyPage() {
  return (
    <div className="space-y-20 pb-16">
      {/* Hero */}
      <section id="hero" className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20">
          <div className="mx-auto max-w-3xl text-center space-y-6">
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 hover:text-blue-700">Portfolio Case Study</Badge>
            <h1 className="text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
              Ario-Gold — E-commerce MVP for Online Gold Shopping
            </h1>
            <p className="text-lg text-slate-600">
              A university project MVP exploring a clean, trustworthy experience for buying physical gold online. This site presents the case study. The checkout and payment flows are mock-only and not connected to real payment systems.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button asChild>
                <Link href="#features" className="flex items-center gap-2">
                  View Features
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="#" onClick={(e) => e.preventDefault()} className="flex items-center gap-2">
                  Download Case Study (PDF)
                  <FileDown className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="pt-2 text-xs text-slate-500">
              MVP demo pages are available for exploration only: {" "}
              <Link href="/dashboard" className="text-blue-700 underline">Dashboard</Link> {" • "}
              <Link href="/admin" className="text-blue-700 underline">Admin</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section id="overview" className="mx-auto max-w-6xl px-4">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900">Project Overview</h2>
          <p className="mt-2 text-slate-600">High-level context for the Ario-Gold MVP.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle>Role</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-600">Product Designer & Full-Stack Developer</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-600">2025 – University Project</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Stack</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-600">Next.js, TypeScript, Prisma, PostgreSQL, Tailwind CSS</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Focus</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-600">MVP for Iranian online gold market</CardContent>
          </Card>
        </div>
      </section>

      {/* Problem & Goals */}
      <section id="problem-goals" className="bg-white py-16">
        <div className="mx-auto max-w-4xl space-y-6 px-4">
          <h2 className="text-3xl font-bold text-slate-900">Problem & Goals</h2>
          <p className="text-slate-700">
            In Iran, most gold purchases still happen offline. My professor wanted to see if we could design a clean, trustworthy, modern experience for buying physical gold online.
          </p>
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Goals</p>
            <ul className="grid gap-2 text-slate-700 md:grid-cols-2">
              <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-blue-600" /> Clear product presentation (weights, purity, prices)</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-blue-600" /> Simple checkout flow</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-blue-600" /> Admin-friendly product management</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-blue-600" /> A polished MVP to demonstrate technical and design skills</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-4">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900">Solution & Features</h2>
          <p className="mt-2 text-slate-600">A showcase of the MVP capabilities (mocked payments).</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <Box className="h-5 w-5 text-blue-600" />
              <CardTitle>Product Catalog</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-600">Catalog for gold items with clear specs (weight, purity, pricing).</CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <ShoppingCart className="h-5 w-5 text-blue-600" />
              <CardTitle>Cart & Orders</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-600">Simple cart and order flow (MVP-only, no real payment processing).</CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <Shield className="h-5 w-5 text-blue-600" />
              <CardTitle>Basic Admin</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-600">Admin panel for managing products and reviewing orders.</CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <Sparkles className="h-5 w-5 text-blue-600" />
              <CardTitle>Scalable Stack</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-600">Architecture ready to integrate real payments in the future.</CardContent>
          </Card>
        </div>
      </section>

      {/* Tech Stack & Architecture */}
      <section id="tech-stack" className="bg-neutral-100 py-16">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 md:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-slate-900">Tech Stack & Architecture</h2>
            <ul className="space-y-2 text-slate-700">
              <li><span className="font-semibold">Frontend:</span> Next.js, TypeScript, Tailwind CSS</li>
              <li><span className="font-semibold">Backend:</span> Next.js API Routes, Prisma ORM</li>
              <li><span className="font-semibold">Database:</span> PostgreSQL</li>
              <li><span className="font-semibold">Deployment:</span> Development on localhost, ready for Vercel</li>
            </ul>
          </div>
          <Card className="self-center">
            <CardHeader className="flex flex-row items-center gap-3">
              <Layout className="h-5 w-5 text-blue-600" />
              <CardTitle>Flow Overview</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-600 space-y-3">
              <div className="flex items-center gap-2"><Layout className="h-4 w-4 text-blue-600" /> UI (Next.js pages/components)</div>
              <div className="flex items-center gap-2"><Shield className="h-4 w-4 text-blue-600" /> API (Route handlers, auth, validation)</div>
              <div className="flex items-center gap-2"><Database className="h-4 w-4 text-blue-600" /> Data (Prisma models → PostgreSQL)</div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Screenshots */}
      <section id="screenshots" className="mx-auto max-w-6xl px-4">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900">Screenshots</h2>
          <p className="mt-2 text-slate-600">Placeholder cards — replace with real images later.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            "Home Screen Placeholder",
            "Product Detail Placeholder",
            "Checkout Placeholder",
            "Admin Panel Placeholder",
          ].map((title) => (
            <Card key={title} className="border-dashed">
              <CardHeader>
                <CardTitle>{title}</CardTitle>
              </CardHeader>
              <CardContent className="h-40 rounded-md bg-neutral-100" />
            </Card>
          ))}
        </div>
      </section>

      {/* Learnings */}
      <section id="learnings" className="bg-white py-16">
        <div className="mx-auto max-w-4xl space-y-6 px-4">
          <h2 className="text-3xl font-bold text-slate-900">Learnings & Next Steps</h2>
          <ul className="space-y-2 text-slate-700">
            <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-blue-600" /> Learned how to design an MVP around real constraints (compliance, local market, payment gateways).</li>
            <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-blue-600" /> Practiced connecting a relational database to a modern React framework using Prisma.</li>
            <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-blue-600" /> Improved at explaining technical decisions to a non-technical stakeholder (professor).</li>
          </ul>
          <div className="pt-2">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Next steps</p>
            <ul className="mt-2 space-y-2 text-slate-700">
              <li className="flex items-start gap-2"><ArrowRight className="mt-0.5 h-4 w-4 text-blue-600" /> Integrate a real payment gateway</li>
              <li className="flex items-start gap-2"><ArrowRight className="mt-0.5 h-4 w-4 text-blue-600" /> Add better admin analytics beyond MVP</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
