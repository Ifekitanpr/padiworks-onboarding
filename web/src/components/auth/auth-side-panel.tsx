import type { ReactNode } from "react";
import { BoardCollage } from "./collages";

type AuthSidePanelProps = {
  step?: number;
  headline: string;
  description?: string;
  calloutText?: string | null;
  /** Decorative graphic. Defaults to the board collage (signup/login). */
  collage?: ReactNode;
};

const DEFAULT_CALLOUT =
  "Enabling performance evidence through execution of strategy, powered by artificial intelligence, designed for growth companies.";

export function AuthSidePanel({
  step,
  headline,
  description,
  calloutText,
  collage,
}: AuthSidePanelProps) {
  const callout = calloutText === undefined ? DEFAULT_CALLOUT : calloutText;
  const isBoardLayout = collage === undefined;

  return (
    <div className="auth-panel-stage relative hidden h-full w-full overflow-hidden rounded-3xl bg-brand-purple-50 lg:block">
      {/* Blurred blob glow, mirrored + blurred 50px, bleeding in from the right (Figma layer 1) */}
      <div
        className="absolute h-[121%] w-[218.83%] overflow-hidden"
        style={{ right: "-106.42%", top: "43.15%", transform: "translateY(-50%)" }}
      >
        <img
          src="/images/auth/blob-glow.png"
          alt=""
          className="h-full w-full scale-x-[-1] object-cover blur-[50px]"
        />
      </div>

      {/* Subtle white 5%-opacity texture vector, rotated 44.59deg (Figma layer 2) */}
      <div
        className="absolute flex h-[157.3%] w-[274.47%] items-center justify-center"
        style={{ left: "-68.03%", top: "7.976%", transform: "rotate(44.59deg)" }}
      >
        <img
          src="/images/auth/texture-vector.svg"
          alt=""
          className="h-[46.08%] w-[95.22%] max-w-none flex-none"
        />
      </div>

      {isBoardLayout ? (
        <>
          {/* Board collage is positioned against the FULL panel, independent of the title flow. */}
          <BoardCollage />

          <div className="auth-panel-flow relative flex h-full flex-col p-10">
            <PanelHeader />

            {step != null ? (
              <div className="auth-panel-title flex items-center gap-6">
                <StepBadge step={step} />
                <p className="auth-panel-headline flex-1 leading-[1.2] font-bold tracking-tight text-white">
                  {headline}
                </p>
              </div>
            ) : (
              <PanelTitle headline={headline} description={description} />
            )}

            {callout && <PanelCallout text={callout} />}
          </div>
        </>
      ) : (
        <div className="relative flex h-full flex-col p-10">
          <PanelHeader />
          <div className="flex flex-1 -translate-y-10 flex-col items-center justify-center gap-[60px]">
            <PanelTitle headline={headline} description={description} center />
            <div className="w-full max-w-[496px]">{collage}</div>
          </div>
        </div>
      )}
    </div>
  );
}

function PanelHeader() {
  return (
    <div className="flex items-center justify-between">
      <img
        src="/images/auth/logo.svg"
        alt="Padiworks"
        width={156}
        height={28}
        className="h-[28px] w-[154px]"
      />
      <div className="flex items-center gap-2">
        <img src="/images/auth/help-circle.svg" alt="" className="size-5 opacity-40" />
        <span className="text-sm text-white/40">Use help</span>
      </div>
    </div>
  );
}

function StepBadge({ step }: { step: number }) {
  return (
    <div className="auth-step-badge relative flex shrink-0 items-center justify-center">
      <img
        src="/images/auth/laurel-wreath.svg"
        alt=""
        className="absolute inset-0 size-full rotate-180 scale-x-[-1]"
      />
      <span className="auth-step-number relative font-bold tracking-tight text-white/50">{step}</span>
    </div>
  );
}

function PanelTitle({
  headline,
  description,
  center = false,
}: {
  headline: string;
  description?: string;
  center?: boolean;
}) {
  return (
    <div className={`flex w-full flex-col gap-2 ${center ? "text-center" : ""}`}>
      <p className={center ? "text-xl leading-[1.2] font-bold tracking-tight text-white/40" : "text-[28px] leading-[1.2] font-bold tracking-tight text-white"}>{headline}</p>
      {description && (
        <p className={center ? "text-[28px] leading-[1.2] font-bold tracking-tight text-white" : "text-base leading-relaxed text-white/80"}>{description}</p>
      )}
    </div>
  );
}

function PanelCallout({ text }: { text: string }) {
  return (
    <div className="auth-panel-callout flex items-start gap-4 rounded-xl bg-white/5 p-4">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white shadow-[0_0_3px_-1px_rgba(16,25,40,0.04),0_14px_22px_-9px_rgba(16,25,40,0.14)]">
        <img src="/images/auth/bot-icon.svg" alt="" className="size-5" />
      </div>
      <p className="text-sm leading-relaxed text-white/70">{text}</p>
    </div>
  );
}
