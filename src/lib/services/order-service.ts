import {
  Prisma,
  TransactionRefType,
  TransactionType,
  WalletType,
  OrderType,
  OrderStatus,
} from "@prisma/client"

import { prisma } from "@/lib/prisma"

/**
 * Creates a BUY order, debits the fiat wallet, credits the gold wallet, and writes
 * matching ledger entries so balances stay consistent even if a later step fails.
 */
export async function createBuyOrder(params: {
  userId: string
  fiatAmount: number
  pricePerGram: number
  feePercent: number
}) {
  const fiatAmount = new Prisma.Decimal(params.fiatAmount)
  const pricePerGram = new Prisma.Decimal(params.pricePerGram)
  const feePercent = new Prisma.Decimal(params.feePercent)
  const feeAmount = fiatAmount.mul(feePercent)
  const goldGrams = fiatAmount.minus(feeAmount).div(pricePerGram)

  return prisma.$transaction(async (tx) => {
    const fiatWallet = await tx.wallet.findFirst({
      where: { userId: params.userId, type: WalletType.FIAT },
    })
    const goldWallet = await tx.wallet.findFirst({
      where: { userId: params.userId, type: WalletType.GOLD },
    })

    if (!fiatWallet || !goldWallet) {
      throw new Error("wallets_not_found")
    }

    if (fiatWallet.balance.lt(fiatAmount)) {
      throw new Error("insufficient_funds")
    }

    const order = await tx.order.create({
      data: {
        userId: params.userId,
        type: OrderType.BUY_GOLD,
        status: OrderStatus.CREATED,
        fiatAmount,
        goldGrams,
        pricePerGram,
        feePercent,
        feeAmount,
        fiatWalletId: fiatWallet.id,
        goldWalletId: goldWallet.id,
      },
    })

    const newFiatBalance = fiatWallet.balance.minus(fiatAmount)
    const newGoldBalance = goldWallet.balance.plus(goldGrams)

    await tx.wallet.update({
      where: { id: fiatWallet.id },
      data: { balance: newFiatBalance },
    })
    await tx.wallet.update({
      where: { id: goldWallet.id },
      data: { balance: newGoldBalance },
    })

    await tx.walletTransaction.createMany({
      data: [
        {
          walletId: fiatWallet.id,
          type: TransactionType.DEBIT,
          amount: fiatAmount,
          balanceAfter: newFiatBalance,
          refType: TransactionRefType.ORDER,
          refId: order.id,
        },
        {
          walletId: goldWallet.id,
          type: TransactionType.CREDIT,
          amount: goldGrams,
          balanceAfter: newGoldBalance,
          refType: TransactionRefType.ORDER,
          refId: order.id,
        },
      ],
    })

    return order
  })
}

/**
 * Creates a SELL order by debiting the customer's gold wallet and crediting the
 * fiat wallet with the settlement amount after fees. Both wallet moves share the
 * same transaction boundary to keep balances deterministic.
 */
export async function createSellOrder(params: {
  userId: string
  goldGrams: number
  pricePerGram: number
  feePercent: number
}) {
  const goldGrams = new Prisma.Decimal(params.goldGrams)
  const pricePerGram = new Prisma.Decimal(params.pricePerGram)
  const feePercent = new Prisma.Decimal(params.feePercent)
  const grossFiat = goldGrams.mul(pricePerGram)
  const feeAmount = grossFiat.mul(feePercent)
  const fiatAmount = grossFiat.minus(feeAmount)

  return prisma.$transaction(async (tx) => {
    const fiatWallet = await tx.wallet.findFirst({
      where: { userId: params.userId, type: WalletType.FIAT },
    })
    const goldWallet = await tx.wallet.findFirst({
      where: { userId: params.userId, type: WalletType.GOLD },
    })

    if (!fiatWallet || !goldWallet) {
      throw new Error("wallets_not_found")
    }

    if (goldWallet.balance.lt(goldGrams)) {
      throw new Error("insufficient_gold")
    }

    const order = await tx.order.create({
      data: {
        userId: params.userId,
        type: OrderType.SELL_GOLD,
        status: OrderStatus.CREATED,
        fiatAmount,
        goldGrams,
        pricePerGram,
        feePercent,
        feeAmount,
        fiatWalletId: fiatWallet.id,
        goldWalletId: goldWallet.id,
      },
    })

    const newGoldBalance = goldWallet.balance.minus(goldGrams)
    const newFiatBalance = fiatWallet.balance.plus(fiatAmount)

    await tx.wallet.update({ where: { id: goldWallet.id }, data: { balance: newGoldBalance } })
    await tx.wallet.update({ where: { id: fiatWallet.id }, data: { balance: newFiatBalance } })

    await tx.walletTransaction.createMany({
      data: [
        {
          walletId: goldWallet.id,
          type: TransactionType.DEBIT,
          amount: goldGrams,
          balanceAfter: newGoldBalance,
          refType: TransactionRefType.ORDER,
          refId: order.id,
        },
        {
          walletId: fiatWallet.id,
          type: TransactionType.CREDIT,
          amount: fiatAmount,
          balanceAfter: newFiatBalance,
          refType: TransactionRefType.ORDER,
          refId: order.id,
        },
      ],
    })

    return order
  })
}
