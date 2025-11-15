const irrFormatter = new Intl.NumberFormat("fa-IR", {
  maximumFractionDigits: 0,
})

const gramFormatter = new Intl.NumberFormat("fa-IR", {
  maximumFractionDigits: 3,
})

export const formatIrr = (amount: number | string) => {
  const value = typeof amount === "string" ? Number(amount) : amount
  if (!Number.isFinite(value)) return "-"
  return `${irrFormatter.format(Math.round(value))} تومان`
}

export const formatGram = (grams: number | string) => {
  const value = typeof grams === "string" ? Number(grams) : grams
  if (!Number.isFinite(value)) return "-"
  return `${gramFormatter.format(value)} گرم`
}

export const formatDateTime = (date: Date) =>
  new Intl.DateTimeFormat("fa-IR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date)
