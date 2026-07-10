"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { StepProps } from "./types";
import { OnboardingFormHeader, OnboardingFooter } from "./onboarding-shell";

export function OrgDetailsStep({ data, update, onNext, onBack }: StepProps) {
  const canContinue =
    data.companyName.trim() &&
    data.industry.trim() &&
    data.companySize.trim() &&
    data.role.trim();

  return (
    <div className="flex flex-col gap-8">
      <OnboardingFormHeader
        title="Tell us a little about you and your organization"
        description="These details anchor your execution graph. All fields are required."
      />

      <FieldGroup>
        <div className="grid grid-cols-2 gap-5">
          <Field>
            <FieldLabel htmlFor="companyName">Company name</FieldLabel>
            <Input
              id="companyName"
              placeholder="e.g. Acme Corp"
              className="h-[52px]"
              value={data.companyName}
              onChange={(e) => update({ companyName: e.target.value })}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="role">Your role/title</FieldLabel>
            <Input
              id="role"
              placeholder="e.g. Head of Operations"
              className="h-[52px]"
              value={data.role}
              onChange={(e) => update({ role: e.target.value })}
            />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-5">
          <Field>
            <FieldLabel>Company industry</FieldLabel>
            <Select value={data.industry} onValueChange={(value) => update({industry:value ?? ""})}><SelectTrigger className="h-[52px] w-full"><SelectValue placeholder="Select an industry"/></SelectTrigger><SelectContent>{["Financial services","Technology","Professional services","Healthcare","Public sector","Other"].map(item=><SelectItem value={item} key={item}>{item}</SelectItem>)}</SelectContent></Select>
          </Field>
          <Field>
            <FieldLabel>Organization size</FieldLabel>
            <Select value={data.companySize} onValueChange={(value) => update({companySize:value ?? ""})}><SelectTrigger className="h-[52px] w-full"><SelectValue placeholder="Select an option"/></SelectTrigger><SelectContent>{["1–20","21–50","51–100","101–250","251–500","500+"].map(item=><SelectItem value={item} key={item}>{item} employees</SelectItem>)}</SelectContent></Select>
          </Field>
        </div>
        <Field><FieldLabel htmlFor="website">Company website or LinkedIn page URL</FieldLabel><div className="flex"><span className="flex h-[52px] items-center rounded-l-lg border border-r-0 border-brand-grey-300 bg-brand-grey-100 px-4 text-sm text-brand-grey-400">https://</span><Input id="website" placeholder="Enter a valid link" className="h-[52px] rounded-l-none" value={data.website} onChange={(e)=>update({website:e.target.value})}/></div></Field>
      </FieldGroup>

      <OnboardingFooter onBack={onBack}>
        <Button disabled={!canContinue} onClick={onNext} className="h-14 px-10 text-base">
          Continue
        </Button>
      </OnboardingFooter>
    </div>
  );
}
