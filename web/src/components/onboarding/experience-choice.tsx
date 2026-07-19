"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Experience = "enterprise" | "proof";

export function ExperienceChoice() {
  const [experience, setExperience] = useState<Experience>("enterprise");
  const [demoLoading, setDemoLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!demoLoading) return;

    const setupTimer = window.setTimeout(() => {
      window.sessionStorage.setItem("padiworks-workspace-mode", "demo");
      router.push("/dashboard/strategy");
    }, 1200);

    return () => window.clearTimeout(setupTimer);
  }, [demoLoading, router]);

  return (
    <main className="experience-shell">
      <section
        className="experience-art"
        aria-label="Padiworks onboarding artwork"
      >
        <div className="experience-art__glow" />
        <div className="experience-art__vector">
          <img src="/assets/auth/panel-vector.svg" alt="" />
        </div>
        <header className="experience-art__header">
          <img src="/assets/auth/logo-white.svg" alt="Padiworks" />
          <button type="button" className="help-link">
            <img src="/assets/auth/help-circle.svg" alt="" />
            Use help
          </button>
        </header>
        <div className={experience === "proof" ? "experience-art__copy experience-art__copy--proof" : "experience-art__copy"}>
          <h2>
            <span>You can start small</span>Attain execution efficiency even<br />at your smallest unit
          </h2>
          {experience === "proof" ? <div className="experience-proof-network" aria-hidden="true"><img className="proof-card" src="/assets/onboarding-proof-card.png" alt="" /><span className="proof-person proof-john">John</span><span className="proof-person proof-sarah">Sarah</span><span className="proof-person proof-you">You</span><img className="proof-arrow proof-arrow-john" src="/assets/onboarding-arrow-product.svg" alt="" /><img className="proof-arrow proof-arrow-sarah" src="/assets/auth/arrow-c.svg" alt="" /><img className="proof-arrow proof-arrow-you" src="/assets/onboarding-arrow-sales.svg" alt="" /></div> : <div className="experience-orbit" aria-hidden="true">
            <span className="orbit-ghost ghost-one">OKR Alignment</span>
            <span className="orbit-ghost ghost-two">OKR Alignment</span>
            <span className="orbit-ghost ghost-three">OKR Alignment</span>
            <span className="orbit-ghost ghost-four">OKR Alignment</span>
            <span className="orbit-pill orbit-product">Product</span>
            <span className="orbit-pill orbit-engineering">Engineering</span>
            <span className="orbit-pill orbit-sales">Sales</span>
            <span className="orbit-pill orbit-success">Customer Success</span>
            <img
              className="orbit-arrow orbit-arrow--product"
              src="/assets/onboarding-arrow-product.svg"
              alt=""
            />
            <img
              className="orbit-arrow orbit-arrow--engineering"
              src="/assets/onboarding-arrow-engineering.svg"
              alt=""
            />
            <img
              className="orbit-arrow orbit-arrow--sales"
              src="/assets/onboarding-arrow-sales.svg"
              alt=""
            />
            <img className="orbit-arrow orbit-arrow--customer" src="/assets/onboarding-arrow-customer.svg" alt="" />
            <div className="orbit-company">
              <b>▥</b>
              <span>Acme Corp</span>
            </div>
          </div>}
        </div>
      </section>
      <section className="experience-content">
        <div
          className="experience-progress"
          aria-label="Onboarding step 1 of 5"
        >
          <b />
          <i />
          <i />
          <i />
          <i />
        </div>
        <div className="experience-form">
          <header>
            <h1>
              How would you like to experience
              <br />
              PadiworksAI?
            </h1>
            <p>You choose the scope, we’d setup the execution graph.</p>
          </header>
          <div className="experience-options">
            <ExperienceCard
              active={experience === "enterprise"}
              icon="▥"
              title="Full enterprise solution"
              copy="For companies needing a full strategy-to-execution system. Break down org and team strategy, create teams, and use AI to keep execution aligned."
              onClick={() => setExperience("enterprise")}
            />
            <ExperienceCard
              active={experience === "proof"}
              icon="♧"
              title="Execution proof with team"
              copy="Ideal for testing concept with one team before company-wide rollout. Includes team-level strategy breakdown, AI insights, and a focused workspace for validation."
              onClick={() => setExperience("proof")}
            />
          </div>
          <div className="sample-company">
            <div>
              <strong>Explore with a sample company</strong>
              <ul>
                <li>Prebuilt fictional workspace</li>
                <li>Click through strategy → work → evidence</li>
                <li>Zero risk, nothing to upload, Free!</li>
              </ul>
            </div>
            <button
              className="sample-demo"
              type="button"
              onClick={() => setDemoLoading(true)}
            >
              Try Demo <span>→</span>
            </button>
          </div>
        </div>
        <footer className="experience-footer">
          <button
            className="experience-back"
            type="button"
            onClick={() => window.history.back()}
          >
            ← <span>Back</span>
          </button>
          <button className="experience-continue" type="button" onClick={() => router.push("/onboarding/goals")}>
            Continue <span>→</span>
          </button>
        </footer>
      </section>
      {demoLoading && <DemoLoading onCancel={() => setDemoLoading(false)} />}
    </main>
  );
}

function DemoLoading({ onCancel }: { onCancel: () => void }) {
  return (
    <div
      className="demo-loading-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="demo-loading-title"
    >
      <div className="demo-loading-card">
        <span className="demo-spinner" aria-hidden="true" />
        <strong id="demo-loading-title">
          Setting up your demo workspace...
        </strong>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}

function ExperienceCard({
  active,
  icon,
  title,
  copy,
  onClick,
}: {
  active: boolean;
  icon: string;
  title: string;
  copy: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={active ? "experience-card is-active" : "experience-card"}
      onClick={onClick}
      aria-pressed={active}
    >
      <span className="experience-card__top">
        <i>{icon}</i>
        {active && <b>✓</b>}
        <strong>{title}</strong>
      </span>
      <span className="experience-card__copy">{copy}</span>
    </button>
  );
}
