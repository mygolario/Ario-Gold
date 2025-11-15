"use server"

import { revalidatePath } from "next/cache"
import { promises as fs } from "node:fs"
import path from "node:path"
import { DocumentStatus, DocumentType } from "@prisma/client"
import { z } from "zod"

import { handleAuthError, requireUser } from "@/lib/auth-guards"
import { prisma } from "@/lib/prisma"

const uploadSchema = z.object({
  type: z.nativeEnum(DocumentType),
})

export type UploadActionState = {
  status: string
  message: string
}

export async function uploadDocumentAction(_prevState: UploadActionState, formData: FormData) {
  const session = await requireUser().catch((error) => {
    handleAuthError(error)
    return null as never
  })

  const file = formData.get("document") as File | null
  const typeValue = formData.get("type")?.toString() as DocumentType | undefined

  if (!file || file.size === 0) {
    return { status: "error", message: "فایل انتخاب نشده است" }
  }

  const parsed = uploadSchema.safeParse({ type: typeValue })
  if (!parsed.success) {
    return { status: "error", message: "نوع مدرک نامعتبر است" }
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const uploadsDir = path.join(process.cwd(), "public", "uploads")
  await fs.mkdir(uploadsDir, { recursive: true })
  const fileName = `${session.user.id}-${parsed.data.type}-${Date.now()}-${file.name}`
  const filePath = path.join(uploadsDir, fileName)
  await fs.writeFile(filePath, buffer)
  const publicUrl = `/uploads/${fileName}`

  const existing = await prisma.document.findFirst({
    where: { userId: session.user.id, type: parsed.data.type },
  })

  if (existing) {
    await prisma.document.update({
      where: { id: existing.id },
      data: { fileUrl: publicUrl, status: DocumentStatus.DOC_PENDING },
    })
  } else {
    await prisma.document.create({
      data: {
        userId: session.user.id,
        type: parsed.data.type,
        fileUrl: publicUrl,
      },
    })
  }

  revalidatePath("/kyc")
  return { status: "success", message: "مدرک با موفقیت ارسال شد" }
}
