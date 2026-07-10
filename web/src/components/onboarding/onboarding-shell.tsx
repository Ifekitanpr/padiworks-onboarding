import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";

export function OnboardingFormHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mx-auto flex max-w-[480px] flex-col gap-2 text-center">
      <h1 className="text-[28px] leading-tight font-bold tracking-tight text-brand-grey-900">
        {title}
      </h1>
      {description && (
        <p className="text-sm text-brand-grey-500">{description}</p>
      )}
    </div>
  );
}

export function OnboardingFooter({
  children,
  onBack,
  showBack = true,
}: {
  children: ReactNode;
  onBack?: () => void;
  showBack?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      {showBack ? (
        <button
          type="button"
          onClick={onBack}
          className="flex h-14 items-center gap-3 rounded-lg bg-[#f7f9fc] px-6 text-sm font-medium text-brand-grey-600 hover:bg-brand-grey-100"
        >
          <ArrowLeft className="size-4" />
          Back
        </button>
      ) : (
        <span />
      )}
      <div className="flex items-center gap-3">{children}</div>
    </div>
  );
}
