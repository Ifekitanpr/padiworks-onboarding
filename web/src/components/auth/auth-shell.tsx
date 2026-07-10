import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { AuthSidePanel } from "./auth-side-panel";

type AuthShellProps = {
  step?: number;
  panelHeadline: string;
  panelDescription?: string;
  /** Pass `null` to explicitly hide the callout (vs. omitting it, which shows the default copy). */
  panelCallout?: string | null;
  /** Decorative panel graphic. Omit for the default board collage (signup/login). */
  panelCollage?: ReactNode;
  contentMaxWidth?: string;
  children: ReactNode;
};

export function AuthShell({
  step,
  panelHeadline,
  panelDescription,
  panelCallout,
  panelCollage,
  contentMaxWidth = "max-w-[440px]",
  children,
}: AuthShellProps) {
  return (
    <div className="flex min-h-screen w-full bg-white">
      <div className="hidden aspect-[600/1024] max-h-screen w-[42%] max-w-[600px] shrink-0 self-center p-3 lg:block">
        <AuthSidePanel
          step={step}
          headline={panelHeadline}
          description={panelDescription}
          calloutText={panelCallout}
          collage={panelCollage}
        />
      </div>
      <div className="lg:hidden absolute top-0 right-0 left-0 flex h-[72px] items-center justify-between bg-[linear-gradient(110deg,#321a69,#5a35a8,#3b82f6)] px-5 shadow-sm">
        <img src="/images/auth/logo.svg" alt="Padiworks" className="h-6 w-[132px]" />
        <div className="flex items-center gap-2 text-xs text-white/70"><img src="/images/auth/help-circle.svg" alt="" className="size-4"/>Use help</div>
      </div>
      <div className="flex flex-1 items-center justify-center px-6 pt-28 pb-12 sm:px-10 lg:py-16">
        <div className={cn("w-full", contentMaxWidth)}>{children}</div>
      </div>
    </div>
  );
}
