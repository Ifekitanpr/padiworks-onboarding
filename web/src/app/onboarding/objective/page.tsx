"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "./objective.css";

const prompts = [
  ["What is the biggest outcome you want to achieve in the next one year?", "Double enterprise ARR while keeping gross margin ≥ 70%", "Enter two new markets with repeatable GTM strategy"],
  ["What do you need to do to get you closest to this outcome?", "Achieve unicorn status before Q3", "Achieve unicorn status before Q3"],
];

export default function ObjectivePage() {
  const [cadence, setCadence] = useState("Every year");
  const [answers, setAnswers] = useState(["", ""]);
  const router = useRouter();
  return <main className="company-shell objective-shell">
    <aside className="goals-art company-art"><header><img src="/assets/auth/logo-white.svg" alt="Padiworks" /><button className="help-link"><img src="/assets/auth/help-circle.svg" alt="" />Use help</button></header><div className="company-art__content objective-art__content"><h2><span>Now that we’re here</span>Tell us, what brings you here? 😀</h2><div className="objective-art" aria-hidden="true"><i /><span className="objective-person objective-person--top"><img src="/assets/figma-onboarding/objective-person-top.jpg" alt="" /></span><span className="objective-person objective-person--left"><img src="/assets/figma-onboarding/objective-person-left.jpg" alt="" /></span><span className="objective-person objective-person--right"><img src="/assets/figma-onboarding/objective-person-right.jpg" alt="" /></span><img className="objective-arrow objective-arrow--top" src="/assets/onboarding-goals-arrow-top.svg" alt="" /><img className="objective-arrow objective-arrow--left" src="/assets/onboarding-goals-arrow-left.svg" alt="" /><img className="objective-arrow objective-arrow--right" src="/assets/onboarding-goals-arrow-right.svg" alt="" /></div></div></aside>
    <section className="company-content"><div className="goals-progress"><b /><b /><b /><b /><i /></div><form className="objective-form" onSubmit={(event) => event.preventDefault()}><header><h1>Let&apos;s shape your first strategic objective</h1><p>Answer each question — PadiworksAI has drafted suggestions from your business context. Pick one, edit it, or write your own.</p></header><div className="objective-fields">{prompts.map(([label, first, second], promptIndex) => <label key={label}>{label}<textarea value={answers[promptIndex]} onChange={event => setAnswers(current => current.map((answer,index) => index === promptIndex ? event.target.value : answer))} placeholder="Anything else PadiworksAI should know — recent pivots, top constraints, upcoming initiatives..." /><span className="objective-suggestions">{[first,second].map((suggestion,index) => <button type="button" key={`${suggestion}-${index}`} title={suggestion} onClick={() => setAnswers(current => current.map((answer,answerIndex) => answerIndex === promptIndex ? suggestion : answer))}><b>✧</b><span>{suggestion}</span></button>)}</span></label>)}<fieldset><legend>How often would you like to re-align your organization&apos;s strategic priorities?</legend><div>{["Every year", "Every 3 years", "Every 5 years", "Every 10 years"].map(item => <button type="button" key={item} className={cadence === item ? "is-active" : ""} onClick={() => setCadence(item)}><i />{item}</button>)}</div></fieldset></div><footer><button type="button" className="experience-back" onClick={() => history.back()}>← <span>Back</span></button><button className="experience-continue" onClick={() => router.push("/onboarding/invite")}>Continue <span>→</span></button></footer></form></section>
  </main>;
}
