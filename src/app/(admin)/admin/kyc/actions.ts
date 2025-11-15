"use server"

import { revalidatePath } from "next/cache"
import { KycLevel, KycStatus } from "@prisma/client"
import { z } from "zod"

import { handleAuthError, requireAdminOrKyc } from "@/lib/auth-guards"
import { prisma } from "@/lib/prisma"
import { recordAuditLog } from "@/lib/services/audit-service"

const approveSchema = z.object({
  userId: z.string(),
  level: z.nativeEnum(KycLevel),
})

const rejectSchema = z.object({
  userId: z.string(),
  reason: z.string().min(5, "ذکر دلیل الزامی است"),
})

/**
 * Approves a pending KYC profile, recording the reviewer, level and audit log entry.
 */
export async function approveKycAction(formData: FormData) {
  const session = await requireAdminOrKyc().catch((error) => {
    handleAuthError(error)
    return null as never
  })
  const parsed = approveSchema.safeParse({
    userId: formData.get("userId"),
    level: formData.get("level") ?? undefined,
  })
  if (!parsed.success) return

  await prisma.kycProfile.update({
    where: { userId: parsed.data.userId },
    data: {
      status: KycStatus.APPROVED,
      level: parsed.data.level,
      reviewedById: session.user.id,
      rejectionReason: null,
      approvedAt: new Date(),
    },
  })

  await recordAuditLog({
    actorId: session.user.id,
    action: "KYC_APPROVED",
    entity: "KycProfile",
    entityId: parsed.data.userId,
    metadata: { level: parsed.data.level },
  })

  revalidatePath("/admin/kyc")
  revalidatePath(`/admin/kyc/${parsed.data.userId}`)
}

/**
 * Rejects a KYC submission with a human-readable reason the customer can see.
 */
export async function rejectKycAction(formData: FormData) {
  const session = await requireAdminOrKyc().catch((error) => {
    handleAuthError(error)
    return null as never
  })
  const parsed = rejectSchema.safeParse({
    userId: formData.get("userId"),
    reason: formData.get("reason"),
  })
  if (!parsed.success) return

  await prisma.kycProfile.update({
    where: { userId: parsed.data.userId },
    data: {
      status: KycStatus.REJECTED,
      rejectionReason: parsed.data.reason,
      reviewedById: session.user.id,
    },
  })

  await recordAuditLog({
    actorId: session.user.id,
    action: "KYC_REJECTED",
    entity: "KycProfile",
    entityId: parsed.data.userId,
    metadata: { reason: parsed.data.reason },
  })

  revalidatePath("/admin/kyc")
  revalidatePath(`/admin/kyc/${parsed.data.userId}`)
}
