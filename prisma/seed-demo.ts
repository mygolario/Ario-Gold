import { PrismaClient, Role, WalletType, Currency, OrderType, OrderStatus, DocumentStatus, DocumentType, DeliveryStatus, DeliveryType } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  await prisma.auditLog.deleteMany()
  await prisma.document.deleteMany()
  await prisma.deliveryRequest.deleteMany()
  await prisma.order.deleteMany()
  await prisma.walletTransaction.deleteMany()
  await prisma.wallet.deleteMany()
  await prisma.kycProfile.deleteMany()
  await prisma.user.deleteMany()
  await prisma.priceSnapshot.deleteMany()

  const password = await hash("DemoPass123!", 10)

  const admin = await prisma.user.create({
    data: {
      fullName: "مدیر سامانه",
      email: "admin@ario-gold.ir",
      phone: "09120000000",
      role: Role.ADMIN,
      passwordHash: password,
    },
  })

  const officer = await prisma.user.create({
    data: {
      fullName: "افسر احراز هویت",
      email: "kyc@ario-gold.ir",
      phone: "09120000001",
      role: Role.KYC_OFFICER,
      passwordHash: password,
    },
  })

  const demoUser = await prisma.user.create({
    data: {
      fullName: "کاربر دمو",
      email: "user@ario-gold.ir",
      phone: "09120000002",
      role: Role.USER,
      passwordHash: password,
      nationalId: "1234567890",
      city: "تهران",
    },
  })

  await prisma.kycProfile.create({
    data: {
      userId: demoUser.id,
      status: "APPROVED",
      level: "LEVEL2",
      approvedAt: new Date(),
      reviewedById: officer.id,
    },
  })

  await prisma.document.createMany({
    data: [
      {
        userId: demoUser.id,
        type: DocumentType.NATIONAL_ID,
        status: DocumentStatus.DOC_APPROVED,
        fileUrl: "/uploads/demo-national-id.png",
      },
      {
        userId: demoUser.id,
        type: DocumentType.SELFIE,
        status: DocumentStatus.DOC_APPROVED,
        fileUrl: "/uploads/demo-selfie.png",
      },
    ],
  })

  const [fiatWallet, goldWallet] = await prisma.$transaction([
    prisma.wallet.create({
      data: {
        userId: demoUser.id,
        type: WalletType.FIAT,
        currency: Currency.IRR,
        balance: 250_000_000,
      },
    }),
    prisma.wallet.create({
      data: {
        userId: demoUser.id,
        type: WalletType.GOLD,
        currency: Currency.GOLD_GRAM,
        balance: 150,
      },
    }),
  ])

  const priceSnapshot = await prisma.priceSnapshot.create({
    data: {
      gold18Sell: 12_500_000,
      gold18Buy: 12_200_000,
      source: JSON.stringify({ vendor: "demo_seed", gold24Sell: 16_600_000, rawGold: 11_800_000, emamiCoin: 1_100_000_000 }),
    },
  })

  const order = await prisma.order.create({
    data: {
      userId: demoUser.id,
      type: OrderType.BUY_GOLD,
      status: OrderStatus.COMPLETED,
      fiatAmount: 50_000_000,
      goldGrams: 4,
      pricePerGram: 12_500_000,
      feePercent: 0.002,
      feeAmount: 100_000,
      fiatWalletId: fiatWallet.id,
      goldWalletId: goldWallet.id,
    },
  })

  await prisma.walletTransaction.createMany({
    data: [
      {
        walletId: fiatWallet.id,
        type: "DEBIT",
        amount: 50_000_000,
        balanceAfter: 200_000_000,
        refType: "ORDER",
        refId: order.id,
      },
      {
        walletId: goldWallet.id,
        type: "CREDIT",
        amount: 4,
        balanceAfter: 154,
        refType: "ORDER",
        refId: order.id,
      },
    ],
  })

  await prisma.deliveryRequest.create({
    data: {
      userId: demoUser.id,
      grams: 10,
      type: DeliveryType.GOLD_BAR,
      status: DeliveryStatus.IN_PROGRESS,
      address: "تهران، خیابان ولیعصر، پلاک 100",
      city: "تهران",
      postalCode: "1234567890",
      trackingCode: "TRK-001",
    },
  })

  await prisma.auditLog.createMany({
    data: [
      {
        actorId: admin.id,
        action: "SYSTEM_SEED",
        entity: "System",
        metadata: { note: "Demo seed executed" },
      },
      {
        actorId: demoUser.id,
        action: "ORDER_CREATED_BUY",
        entity: "Order",
        entityId: order.id,
        metadata: { priceSnapshotId: priceSnapshot.id },
      },
    ],
  })

  console.log("Demo data seeded. Credentials: admin@ario-gold.ir / user@ario-gold.ir / password DemoPass123!")
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
