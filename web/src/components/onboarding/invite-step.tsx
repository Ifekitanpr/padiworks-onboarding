"use client";

import { useState } from "react";
import { Mail, Plus, Send, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { StepProps } from "./types";
import { OnboardingFormHeader, OnboardingFooter } from "./onboarding-shell";

const roles = ["Admin", "Manager", "Contributor"];

export function InviteStep({ data, update, onNext, onBack }: StepProps) {
  const [email,setEmail]=useState("");
  const [role,setRole]=useState("Contributor");

  function sendInvite(){if(!/^\S+@\S+\.\S+$/.test(email))return;update({invites:[...data.invites.filter(item=>item.email),{email,role}]});setEmail("");}

  function removeRow(index: number) {
    update({ invites: data.invites.filter((_, i) => i !== index) });
  }

  const goalTitle =
    data.goal === "other" && data.otherGoal
      ? data.otherGoal
      : "our team is focused on the right priorities";

  return (
    <div className="flex flex-col gap-8">
      <OnboardingFormHeader
        title="Invite teammates to your workspace"
        description={`They'll co-own the execution graph for "${goalTitle}" — check-ins, evidence, and status roll up to everyone.`}
      />

      <div className="rounded-xl bg-brand-grey-100 p-4">
        <p className="mb-2 text-xs text-brand-grey-600">Add contributor emails</p>
        <div className="flex items-center gap-2"><div className="relative flex-1"><Mail className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-brand-grey-600"/><Input type="email" placeholder="john@company.com" className="h-[52px] bg-white pl-11" value={email} onChange={(e)=>setEmail(e.target.value)} onKeyDown={(e)=>{if(e.key==="Enter"){e.preventDefault();sendInvite()}}}/></div><Select value={role} onValueChange={(value)=>setRole(value??"Contributor")}>
              <SelectTrigger className="h-[52px] w-40 bg-white">
                <SelectValue placeholder="Contributor" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="button" onClick={sendInvite} disabled={!/^\S+@\S+\.\S+$/.test(email)} className="h-[52px] gap-2 px-6"><Plus className="size-4"/>Send</Button>
          </div>
        <div className="mt-3 min-h-16 rounded-xl border border-dashed border-brand-grey-300 bg-white/60 p-3">{data.invites.filter(item=>item.email).length===0?<p className="py-3 text-center text-xs text-brand-grey-500">No invites yet. You can also invite people later from Settings...</p>:data.invites.filter(item=>item.email).map((invite,index)=><div key={invite.email} className="flex items-center gap-3 border-b border-brand-grey-200 py-2 last:border-0"><span className="flex size-8 items-center justify-center rounded-full bg-brand-purple-50"><Mail className="size-4 text-brand-purple-500"/></span><div className="flex-1"><strong className="block text-xs">{invite.email}</strong><span className="text-[11px] text-brand-grey-500">{invite.role} · Invite ready</span></div><button onClick={()=>removeRow(index)} className="text-brand-grey-400"><Trash2 className="size-4"/></button></div>)}</div>
      </div>

      <OnboardingFooter onBack={onBack}>
        <Button onClick={onNext} className="h-14 px-10 text-base">
          Continue <Send className="size-4"/>
        </Button>
      </OnboardingFooter>
    </div>
  );
}
