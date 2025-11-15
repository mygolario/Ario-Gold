"use server"

import { revalidatePath } from "next/cache"
import { TransactionRefType, TransactionType, WalletType } from "@prisma/client"
import { z } from "zod"

import { handleAuthError, requireAdmin } from "@/lib/auth-guards"
import { recordAuditLog } from "@/lib/services/audit-service"
import { adjustWalletBalance } from "@/lib/services/wallet-service"

const adjustSchema = z.object({
  userId: z.string(),
  walletType: z.nativeEnum(WalletType),
  direction: z.enum(["CREDIT", "DEBIT"]),
  amount: z.coerce.number().positive(),
  note: z.string().optional(),
})

export type AdjustState = { status: string; message?: string }

export async function adjustWalletAction(prevState: AdjustState, formData: FormData) {
  const session = await requireAdmin().catch((error) => {
    handleAuthError(error)
    return null as never
  })

  const parsed = adjustSchema.safeParse({
    userId: formData.get("userId"),
    walletType: formData.get("walletType") ?? undefined,
    direction: formData.get("direction") ?? undefined,
    amount: formData.get("amount"),
    note: formData.get("note") ?? undefined,
  })

  if (!parsed.success) {
    return { status: "error", message: "اطلاعات فرم صحیح نیست" }
  }

  try {
    await adjustWalletBalance({
      userId: parsed.data.userId,
      walletType: parsed.data.walletType,
      amount: parsed.data.amount,
      direction: parsed.data.direction === "CREDIT" ? TransactionType.CREDIT : TransactionType.DEBIT,
      refType: TransactionRefType.MANUAL_ADJUSTMENT,
      refId: session.user.id,
      note: parsed.data.note,
    })

    await recordAuditLog({
      actorId: session.user.id,
      action: "WALLET_MANUAL_ADJUSTMENT",
      entity: "Wallet",
      entityId: parsed.data.userId,
      metadata: parsed.data,
    })
  } catch (error) {
    const message =
      error instanceof Error && error.message === "negative_balance"
        ? "کسر موجودی مجاز نیست."
        : "در اجرای عملیات خطایی رخ داد."
    return { status: "error", message }
  }

  revalidatePath(`/admin/users/${parsed.data.userId}`)
  return { status: "success", message: "موجودی کیف پول به‌روزرسانی شد." }
}
