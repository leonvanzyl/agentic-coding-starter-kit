import { Skeleton } from "@/components/ui/skeleton";

export default function ChatLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header skeleton */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-40" />
        </div>

        {/* Messages skeleton */}
        <div className="min-h-[50vh] space-y-4 mb-4">
          {/* AI message */}
          <div className="max-w-[80%]">
            <Skeleton className="h-4 w-12 mb-2" />
            <Skeleton className="h-20 w-full rounded-lg" />
          </div>

          {/* User message */}
          <div className="max-w-[80%] ml-auto">
            <Skeleton className="h-4 w-12 mb-2 ml-auto" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>

          {/* AI message */}
          <div className="max-w-[80%]">
            <Skeleton className="h-4 w-12 mb-2" />
            <Skeleton className="h-32 w-full rounded-lg" />
          </div>
        </div>

        {/* Input skeleton */}
        <div className="flex gap-2">
          <Skeleton className="flex-1 h-10 rounded-md" />
          <Skeleton className="h-10 w-20 rounded-md" />
        </div>
      </div>
    </div>
  );
}
