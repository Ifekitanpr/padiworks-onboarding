"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const goals = [
  [
    "/assets/onboarding-target-04.svg",
    "Our OKRs align to strategy & work tasks",
    "Prove daily tasks connect to strategic priorities.",
  ],
  [
    "/assets/onboarding-scales-02.svg",
    "Our managers can do fair appraisals",
    "Turn check-ins and feedback into appraisal signal.",
  ],
  [
    "/assets/onboarding-target-02.svg",
    "Our team is focused on the right priorities",
    "Surface drift and refocus one team.",
  ],
  ["/assets/onboarding-edit-04.svg", "I want to achieve ...", ""],
];
export default function GoalsPage() {
  const [selected, setSelected] = useState<number | null>(null);
  const r = useRouter();
  const visual = (selected === null ? "default" : ["strategy", "appraisals", "alignment", "custom"][selected]) as "default" | "strategy" | "appraisals" | "alignment" | "custom";
  const headingMap: Record<typeof visual, [string, string]> = {
    default: ["Now that we’re here", "Tell us, what brings you here? 😀"],
    strategy: ["Yes, we can help you!", "Create a clear line of sight from strategic priorities to team execution"],
    appraisals: ["Evidence should be visible", "Your team’s work, behavior and competency should all count!"],
    alignment: ["Keep your team aligned", "We identify priority mismatches and provide you with actionable options."],
    custom: ["Now that we’re here", "Tell us, what brings you here? 😀"],
  };
  const headings = headingMap[visual];
  return (
    <main className="goals-shell">
      <aside className={`goals-art goals-art--${visual}`}>
        <div className="goals-panel-glass" aria-hidden="true"><i/><i/><i/><i/></div>
        <header>
          <img src="/assets/auth/logo-white.svg" alt="Padiworks" />
          <button className="help-link">
            <img src="/assets/auth/help-circle.svg" alt="" />
            Use help
          </button>
        </header>
        <div>
          <h2><span>{headings[0]}</span>{headings[1]}</h2>
          {(visual === "default" || visual === "custom") && <div className={`goals-cloud goals-cloud--figma goals-cloud--${visual}`} aria-hidden="true">
            <span className="goals-cloud__ghost goals-cloud__ghost--top">OKR Alignment</span>
            <span className="goals-cloud__ghost goals-cloud__ghost--middle">OKR Alignment</span>
            <span className="goals-cloud__ghost goals-cloud__ghost--bottom">OKR Alignment</span>
            <span className="goals-cloud__chip goals-cloud__chip--strategy">Strategy Execution</span>
            <span className="goals-cloud__chip goals-cloud__chip--okr">OKR Alignment</span>
            <span className="goals-cloud__chip goals-cloud__chip--evidence">Performance Evidence</span>
            <span className="goals-cloud__person goals-cloud__person--top"><img src={visual === "custom" ? "/assets/figma-goals/custom-right.png" : "/assets/figma-goals/default-top.png"} alt="" /></span>
            <span className="goals-cloud__person goals-cloud__person--right"><img src={visual === "custom" ? "/assets/figma-goals/custom-left.png" : "/assets/figma-goals/default-right.png"} alt="" /></span>
            <span className="goals-cloud__person goals-cloud__person--left"><img src={visual === "custom" ? "/assets/figma-goals/custom-top.png" : "/assets/figma-goals/default-left.png"} alt="" /></span>
            <img className="goals-cloud__arrow goals-cloud__arrow--top" src="/assets/onboarding-goals-arrow-top.svg" alt="" />
            <img className="goals-cloud__arrow goals-cloud__arrow--right" src="/assets/onboarding-goals-arrow-right.svg" alt="" />
            <img className="goals-cloud__arrow goals-cloud__arrow--left" src="/assets/onboarding-goals-arrow-left.svg" alt="" />
          </div>}
          {visual === "strategy" && <div className="goal-visual goal-visual--strategy" aria-hidden="true"><img className="goal-connector goal-connector--strategy-left" src="/assets/figma-goals/strategy-connector-left.svg" alt=""/><img className="goal-connector goal-connector--strategy-right" src="/assets/figma-goals/strategy-connector-right.svg" alt=""/><i className="goal-visual__strategy"/><i className="goal-visual__tasks"/><b>Daily Tasks</b><span className="goal-visual__person goal-visual__person--top"><img src="/assets/figma-goals/strategy-top.png" alt=""/></span><span className="goal-visual__person goal-visual__person--right"><img src="/assets/figma-goals/strategy-right.png" alt=""/></span><img className="goal-visual__arrow goal-visual__arrow--top" src="/assets/onboarding-goals-arrow-top.svg" alt=""/><img className="goal-visual__arrow goal-visual__arrow--right" src="/assets/onboarding-goals-arrow-right.svg" alt=""/></div>}
          {visual === "appraisals" && <div className="goal-visual goal-visual--appraisals" aria-hidden="true"><img className="goal-connector goal-connector--appraisal-left" src="/assets/figma-goals/appraisal-connector-left.svg" alt=""/><img className="goal-connector goal-connector--appraisal-right" src="/assets/figma-goals/appraisal-connector-right.svg" alt=""/><i className="goal-visual__appraisal"/><i className="goal-visual__checkins"/><i className="goal-visual__feedback"/><span className="goal-visual__appraisal-person goal-visual__appraisal-person--one"><img src="/assets/figma-goals/appraisal-person-1.png" alt=""/></span><span className="goal-visual__appraisal-person goal-visual__appraisal-person--two"><img src="/assets/figma-goals/appraisal-person-2.png" alt=""/></span></div>}
          {visual === "alignment" && <div className="goal-visual goal-visual--alignment" aria-hidden="true"><i className="goal-visual__alignment-main"/><i className="goal-visual__alignment-score"/><i className="goal-visual__alignment-ai"/><span className="goal-visual__alignment-person goal-visual__alignment-person--one"><img src="/assets/figma-goals/alignment-person-1.png" alt=""/></span><span className="goal-visual__alignment-person goal-visual__alignment-person--two"><img src="/assets/figma-goals/alignment-person-2.png" alt=""/></span><img className="goal-visual__alignment-arrow" src="/assets/onboarding-goals-arrow-right.svg" alt=""/></div>}
        </div>
      </aside>
      <section className="goals-content">
        <div className="goals-progress">
          <b />
          <b />
          <i />
          <i />
          <i />
        </div>
        <div className="goals-form">
          <header>
            <h1>What do you aim to achieve with PadiworksAI?</h1>
            <p>
              Choose the top goal your team hopes to accomplish with Padiworks.
            </p>
          </header>
          <div className="goal-list">
            {goals.map(([icon, title, copy], index) => (
              <button
                key={title}
                className={
                  selected === index ? `goal-card is-active goal-card--selected-${index}` : "goal-card"
                }
                onClick={() => setSelected(index)}
                aria-pressed={selected === index}
              >
                <i><img src={icon} alt="" /></i>
                <span>
                  {index === 3 ? (
                    <small className="goal-card__custom-copy">
                      {selected === 3 ? "I want to achieve ..." : "Other Reasons? Tell us what brings you here"}
                    </small>
                  ) : (
                    <><strong>{title}</strong>{copy && <small>{copy}</small>}</>
                  )}
                </span>
              </button>
            ))}
          </div>
          <button
            className="experience-continue"
            disabled={selected === null}
            onClick={() => r.push("/onboarding/company")}
          >
            Continue <span>→</span>
          </button>
        </div>
      </section>
    </main>
  );
}
