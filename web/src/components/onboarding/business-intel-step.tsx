"use client";

import { useState } from "react";
import { UploadCloud, Info, FileText, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel } from "@/components/ui/field";
import type { StepProps } from "./types";
import { OnboardingFormHeader, OnboardingFooter } from "./onboarding-shell";

export function BusinessIntelStep({ data, update, onNext, onBack }: StepProps) {
  const [files, setFiles] = useState<string[]>([]);
  return (
    <div className="flex flex-col gap-8">
      <OnboardingFormHeader
        title="Business Intelligence Gathering"
        description="To pre-fill your strategy, I'll need some information about your business. Share what you feel comfortable with — all fields are optional, and I'll work with whatever you provide."
      />

      <div className="flex items-start gap-4 rounded-2xl bg-[#e7f2fd] p-4">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#b5d6fa]">
          <Info className="size-5 text-[#0f7aef]" />
        </span>
        <p className="text-sm leading-relaxed text-brand-grey-700">
          PadiworksAI leverages this information to draft your first execution
          graph (priorities, objectives, etc). We don&apos;t have access to
          your files — they stay private to your workspace and can be deleted
          anytime.
        </p>
      </div>

      <Field><FieldLabel htmlFor="businessUrl">Company website or Linkedin page URL (Optional)</FieldLabel><div className="flex"><span className="flex h-[52px] items-center rounded-l-lg border border-r-0 border-brand-grey-300 bg-brand-grey-100 px-4 text-sm text-brand-grey-400">https://</span><input id="businessUrl" value={data.businessUrl} onChange={(e)=>update({businessUrl:e.target.value})} placeholder="Enter a valid link" className="h-[52px] flex-1 rounded-r-lg border border-brand-grey-300 px-4 text-sm outline-none focus:border-brand-purple-500"/></div></Field>

      <Field>
        <FieldLabel>Upload a document (Optional)</FieldLabel>
        <label className="flex cursor-pointer items-center gap-4 rounded-xl border border-dashed border-brand-grey-300 px-5 py-4 hover:border-brand-purple-500">
          <input type="file" className="hidden" multiple accept=".pdf,.doc,.docx,.txt" onChange={(event)=>setFiles(Array.from(event.target.files ?? []).map(file=>file.name))}/>
          <span className="flex size-10 items-center justify-center rounded-full bg-brand-purple-50"><UploadCloud className="size-5 text-brand-purple-500" /></span>
          <div><p className="text-sm text-brand-grey-600">Upload strategy / business plan, recent OKR document,<br/>company handbook</p><p className="mt-1 text-xs text-brand-grey-400">Supported Format: PDF, DOCX, TXT (10mb max each)</p></div>
        </label>
        {files.length>0&&<div className="grid grid-cols-2 gap-2">{files.map(file=><div key={file} className="flex items-center gap-2 rounded-lg bg-brand-grey-100 p-3"><FileText className="size-4"/><span className="min-w-0 flex-1 truncate text-xs">{file}</span><button onClick={()=>setFiles(files.filter(item=>item!==file))}><X className="size-4"/></button></div>)}</div>}
      </Field>

      <Field>
        <FieldLabel htmlFor="businessContext">
          Additional context (Optional)
        </FieldLabel>
        <Textarea
          id="businessContext"
          rows={4}
          placeholder="Anything else PadiworksAI should know — recent pivots, top constraints, upcoming initiatives..."
          value={data.businessContext}
          onChange={(e) => update({ businessContext: e.target.value })}
        />
      </Field>

      <OnboardingFooter onBack={onBack}>
        <Button
          onClick={onNext}
          className="h-14 gap-3 bg-[#29084d] px-6 text-base hover:bg-[#29084d]/90"
        >
          Continue
          <ArrowRight className="size-5" />
        </Button>
      </OnboardingFooter>
    </div>
  );
}
