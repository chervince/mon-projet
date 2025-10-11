import { auth } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Vérifier rôle admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true },
    });

    if (user?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Statistiques globales
    const [
      totalUsers,
      totalMerchants,
      totalCredits,
      totalVouchers,
      totalScans,
      recentScans,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.merchant.count(),
      prisma.credit.aggregate({
        _sum: { amount: true },
      }),
      prisma.voucher.count(),
      prisma.scanLog.count(),
      prisma.scanLog.findMany({
        take: 10,
        orderBy: { timestamp: "desc" },
        include: {
          user: { select: { name: true, email: true } },
          merchant: { select: { name: true } },
        },
      }),
    ]);

    const stats = {
      totalUsers,
      totalMerchants,
      totalCreditsDistributed: totalCredits._sum.amount || 0,
      totalVouchersGenerated: totalVouchers,
      totalScans: totalScans,
      recentScans: recentScans.map((scan) => ({
        id: scan.id,
        userName: scan.user.name || scan.user.email,
        merchantName: scan.merchant.name,
        ticketAmount: scan.ticketAmount,
        creditsEarned: scan.creditsEarned,
        timestamp: scan.timestamp,
        ip: scan.ip,
      })),
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}