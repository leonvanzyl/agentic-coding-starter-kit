import { db } from "./db";
import { userCredits, creditTransactions } from "./schema";
import { eq } from "drizzle-orm";

const TRANSFORMATION_COST = 10; // Default cost per transformation

/**
 * Initialize user credits on signup
 */
export async function initializeUserCredits(userId: string) {
  const existing = await db.query.userCredits.findFirst({
    where: eq(userCredits.userId, userId),
  });

  if (existing) {
    return existing;
  }

  const [newUserCredits] = await db
    .insert(userCredits)
    .values({
      userId,
      credits: 50, // Free starting credits
      totalEarned: 50,
      totalUsed: 0,
    })
    .returning();

  // Log transaction
  await db.insert(creditTransactions).values({
    userId,
    amount: 50,
    type: "earned",
    description: "Initial free credits",
  });

  return newUserCredits;
}

/**
 * Get user's current credit balance
 */
export async function getUserCredits(userId: string) {
  const credits = await db.query.userCredits.findFirst({
    where: eq(userCredits.userId, userId),
  });

  return credits?.credits ?? 0;
}

/**
 * Deduct credits for transformation
 */
export async function deductCredits(
  userId: string,
  transformationId: string,
  amount: number = TRANSFORMATION_COST
) {
  const userCreditRecord = await db.query.userCredits.findFirst({
    where: eq(userCredits.userId, userId),
  });

  if (!userCreditRecord || userCreditRecord.credits < amount) {
    throw new Error("Insufficient credits");
  }

  // Deduct credits
  await db
    .update(userCredits)
    .set({
      credits: userCreditRecord.credits - amount,
      totalUsed: userCreditRecord.totalUsed + amount,
    })
    .where(eq(userCredits.userId, userId));

  // Log transaction
  await db.insert(creditTransactions).values({
    userId,
    amount: -amount,
    type: "used",
    description: `Transformation processed`,
    relatedId: transformationId,
  });
}

/**
 * Add credits (e.g., from purchase)
 */
export async function addCredits(
  userId: string,
  amount: number,
  description: string,
  relatedId?: string
) {
  const userCreditRecord = await db.query.userCredits.findFirst({
    where: eq(userCredits.userId, userId),
  });

  if (!userCreditRecord) {
    await initializeUserCredits(userId);
  }

  // Add credits
  await db
    .update(userCredits)
    .set({
      credits: (userCreditRecord?.credits ?? 0) + amount,
      totalEarned: (userCreditRecord?.totalEarned ?? 0) + amount,
    })
    .where(eq(userCredits.userId, userId));

  // Log transaction
  await db.insert(creditTransactions).values({
    userId,
    amount,
    type: "purchased",
    description,
    relatedId,
  });
}

/**
 * Get transformation cost
 */
export function getTransformationCost() {
  return TRANSFORMATION_COST;
}
