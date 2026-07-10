"use client";

import { Target, Scale, Compass, PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { StepProps } from "./types";
import { OnboardingFormHeader, OnboardingFooter } from "./onboarding-shell";

const goals = [
  {
    id: "okr-alignment",
    icon: Target,
    title: "Our OKRs align to strategy & work tasks",
    description: "Prove daily tasks connect to strategic priorities.",
  },
  {
    id: "fair-appraisals",
    icon: Scale,
    title: "Our managers can do fair appraisals",
    description: "Turn check-ins and feedback into appraisal signal.",
  },
  {
    id: "right-priorities",
    icon: Compass,
    title: "Our team is focused on the right priorities",
    description: "Surface drift and refocus one team.",
  },
];

function OptionCard({
  selected,
  onClick,
  icon,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-4 rounded-2xl p-5 text-left transition-colors",
        selected
          ? "border-2 border-[#4c2c97] bg-gradient-to-r from-[#4c2c97]/5 via-[#6941c6]/5 to-[#3b82f6]/5"
          : "border border-transparent bg-brand-grey-50 hover:bg-[#f3f4f6]"
      )}
    >
      <div
        className={cn(
          "flex size-12 shrink-0 items-center justify-center rounded-full",
          selected
            ? "bg-gradient-to-b from-[#96e3fd]/40 to-[#7f58da]/40 text-white"
            : "bg-white text-brand-grey-400"
        )}
      >
        {icon}
      </div>
      {children}
    </button>
  );
}

export function GoalStep({ data, update, onNext, onBack }: StepProps) {
  const canContinue = data.goal === "other" ? data.otherGoal.trim().length > 0 : !!data.goal;

  return (
    <div className="flex flex-col gap-8">
      <OnboardingFormHeader
        title="What do you aim to achieve with PadiworksAI?"
        description="Choose the top goal your team hopes to accomplish with Padiworks."
      />

      <div className="flex flex-col gap-3">
        {goals.map((goal) => {
          const Icon = goal.icon;
          const selected = data.goal === goal.id;
          return (
            <OptionCard
              key={goal.id}
              selected={selected}
              onClick={() => update({ goal: goal.id })}
              icon={<Icon className="size-6" />}
            >
              <div className="flex flex-col gap-1">
                <p
                  className={cn(
                    "text-sm font-semibold",
                    selected ? "text-[#603bb4]" : "text-brand-grey-600"
                  )}
                >
                  {goal.title}
                </p>
                <p className="text-sm text-brand-grey-500">{goal.description}</p>
              </div>
            </OptionCard>
          );
        })}

        <OptionCard
          selected={data.goal === "other"}
          onClick={() => update({ goal: "other" })}
          icon={<PenLine className="size-6" />}
        >
          {data.goal === "other" ? (
            <Input
              autoFocus
              placeholder="I want to achieve ..."
              value={data.otherGoal}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => update({ otherGoal: e.target.value })}
              className="h-10 flex-1 border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
            />
          ) : (
            <p className="text-sm font-semibold text-brand-grey-400">
              Other reasons? Tell us what brings you here
            </p>
          )}
        </OptionCard>
      </div>

      <OnboardingFooter onBack={onBack}>
        <Button disabled={!canContinue} onClick={onNext} className="h-14 px-10 text-base">
          Continue
        </Button>
      </OnboardingFooter>
    </div>
  );
}
