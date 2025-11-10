"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Check } from "lucide-react";

interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  priceInCents: number;
}

interface CreditShopProps {
  packages: CreditPackage[];
  onPurchaseSuccess?: () => void;
}

export function CreditShop({ packages, onPurchaseSuccess }: CreditShopProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handlePurchase = async (packageId: string) => {
    setLoading(packageId);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/purchases", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ packageId }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Failed to complete purchase");
        return;
      }

      const data = await response.json();
      setSuccess(`Successfully purchased ${data.order.creditsAdded} credits!`);
      onPurchaseSuccess?.();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Failed to process purchase. Please try again.");
      console.error(err);
    } finally {
      setLoading(null);
    }
  };

  const formatPrice = (cents: number) => {
    return (cents / 100).toFixed(2);
  };

  const getValuePerCredit = (cents: number, credits: number) => {
    return (cents / credits).toFixed(4);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Buy Credits</h2>

      {error && (
        <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-500/10 text-green-700 dark:text-green-400 rounded-lg text-sm flex items-center gap-2">
          <Check className="w-4 h-4" />
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {packages.map((pkg) => (
          <Card key={pkg.id} className="p-4 flex flex-col">
            <div className="space-y-3 flex-1">
              <div>
                <h3 className="font-semibold text-lg">{pkg.name}</h3>
              </div>

              <div className="space-y-1">
                <Badge variant="default" className="text-base py-1 px-3">
                  {pkg.credits} Credits
                </Badge>
                <p className="text-2xl font-bold">
                  ${formatPrice(pkg.priceInCents)}
                </p>
                <p className="text-xs text-muted-foreground">
                  ${getValuePerCredit(pkg.priceInCents, pkg.credits)}/credit
                </p>
              </div>

              <div className="p-2 bg-muted rounded text-xs text-muted-foreground">
                {Math.floor(pkg.credits / 10)} transformations
              </div>
            </div>

            <Button
              onClick={() => handlePurchase(pkg.id)}
              disabled={loading !== null}
              className="w-full mt-4"
            >
              {loading === pkg.id ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Purchase"
              )}
            </Button>
          </Card>
        ))}
      </div>

      <p className="text-xs text-muted-foreground text-center pt-4">
        💡 Tip: Buying larger packages gives you better value per credit!
      </p>
    </div>
  );
}
