import { cn } from "@/lib/utils";

/** Approximation of the Padiworks asterisk mark (no source SVG available from Figma). */
export function PadiworksMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn("size-6", className)}
      aria-hidden="true"
    >
      <path
        d="M12 1.5v21M2.5 6.75l19 10.5M2.5 17.25l19-10.5M12 1.5c-2 3-2 6-0 9M12 22.5c-2-3-2-6 0-9"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="2.25" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function PadiworksLogo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2 text-white", className)}>
      <PadiworksMark className="size-6" />
      <span className="font-semibold text-lg tracking-tight">Padiworks</span>
    </div>
  );
}
