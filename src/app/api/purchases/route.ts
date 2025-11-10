import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { creditPackages, orders } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { addCredits, initializeUserCredits } from "@/lib/credits";

/**
 * GET /api/purchases - Get available credit packages
 */
export async function GET() {
  try {
    const packages = await db.query.creditPackages.findMany({
      where: eq(creditPackages.active, true),
      orderBy: (p) => [p.credits],
    });

    return NextResponse.json({
      packages,
      message: "Available credit packages",
    });
  } catch (error) {
    console.error("Error fetching packages:", error);
    return NextResponse.json(
      { error: "Failed to fetch packages" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/purchases - Create a purchase order
 * In production, this would integrate with Polar or another payment provider
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ensure user has credits record
    await initializeUserCredits(session.user.id);

    const { packageId } = await req.json();

    if (!packageId) {
      return NextResponse.json(
        { error: "packageId is required" },
        { status: 400 }
      );
    }

    // Get the package
    const pkg = await db.query.creditPackages.findFirst({
      where: eq(creditPackages.id, packageId),
    });

    if (!pkg || !pkg.active) {
      return NextResponse.json(
        { error: "Package not found or inactive" },
        { status: 404 }
      );
    }

    // Create order
    const [order] = await db
      .insert(orders)
      .values({
        userId: session.user.id,
        packageId: pkg.id,
        status: "completed", // In production, this would be 'pending' until Polar confirms
        creditsAdded: pkg.credits,
        amount: pkg.priceInCents,
      })
      .returning();

    // Add credits to user account
    await addCredits(
      session.user.id,
      pkg.credits,
      `Purchased ${pkg.credits} credits`,
      order.id
    );

    return NextResponse.json({
      success: true,
      order,
      message: `Successfully purchased ${pkg.credits} credits`,
    });
  } catch (error) {
    console.error("Error creating purchase:", error);
    return NextResponse.json(
      { error: "Failed to create purchase" },
      { status: 500 }
    );
  }
}
