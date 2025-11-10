import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { imageTransformations, userCredits } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { deductCredits, getTransformationCost, initializeUserCredits } from "@/lib/credits";

/**
 * GET /api/transformations - Get user's transformation history
 */
export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ensure user has credits record
    await initializeUserCredits(session.user.id);

    // Get user's transformations
    const transformations = await db.query.imageTransformations.findMany({
      where: eq(imageTransformations.userId, session.user.id),
      orderBy: (t) => [t.createdAt],
      limit: 50,
    });

    // Get current credits
    const credits = await db.query.userCredits.findFirst({
      where: eq(userCredits.userId, session.user.id),
    });

    return NextResponse.json({
      transformations,
      currentCredits: credits?.credits ?? 0,
      cost: getTransformationCost(),
    });
  } catch (error) {
    console.error("Error fetching transformations:", error);
    return NextResponse.json(
      { error: "Failed to fetch transformations" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/transformations - Create a new transformation
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ensure user has credits record
    await initializeUserCredits(session.user.id);

    const formData = await request.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Check if image is valid
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Invalid file type. Only images are allowed." },
        { status: 400 }
      );
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 10MB." },
        { status: 400 });
    }

    // Check user's credits
    const credits = await db.query.userCredits.findFirst({
      where: eq(userCredits.userId, session.user.id),
    });

    const cost = getTransformationCost();
    if (!credits || credits.credits < cost) {
      return NextResponse.json(
        {
          error: "Insufficient credits",
          required: cost,
          current: credits?.credits ?? 0,
        },
        { status: 402 }
      );
    }

    // Convert image to base64 for now (in production, use cloud storage)
    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    const imageData = `data:${file.type};base64,${base64}`;

    // Create transformation record
    const [transformation] = await db
      .insert(imageTransformations)
      .values({
        userId: session.user.id,
        originalImageUrl: imageData,
        status: "pending",
        creditsUsed: cost,
      })
      .returning();

    // Deduct credits
    await deductCredits(session.user.id, transformation.id, cost);

    return NextResponse.json({
      transformation,
      message: "Image queued for transformation",
    });
  } catch (error) {
    console.error("Error creating transformation:", error);
    return NextResponse.json(
      { error: "Failed to create transformation" },
      { status: 500 }
    );
  }
}
