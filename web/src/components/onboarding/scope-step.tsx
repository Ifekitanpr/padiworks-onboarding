"use client";

import { useState } from "react";
import { Building2, Users2, Play, Check, Loader2, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { StepProps, Scope } from "./types";
import { OnboardingFormHeader } from "./onboarding-shell";

const scopes: {
  id: Scope;
  icon: typeof Building2;
  title: string;
  description: string;
}[] = [
  {
    id: "enterprise",
    icon: Building2,
    title: "Full enterprise solution",
    description:
      "For companies needing a full strategy-to-execution system. Break down org and team strategy, create teams, and use AI to keep execution aligned.",
  },
  {
    id: "team",
    icon: Users2,
    title: "Execution proof with team",
    description:
      "Ideal for testing concept with one team before company-wide rollout. Includes team-level strategy breakdown, AI insights, and a focused workspace for validation.",
  },
];

export function ScopeStep({ data, update, onNext, onBack }: StepProps) {
  const [loadingDemo, setLoadingDemo] = useState(false);

  function exploreSample() {
    setLoadingDemo(true);
    setTimeout(() => {
      setLoadingDemo(false);
      onNext();
    }, 1800);
  }

  return (
    <div className="flex flex-col gap-10">
      <OnboardingFormHeader
        title="How would you like to experience PadiworksAI?"
        description="You choose the scope, we'd setup the execution graph."
      />

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {scopes.map((scope) => {
            const Icon = scope.icon;
            const selected = data.scope === scope.id;
            return (
              <button
                key={scope.id}
                type="button"
                onClick={() => update({ scope: scope.id })}
                className={cn(
                  "flex flex-col overflow-hidden rounded-2xl p-1 text-left transition-colors",
                  selected
                    ? "border-2 border-[#4c2c97] bg-gradient-to-r from-[#4c2c97]/5 via-[#6941c6]/5 to-[#3b82f6]/5"
                    : "border border-transparent bg-brand-grey-50"
                )}
              >
                <div
                  className={cn(
                    "flex items-start justify-between rounded-xl border p-5",
                    selected
                      ? "border-[#4c2c97] bg-gradient-to-br from-[#96e3fd]/20 via-[#b093f4]/20 to-[#7f58da]/20"
                      : "border-brand-grey-100 bg-white"
                  )}
                >
                  <div className="flex flex-col items-start gap-4">
                    <div
                      className={cn(
                        "flex size-12 items-center justify-center rounded-full",
                        selected
                          ? "bg-gradient-to-b from-[#96e3fd] to-[#7f58da] text-white"
                          : "bg-brand-grey-50 text-brand-grey-400"
                      )}
                    >
                      <Icon className="size-6" />
                    </div>
                    <div className="flex flex-col items-start gap-2">
                      <p
                        className={cn(
                          "text-sm font-semibold",
                          selected ? "text-[#603bb4]" : "text-brand-grey-600"
                        )}
                      >
                        {scope.title}
                      </p>
                    </div>
                  </div>
                  {selected && (
                    <div className="flex size-6 items-center justify-center rounded-full bg-brand-purple-500">
                      <Check className="size-4 text-white" />
                    </div>
                  )}
                </div>
                <p
                  className={cn(
                    "p-5 text-sm",
                    selected ? "text-brand-grey-700" : "text-brand-grey-500"
                  )}
                >
                  {scope.description}
                </p>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-5 py-1">
          <div className="h-px flex-1 bg-brand-grey-200" />
          <span className="text-sm text-brand-grey-400">Or</span>
          <div className="h-px flex-1 bg-brand-grey-200" />
        </div>

        <button
          type="button"
          onClick={exploreSample}
          className="flex items-center justify-between rounded-full border border-brand-grey-100 px-5 py-3 text-left hover:border-brand-grey-200"
        >
          <div className="flex items-center gap-4">
            <div className="flex size-8 items-center justify-center rounded-full bg-brand-purple-50">
              <Play className="size-5 text-brand-purple-500" />
            </div>
            <span className="text-sm font-medium text-brand-grey-600">
              Explore with a sample company
            </span>
            <span className="rounded bg-brand-grey-100 px-2 py-0.5 text-xs font-medium text-brand-grey-700 mix-blend-multiply">
              Demo
            </span>
          </div>
          <ArrowRight className="size-5 text-brand-grey-400" />
        </button>
      </div>

      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          className="h-14 gap-3 bg-[#f7f9fc] px-6 text-base text-brand-grey-600 hover:bg-[#f0f2f5]"
        >
          <ArrowLeft className="size-5" />
          Back
        </Button>
        <Button
          disabled={!data.scope}
          onClick={onNext}
          className="h-14 gap-3 bg-[#29084d] px-6 text-base hover:bg-[#29084d]/90"
        >
          Continue
          <ArrowRight className="size-5" />
        </Button>
      </div>

      <Dialog open={loadingDemo}>
        <DialogContent showCloseButton={false} className="flex max-w-[480px] flex-col items-center gap-6 py-16 text-center">
          <Loader2 className="size-8 animate-spin text-brand-purple-500" />
          <p className="text-sm font-medium text-brand-grey-700">
            Setting up your demo workspace...
          </p>
          <Button type="button" variant="outline" onClick={() => setLoadingDemo(false)}>
            Cancel
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
