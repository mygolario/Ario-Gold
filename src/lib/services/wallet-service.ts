import {
  Prisma,
  TransactionRefType,
  TransactionType,
  WalletType,
} from "@prisma/client"

import { prisma } from "@/lib/prisma"

/**
 * Utility helpers for mutating wallet balances in a transactional + auditable way.
 * Centralizing the logic keeps manual adjustments, delivery refunds, and other
 * bespoke flows consistent with the automated order pipelines.
 */

export type AdjustWalletOptions = {
  userId: string
  walletType: WalletType
  amount: number
  direction: TransactionType
  refType: TransactionRefType
  refId?: string | null
  note?: string | null
  allowNegative?: boolean
  tx?: Prisma.TransactionClient
}

/**
 * Adjusts a wallet balance and writes the corresponding transaction log.
 * All wallet mutations that originate from manual admin actions or workflows
 * (delivery requests, refunds, manual credits) should flow through this helper
 * so we have a single place responsible for validation and Ledger history.
 */
export async function adjustWalletBalance({
  userId,
  walletType,
  amount,
  direction,
  refType,
  refId,
  note,
  allowNegative = false,
  tx,
}: AdjustWalletOptions) {
  const client = tx ?? prisma
  const wallet = await client.wallet.findFirst({
    where: { userId, type: walletType },
  })
  if (!wallet) {
    throw new Error("wallet_not_found")
  }

  const amountDecimal = new Prisma.Decimal(amount)
  const balanceAfter =
    direction === TransactionType.CREDIT
      ? wallet.balance.plus(amountDecimal)
      : wallet.balance.minus(amountDecimal)

  if (!allowNegative && balanceAfter.lt(0)) {
    throw new Error("negative_balance")
  }

  await client.wallet.update({
    where: { id: wallet.id },
    data: { balance: balanceAfter },
  })

  await client.walletTransaction.create({
    data: {
      walletId: wallet.id,
      type: direction,
      amount: amountDecimal,
      balanceAfter,
      refType,
      refId,
      metadata: note ? { note } : undefined,
    },
  })

  return balanceAfter
}
