"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

import { AuthShell } from "@/components/auth/auth-shell";
import { AuthFormHeader } from "@/components/auth/auth-form-header";
import { Button } from "@/components/ui/button";
import { GoalStep } from "@/components/onboarding/goal-step";
import { ScopeStep } from "@/components/onboarding/scope-step";
import { OrgDetailsStep } from "@/components/onboarding/org-details-step";
import { BusinessIntelStep } from "@/components/onboarding/business-intel-step";
import { ObjectiveStep } from "@/components/onboarding/objective-step";
import { InviteStep } from "@/components/onboarding/invite-step";
import {
  initialOnboardingData,
  type OnboardingData,
} from "@/components/onboarding/types";
import {
  GoalPillsCollage,
  ScopePillsCollage,
  TeamScopeCollage,
  OrgDetailsCollage,
  BusinessIntelCollage,
  ObjectiveCollage,
  InviteCollage,
} from "@/components/auth/collages";

const steps = [
  {
    key: "goal",
    panel: {
      headline: "Now that we're here",
      description: "Tell us, what brings you here? 😀",
      collage: <GoalPillsCollage />,
    },
  },
  {
    key: "scope",
    panel: {
      headline: "You can start small",
      description: "Attain execution efficiency even at your smallest unit",
      collage: <ScopePillsCollage />,
    },
  },
  {
    key: "org-details",
    panel: {
      headline: "Now that we're here",
      description: "Tell us, what brings you here? 😀",
      collage: <OrgDetailsCollage />,
    },
  },
  {
    key: "business-intel",
    panel: {
      headline: "Now that we're here",
      description: "Tell us, what brings you here? 😀",
      collage: <BusinessIntelCollage />,
    },
  },
  {
    key: "objective",
    panel: {
      headline: "Now that we're here",
      description: "Tell us, what brings you here? 😀",
      collage: <ObjectiveCollage />,
    },
  },
  {
    key: "invite",
    panel: {
      headline: "Now that we're here",
      description: "Tell us, what brings you here? 😀",
      collage: <InviteCollage />,
    },
  },
] as const;

export default function OnboardingPage() {
  const [stepIndex, setStepIndex] = useState(0);
  const [data, setData] = useState<OnboardingData>(initialOnboardingData);
  const [complete, setComplete] = useState(false);

  function update(patch: Partial<OnboardingData>) {
    setData((prev) => ({ ...prev, ...patch }));
  }

  function onNext() {
    if (stepIndex === steps.length - 1) {
      // Stubbed: no backend wired up yet.
      console.log("onboarding complete", data);
      setComplete(true);
      return;
    }
    setStepIndex((i) => i + 1);
  }

  function onBack() {
    setStepIndex((i) => Math.max(0, i - 1));
  }

  if (complete) {
    return (
      <AuthShell
        panelHeadline="You're all set 🎉"
        panelDescription="Your execution graph is ready — let's put it to work."
      >
        <div className="flex flex-col items-center gap-6 text-center">
          <CheckCircle2 className="size-14 text-emerald-500" />
          <AuthFormHeader
            title="Workspace ready!"
            description="Your onboarding is complete. The next screens (dashboard, workbooks, etc.) haven't been designed in Figma yet, so this is where the flow ends for now."
          />
          <Button
            type="button"
            onClick={() => {
              setComplete(false);
              setStepIndex(0);
            }}
            className="h-14 w-full text-base"
          >
            Restart onboarding preview
          </Button>
        </div>
      </AuthShell>
    );
  }

  const current = steps[stepIndex];
  const panelCollage = current.key === "scope" && data.scope === "team"
    ? <TeamScopeCollage />
    : current.panel.collage;
  const stepProps = { data, update, onNext, onBack };

  return (
    <AuthShell
      panelHeadline={current.panel.headline}
      panelDescription={current.panel.description}
      panelCallout={null}
      panelCollage={panelCollage}
      contentMaxWidth="max-w-[600px]"
    >
      {current.key === "goal" && <GoalStep {...stepProps} />}
      {current.key === "scope" && <ScopeStep {...stepProps} />}
      {current.key === "org-details" && <OrgDetailsStep {...stepProps} />}
      {current.key === "business-intel" && <BusinessIntelStep {...stepProps} />}
      {current.key === "objective" && <ObjectiveStep {...stepProps} />}
      {current.key === "invite" && <InviteStep {...stepProps} />}
    </AuthShell>
  );
}
