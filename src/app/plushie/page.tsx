import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { imageTransformations, userCredits } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { UploadForm } from "@/components/plushie/upload-form";
import { TransformationGallery } from "@/components/plushie/transformation-gallery";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { initializeUserCredits, getTransformationCost } from "@/lib/credits";

export default async function PlushiePage() {
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

  // Get user's transformations
  const transformations = await db.query.imageTransformations.findMany({
    where: eq(imageTransformations.userId, session.user.id),
    orderBy: (t) => [t.createdAt],
    limit: 100,
  });

  const currentCredits = creditInfo?.credits ?? 0;
  const transformationCost = getTransformationCost();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/10">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-primary" />
              <h1 className="text-4xl font-bold">Plushie Transformer</h1>
            </div>
            <Link href="/credits">
              <Button variant="outline">
                View Credit History
              </Button>
            </Link>
          </div>
          <p className="text-muted-foreground">
            Transform your images into adorable plushie designs using AI
          </p>
        </div>

        {/* Credit Status */}
        <Card className="mb-8 p-6 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Available Credits
              </p>
              <p className="text-3xl font-bold">{currentCredits}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Transformations
              </p>
              <p className="text-3xl font-bold">{transformations.length}</p>
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-sm text-muted-foreground mb-1">
                Cost per transformation
              </p>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-base">
                  {transformationCost} credits
                </Badge>
                {currentCredits < transformationCost && (
                  <Badge variant="destructive">Insufficient</Badge>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Upload Form */}
          <div className="lg:col-span-1">
            <UploadForm
              currentCredits={currentCredits}
              transformationCost={transformationCost}
            />

            {/* Buy Credits CTA */}
            {currentCredits < transformationCost && (
              <Card className="mt-4 p-4 border-primary/20 bg-primary/5">
                <p className="text-sm font-medium mb-2">
                  Need more credits?
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  Get started with our credit packages
                </p>
                <Link href="/credits" className="block">
                  <Button className="w-full" variant="default">
                    Buy Credits
                  </Button>
                </Link>
              </Card>
            )}
          </div>

          {/* Gallery */}
          <div className="lg:col-span-2">
            <TransformationGallery transformations={transformations} />
          </div>
        </div>

        {/* Info Section */}
        <Card className="p-6 border-primary/20 bg-primary/5">
          <h2 className="text-lg font-semibold mb-3">How it works</h2>
          <ol className="space-y-2 text-sm text-muted-foreground">
            <li>
              <span className="font-medium text-foreground">1.</span> Upload an
              image with a person, pet, or character
            </li>
            <li>
              <span className="font-medium text-foreground">2.</span> Our AI
              analyzes the subject and designs a custom plushie
            </li>
            <li>
              <span className="font-medium text-foreground">3.</span> Get your
              plushie design visualization and details
            </li>
            <li>
              <span className="font-medium text-foreground">4.</span> Use these
              designs to create actual plushies or share with friends!
            </li>
          </ol>
        </Card>
      </div>
    </div>
  );
}
