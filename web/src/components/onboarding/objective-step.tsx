"use client";

import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel } from "@/components/ui/field";
import type { StepProps } from "./types";
import { OnboardingFormHeader, OnboardingFooter } from "./onboarding-shell";

const prompts = [
  "What is the biggest outcome you want to achieve in the next one year?",
  "What do you need to do to get you closest to this outcome?",
];

const suggestions = [
  ["Double enterprise ARR while keeping retention above 90%", "Enter two new markets with repeatable acquisition"],
  ["Achieve category leadership before Q3", "Launch the execution intelligence product line"],
];

export function ObjectiveStep({ data, update, onNext, onBack }: StepProps) {
  function setAnswer(index: number, value: string) {
    const next = [...data.objectiveAnswers];
    next[index] = value;
    update({ objectiveAnswers: next });
  }

  const canContinue = data.objectiveAnswers.every((a) => a.trim().length > 0);

  return (
    <div className="flex flex-col gap-8">
      <OnboardingFormHeader
        title="Let's shape your first strategic objective"
        description="Answer each question — PadiworksAI has drafted suggestions from your business context. Pick one, edit it, or write your own."
      />

      <div className="flex flex-col gap-6">
        {prompts.map((prompt, index) => (
          <Field key={prompt}>
            <FieldLabel htmlFor={`objective-${index}`}>{prompt}</FieldLabel>
            <Textarea
              id={`objective-${index}`}
              rows={3}
              value={data.objectiveAnswers[index]}
              onChange={(e) => setAnswer(index, e.target.value)}
              placeholder="Type your answer, or generate one with AI"
            />
            <div className="grid grid-cols-2 gap-2">{suggestions[index].map(suggestion=><button type="button" key={suggestion} onClick={()=>setAnswer(index,suggestion)} className="flex min-w-0 items-center gap-2 rounded-full bg-brand-grey-100 px-3 py-2 text-left text-xs text-brand-grey-600"><Sparkles className="size-3.5 shrink-0 text-brand-purple-500"/><span className="truncate">{suggestion}</span></button>)}</div>
          </Field>
        ))}
        <Field><FieldLabel>How often would you like to re-align your organization&apos;s strategic priorities?</FieldLabel><div className="grid grid-cols-4 gap-2">{["Every year","Every 3 years","Every 5 years","Every 10 years"].map(cycle=><button key={cycle} type="button" onClick={()=>update({alignmentCycle:cycle})} className={`flex items-center gap-2 rounded-xl border px-3 py-3 text-xs ${data.alignmentCycle===cycle?"border-brand-purple-500 bg-brand-purple-50 text-brand-purple-500":"border-transparent bg-brand-grey-100 text-brand-grey-600"}`}><i className={`size-3 rounded-full border ${data.alignmentCycle===cycle?"border-[3px] border-brand-purple-500":"border-brand-grey-300"}`}/>{cycle}</button>)}</div></Field>
      </div>

      <OnboardingFooter onBack={onBack}>
        <Button disabled={!canContinue} onClick={onNext} className="h-14 px-10 text-base">
          Continue
        </Button>
      </OnboardingFooter>
    </div>
  );
}
