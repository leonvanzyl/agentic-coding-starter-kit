"use client";

import { useEffect } from "react";
import { MessageSquareWarning, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ChatError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Chat error:", error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto text-center">
        <div className="flex justify-center mb-6">
          <MessageSquareWarning className="h-16 w-16 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold mb-4">Chat Error</h1>
        <p className="text-muted-foreground mb-6">
          There was a problem with the chat service. This could be due to a
          connection issue or the AI service being temporarily unavailable.
        </p>
        {error.message && (
          <p className="text-sm text-muted-foreground mb-4 p-2 bg-muted rounded">
            {error.message}
          </p>
        )}
        <div className="flex gap-4 justify-center">
          <Button onClick={reset}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Try again
          </Button>
          <Button variant="outline" onClick={() => (window.location.href = "/")}>
            Go home
          </Button>
        </div>
      </div>
    </div>
  );
}
