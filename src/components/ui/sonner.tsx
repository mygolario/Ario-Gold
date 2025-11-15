"use client"

import { Toaster as Sonner } from "sonner"

import { cn } from "@/lib/utils"

type ToasterProps = React.ComponentProps<typeof Sonner>

export function Toaster({ className, ...props }: ToasterProps) {
  return (
    <Sonner
      className={cn("rtl", className)}
      toastOptions={{
        style: { direction: "rtl" },
        classNames: {
          toast: "bg-white text-slate-900 border border-neutral-200 shadow-lg",
          success: "bg-emerald-600 text-white",
          error: "bg-rose-600 text-white",
        },
      }}
      richColors
      {...props}
    />
  )
}
