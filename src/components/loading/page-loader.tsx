"use client";

export function PageLoader({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-10 w-10">
          <span className="absolute inset-0 rounded-full border-2 border-yellow-500/20" />
          <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-yellow-400" />
          <span className="absolute inset-1.5 animate-spin rounded-full border border-transparent border-b-amber-500 [animation-direction:reverse] [animation-duration:1.5s]" />
        </div>
        <p className="text-sm text-neutral-500 tracking-wide">{label}</p>
      </div>
    </div>
  );
}
