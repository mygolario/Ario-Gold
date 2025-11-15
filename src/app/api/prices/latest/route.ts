import { NextResponse } from "next/server"

import { getLatestPrices } from "@/lib/price-service"

export async function GET() {
  const prices = await getLatestPrices()
  if (!prices) {
    return NextResponse.json({ error: "Price data unavailable" }, { status: 503 })
  }

  return NextResponse.json(prices, {
    headers: {
      "Cache-Control": "no-store",
    },
  })
}
