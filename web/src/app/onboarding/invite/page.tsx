"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "./invite.css";
import "./invite-overrides.css";

export default function InvitePage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [invites, setInvites] = useState<string[]>([]);
  const send = () => { if (email.trim()) { setInvites(current => [...current, email.trim()]); setEmail(""); } };
  return <main className="company-shell invite-shell">
    <aside className="goals-art company-art"><header><img src="/assets/auth/logo-white.svg" alt="Padiworks" /><button className="help-link"><img src="/assets/auth/help-circle.svg" alt="" />Use help</button></header><div className="company-art__content invite-art__content"><h2><span>Now that we’re here</span>Tell us, what brings you here? 😀</h2><div className="invite-art" aria-hidden="true"><div>{[1,2,3,4].map((person,index) => <span key={person} className={`invite-person invite-person--${index+1}`}><img src={`/assets/figma-onboarding/invite-person-${person}.jpg`} alt="" /></span>)}<span className="invite-add">＋</span></div><img src="/assets/onboarding-goals-arrow-right.svg" alt="" /><b>Add teammate</b></div></div></aside>
    <section className="company-content"><div className="goals-progress"><b /><b /><b /><b /><b /></div><form className="invite-form" onSubmit={(event) => { event.preventDefault(); router.push("/dashboard/strategy"); }}><header><h1>Invite teammates to your workspace</h1><p>They&apos;ll co-own the execution graph for &quot;Our team is focused on the right priorities&quot; — check-ins, evidence, and status roll up to everyone.</p></header><div className="invite-box"><label>Add contributor emails</label><div className="invite-controls"><span><b><img src="/assets/figma-controls/invite-mail.svg" alt="" /></b><input value={email} onChange={event => setEmail(event.target.value)} placeholder="john@company.com" /></span><span className="invite-role"><select defaultValue="Contributor"><option>Contributor</option><option>Admin</option></select><img src="/assets/figma-controls/invite-chevron.svg" alt="" /></span><button type="button" onClick={send}><img src="/assets/figma-controls/invite-send.svg" alt="" /><b>Send</b></button></div>{invites.length === 0 ? <div className="invite-empty">No invites yet. You can also invite people later from Settings.</div> : <div className="invite-list">{invites.map((item,index) => <div key={`${item}-${index}`}><i>{item[0]?.toUpperCase()}</i><span><strong>{item}</strong><small>Pending　•　Contributor</small></span><button type="button" onClick={() => setInvites(current => current.filter((_,i) => i !== index))}>⌫</button></div>)}</div>}</div><footer><button type="button" className="experience-back" onClick={() => history.back()}>← <span>Back</span></button><button type="submit" className="experience-continue">Continue <span>→</span></button></footer></form></section>
  </main>;
}
