import { Prisma } from "@prisma/client"

import { prisma } from "@/lib/prisma"

export type AuditLogInput = {
  actorId?: string | null
  action: string
  entity: string
  entityId?: string | null
  metadata?: Prisma.JsonValue
}

export async function recordAuditLog(input: AuditLogInput) {
  await prisma.auditLog.create({
    data: {
      actorId: input.actorId ?? null,
      action: input.action,
      entity: input.entity,
      entityId: input.entityId ?? null,
      metadata: input.metadata ?? undefined,
    },
  })
}
