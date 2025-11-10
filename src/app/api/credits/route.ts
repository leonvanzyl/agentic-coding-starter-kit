import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import {
  userCredits,
  creditTransactions,
  creditPackages,
} from "@/lib/schema";
import { eq } from "drizzle-orm";
import {
  initializeUserCredits,
  getTransformationCost,
} from "@/lib/credits";

/**
 * GET /api/credits - Get user's credit information
 */
export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ensure user has credits record
    await initializeUserCredits(session.user.id);

    // Get user's credit info
    const credits = await db.query.userCredits.findFirst({
      where: eq(userCredits.userId, session.user.id),
    });

    // Get recent transactions
    const transactions = await db.query.creditTransactions.findMany({
      where: eq(creditTransactions.userId, session.user.id),
      orderBy: (t) => [t.createdAt],
      limit: 20,
    });

    // Get available packages
    const packages = await db.query.creditPackages.findMany({
      where: eq(creditPackages.active, true),
      orderBy: (p) => [p.credits],
    });

    return NextResponse.json({
      credits: {
        current: credits?.credits ?? 0,
        totalEarned: credits?.totalEarned ?? 0,
        totalUsed: credits?.totalUsed ?? 0,
      },
      transformationCost: getTransformationCost(),
      transactions,
      packages,
    });
  } catch (error) {
    console.error("Error fetching credits:", error);
    return NextResponse.json(
      { error: "Failed to fetch credits" },
      { status: 500 }
    );
  }
}
