import { db } from "./db";
import { creditPackages } from "./schema";

/**
 * Seed credit packages into the database
 * Run this function on application startup or as part of migrations
 */
export async function seedCreditPackages() {
  const defaultPackages = [
    {
      name: "Starter Pack",
      credits: 50,
      priceInCents: 499, // $4.99
    },
    {
      name: "Popular Pack",
      credits: 150,
      priceInCents: 1299, // $12.99
    },
    {
      name: "Professional Pack",
      credits: 500,
      priceInCents: 3999, // $39.99
    },
    {
      name: "Ultimate Pack",
      credits: 1500,
      priceInCents: 9999, // $99.99
    },
  ];

  // Check if packages already exist
  const existing = await db.query.creditPackages.findFirst();
  if (existing) {
    console.log("Credit packages already seeded");
    return;
  }

  // Insert default packages
  await db.insert(creditPackages).values(
    defaultPackages.map((pkg) => ({
      name: pkg.name,
      credits: pkg.credits,
      priceInCents: pkg.priceInCents,
      active: true,
    }))
  );

  console.log("Successfully seeded credit packages");
}
