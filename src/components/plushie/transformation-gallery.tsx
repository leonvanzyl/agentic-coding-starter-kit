"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Check, AlertCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Transformation {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  originalImageUrl: string;
  transformedImageUrl: string | null;
  status: string;
  creditsUsed: number;
  prompt: string | null;
  error: string | null;
  metadata: string | null;
}

interface TransformationGalleryProps {
  transformations: Transformation[];
}

export function TransformationGallery({
  transformations,
}: TransformationGalleryProps) {
  if (transformations.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground">
          No transformations yet. Upload an image to get started!
        </p>
      </Card>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
      case "processing":
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <Loader2 className="w-3 h-3 animate-spin" />
            Processing
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="default" className="flex items-center gap-1">
            <Check className="w-3 h-3" />
            Complete
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Failed
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const parseMetadata = (metadata: string | null) => {
    if (!metadata) return null;
    try {
      return JSON.parse(metadata);
    } catch {
      return null;
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Your Transformations</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {transformations.map((transformation) => {
          const meta = parseMetadata(transformation.metadata);
          return (
            <Card key={transformation.id} className="overflow-hidden">
              <div className="space-y-3">
                {/* Original Image */}
                <div className="aspect-square bg-muted overflow-hidden">
                  {transformation.originalImageUrl &&
                    transformation.originalImageUrl.startsWith("data:") ? (
                    <img
                      src={transformation.originalImageUrl}
                      alt="Original"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <span>No image</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 space-y-2">
                  {/* Status */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    {getStatusBadge(transformation.status)}
                  </div>

                  {/* Credits Used */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Credits Used</span>
                    <Badge variant="secondary">
                      {transformation.creditsUsed}
                    </Badge>
                  </div>

                  {/* Date */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Created</span>
                    <span>
                      {new Date(transformation.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Description */}
                  {meta?.description && (
                    <div className="pt-2 border-t">
                      <p className="text-xs text-muted-foreground font-medium mb-1">
                        Design:
                      </p>
                      <p className="text-xs line-clamp-3">
                        {meta.description}
                      </p>
                    </div>
                  )}

                  {/* Error Message */}
                  {transformation.status === "failed" &&
                    transformation.error && (
                      <div className="pt-2 border-t">
                        <p className="text-xs text-destructive">
                          {transformation.error}
                        </p>
                      </div>
                    )}

                  {/* Result Image */}
                  {transformation.status === "completed" &&
                    transformation.transformedImageUrl && (
                      <div className="pt-2 border-t">
                        <p className="text-xs text-muted-foreground font-medium mb-2">
                          Plushie Design:
                        </p>
                        <img
                          src={transformation.transformedImageUrl}
                          alt="Transformed"
                          className="w-full rounded border max-h-48 object-cover"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-2"
                        >
                          <Download className="w-3 h-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
