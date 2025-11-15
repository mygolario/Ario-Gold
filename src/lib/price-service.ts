import { Prisma } from "@prisma/client"

import { prisma } from "@/lib/prisma"

/**
 * Normalizes and stores live price snapshots from the TGJU API so that the UI can
 * render consistent buy/sell numbers and gracefully fall back to the latest stored
 * value if the upstream provider is unavailable.
 */

export const PRICE_API_URL = "https://call.tgju.org/ajax.json"

export type NormalizedPrices = {
  gold18Sell: number
  gold18Buy: number
  gold24Sell: number
  rawGold: number
  emamiCoin: number
  lastUpdated: string
  source: string
}

type SnapshotMetadata = {
  vendor: string
  rawGold?: number
  emamiCoin?: number
  gold24Sell?: number
  lastUpdated?: string
}

const parseAmount = (value?: string | number | null) => {
  if (value === undefined || value === null) return null
  const numeric = typeof value === "string" ? value.replace(/,/g, "").trim() : value.toString()
  const result = Number(numeric)
  return Number.isFinite(result) ? result : null
}

const buildSnapshotMeta = (meta: SnapshotMetadata) => JSON.stringify(meta)

const parseSnapshotMeta = (source: string | null): SnapshotMetadata | null => {
  if (!source) return null
  try {
    const parsed = JSON.parse(source) as SnapshotMetadata
    return parsed
  } catch {
    return null
  }
}

/**
 * Fetches the latest gold/coin prices from the public TGJU endpoint and writes a snapshot
 * to the database. The stored snapshot lets us continue operating when the upstream service
 * throttles or goes offline.
 */
async function fetchFromRemote(): Promise<NormalizedPrices> {
  const response = await fetch(PRICE_API_URL, { cache: "no-store" })
  if (!response.ok) {
    throw new Error(`Price API failed with ${response.status}`)
  }

  const payload = await response.json()
  const current = payload?.current ?? {}

  const gold18Sell = parseAmount(current.tgju_gold_irg18?.p)
  const gold18Buy = parseAmount(current.tgju_gold_irg18_buy?.p) ?? gold18Sell
  const rawGold =
    parseAmount(current.gold_melted_wholesale?.p) ??
    parseAmount(current.gold_melted_transfer?.p) ??
    gold18Sell ??
    null
  const emamiCoin = parseAmount(current.sekee?.p) ?? parseAmount(current.sekee_real?.p)

  if (!gold18Sell || !gold18Buy) {
    throw new Error("Price API missing gold 18K values")
  }

  const gold24Sell = Math.round(gold18Sell * (24 / 18))
  const lastUpdated = current.tgju_gold_irg18?.ts ?? new Date().toISOString()

  const normalized: NormalizedPrices = {
    gold18Sell,
    gold18Buy,
    gold24Sell,
    rawGold: rawGold ?? gold18Sell,
    emamiCoin: emamiCoin ?? gold18Sell * 110,
    lastUpdated,
    source: "tgju_live",
  }

  // Persist the essential snapshot plus extended metadata for offline fallback.
  await prisma.priceSnapshot.create({
    data: {
      gold18Sell: new Prisma.Decimal(normalized.gold18Sell),
      gold18Buy: new Prisma.Decimal(normalized.gold18Buy),
      source: buildSnapshotMeta({
        vendor: "tgju_live",
        rawGold: normalized.rawGold,
        emamiCoin: normalized.emamiCoin,
        gold24Sell: normalized.gold24Sell,
        lastUpdated,
      }),
    },
  })

  return normalized
}

/**
 * Returns the freshest available prices from the upstream API or falls back to the most
 * recent database snapshot.
 */
export async function getLatestPrices(): Promise<NormalizedPrices | null> {
  try {
    return await fetchFromRemote()
  } catch (error) {
    const toMessage = (err: unknown) => {
      if (err instanceof Error) return err.message
      try {
        return JSON.stringify(err)
      } catch {
        return String(err)
      }
    }
    console.warn("price-service.remote-error", toMessage(error))
    const fallback = await prisma.priceSnapshot.findFirst({
      orderBy: { createdAt: "desc" },
    })
    if (!fallback) {
      return null
    }

    const meta = parseSnapshotMeta(fallback.source)
    const gold18Sell = Number(fallback.gold18Sell)
    const gold18Buy = Number(fallback.gold18Buy)
    return {
      gold18Sell,
      gold18Buy,
      gold24Sell: meta?.gold24Sell ?? Math.round(gold18Sell * (24 / 18)),
      rawGold: meta?.rawGold ?? gold18Sell,
      emamiCoin: meta?.emamiCoin ?? gold18Sell * 110,
      lastUpdated: meta?.lastUpdated ?? fallback.createdAt.toISOString(),
      source: meta?.vendor ?? "snapshot",
    }
  }
}
