import { cn } from "@/lib/utils";

type LoadingSkeletonProps = {
  type?: "product" | "cart" | "order" | "profile" | "checkout" | "payment";
  count?: number;
};

function SkeletonBlock({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-xl bg-slate-200", className)} />;
}

export default function LoadingSkeleton({ type = "product", count = 4 }: LoadingSkeletonProps) {
  if (type === "product") {
    return (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="rounded-2xl border border-navy/10 bg-white p-4 shadow-[0_12px_32px_rgba(27,38,59,0.06)]">
            <SkeletonBlock className="aspect-[4/3]" />
            <SkeletonBlock className="mt-4 h-5 w-3/4" />
            <SkeletonBlock className="mt-3 h-4 w-1/2" />
            <SkeletonBlock className="mt-5 h-11 w-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-2xl border border-navy/10 bg-white p-5 shadow-[0_12px_32px_rgba(27,38,59,0.06)]">
      {Array.from({ length: type === "payment" ? 3 : count }).map((_, index) => (
        <SkeletonBlock key={index} className="h-16 w-full" />
      ))}
    </div>
  );
}
