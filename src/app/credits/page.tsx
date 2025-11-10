import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  userCredits,
  creditTransactions,
  creditPackages,
} from "@/lib/schema";
import { eq } from "drizzle-orm";
import { CreditShop } from "@/components/plushie/credit-shop";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { initializeUserCredits } from "@/lib/credits";

export default async function CreditsPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect("/");
  }

  // Initialize credits for new users
  await initializeUserCredits(session.user.id);

  // Get user's credit info
  const creditInfo = await db.query.userCredits.findFirst({
    where: eq(userCredits.userId, session.user.id),
  });

  // Get recent transactions
  const transactions = await db.query.creditTransactions.findMany({
    where: eq(creditTransactions.userId, session.user.id),
    orderBy: (t) => [t.createdAt],
    limit: 50,
  });

  // Get available packages
  const packages = await db.query.creditPackages.findMany({
    where: eq(creditPackages.active, true),
    orderBy: (p) => [p.credits],
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/10">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/plushie">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Transformer
            </Button>
          </Link>
          <h1 className="text-4xl font-bold mb-2">Credits & Billing</h1>
          <p className="text-muted-foreground">
            Manage your credits and purchase more transformations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Left Column: Stats & Transactions */}
          <div className="lg:col-span-1 space-y-4">
            {/* Credit Stats */}
            <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <h2 className="text-sm font-medium text-muted-foreground mb-4">
                Credit Balance
              </h2>
              <p className="text-4xl font-bold mb-4">
                {creditInfo?.credits ?? 0}
              </p>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Earned:</span>
                  <span className="font-medium">
                    {creditInfo?.totalEarned ?? 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Used:</span>
                  <span className="font-medium">
                    {creditInfo?.totalUsed ?? 0}
                  </span>
                </div>
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="p-6">
              <h2 className="text-sm font-semibold mb-4">Recent Activity</h2>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {transactions.length > 0 ? (
                  transactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="flex items-start justify-between gap-2 pb-2 border-b last:border-0"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">
                          {tx.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(tx.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div
                        className={`text-sm font-semibold whitespace-nowrap ${
                          tx.amount > 0
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {tx.amount > 0 ? "+" : ""}{tx.amount}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground text-center py-4">
                    No transactions yet
                  </p>
                )}
              </div>
            </Card>
          </div>

          {/* Right Column: Credit Shop */}
          <div className="lg:col-span-2">
            <CreditShop packages={packages} />
          </div>
        </div>

        {/* FAQ Section */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">How many credits do I get?</h3>
              <p className="text-sm text-muted-foreground">
                New users receive 50 free credits when they sign up. You can
                purchase additional credits at any time.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">
                How much do transformations cost?
              </h3>
              <p className="text-sm text-muted-foreground">
                Each plushie transformation costs 10 credits. This includes the
                AI analysis and design generation.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Can I get a refund?</h3>
              <p className="text-sm text-muted-foreground">
                Credits are non-refundable once purchased. However, if you
                experience a failed transformation, we&apos;ll refund the credits
                used.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Do credits expire?</h3>
              <p className="text-sm text-muted-foreground">
                No, your credits do not expire. You can use them whenever you
                want.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
