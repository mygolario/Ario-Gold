import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { z } from "zod"
import { Currency, WalletType } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { recordAuditLog } from "@/lib/services/audit-service"

const registerSchema = z.object({
  fullName: z.string().min(3).max(80),
  phone: z.string().min(10).max(20),
  email: z.string().email(),
  password: z.string().min(8).max(64),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = registerSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ errors: parsed.error.flatten().fieldErrors }, { status: 400 })
    }

    const { fullName, phone, email, password } = parsed.data
    const normalizedEmail = email.toLowerCase()

    const exists = await prisma.user.findFirst({
      where: {
        OR: [{ email: normalizedEmail }, { phone }],
      },
    })

    if (exists) {
      return NextResponse.json(
        { error: "?????? ?? ??? ????? ?? ????? ?????? ???? ????." },
        { status: 409 },
      )
    }

    const passwordHash = await hash(password, 12)

    const user = await prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          fullName,
          phone,
          email: normalizedEmail,
          passwordHash,
        },
      })

      await tx.kycProfile.create({ data: { userId: createdUser.id } })
      await tx.wallet.createMany({
        data: [
          { userId: createdUser.id, type: WalletType.FIAT, currency: Currency.IRR },
          { userId: createdUser.id, type: WalletType.GOLD, currency: Currency.GOLD_GRAM },
        ],
      })

      return createdUser
    })

    await recordAuditLog({
      actorId: user.id,
      action: "USER_REGISTERED",
      entity: "User",
      entityId: user.id,
      metadata: { phone },
    })

    return NextResponse.json({ success: true, userId: user.id }, { status: 201 })
  } catch (error) {
    console.error("register.error", error)
    return NextResponse.json({ error: "???? ????? ????" }, { status: 500 })
  }
}
