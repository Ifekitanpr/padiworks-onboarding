"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CompanyPage() {
  const [company, setCompany] = useState("");
  const router = useRouter();

  return (
    <main className="company-shell">
      <aside className="goals-art company-art">
        <header>
          <img src="/assets/auth/logo-white.svg" alt="Padiworks" />
          <button className="help-link"><img src="/assets/auth/help-circle.svg" alt="" />Use help</button>
        </header>
        <div className="company-art__content">
          <h2><span>Now that we’re here</span>Tell us, what brings you here? 😀</h2>
          <div className="company-stack" aria-hidden="true">
            <div className="company-stack__portrait" />
            <img className="company-stack__connector" src="/assets/figma-onboarding/company-connector.svg" alt="" />
            <img className="company-stack__row company-stack__row--industry" src="/assets/figma-onboarding/company-card-industry.png" alt="" />
            <img className="company-stack__row company-stack__row--size" src="/assets/figma-onboarding/company-card-size.png" alt="" />
            <img className="company-stack__row company-stack__row--website" src="/assets/figma-onboarding/company-card-website.png" alt="" />
          </div>
        </div>
      </aside>
      <section className="company-content">
        <div className="goals-progress"><b /><b /><b /><i /><i /></div>
        <form className="company-form" onSubmit={(event) => event.preventDefault()}>
          <header>
            <h1>Tell us a little about you and your organization</h1>
            <p>These details anchor your execution graph. All fields are required.</p>
          </header>
          <div className="company-fields">
            <div className="company-grid">
              <label>Company name<input value={company} onChange={(event) => setCompany(event.target.value)} placeholder="e.g John" /></label>
              <label>Your role/title<input placeholder="e.g. Doe" /></label>
            </div>
            <div className="company-grid">
              <label>Company industry<select defaultValue=""><option value="" disabled>Select your industry</option><option>Technology and software</option><option>Financial services</option><option>Professional services</option><option>Healthcare</option><option>Education</option><option>Retail and e-commerce</option><option>Manufacturing</option><option>Media and entertainment</option><option>Real estate</option><option>Non-profit</option><option>Other</option></select></label>
              <label>Company size<select defaultValue=""><option value="" disabled>Select an option</option><option>1–10</option><option>11–50</option><option>51–200</option></select></label>
            </div>
            <label>Company website or Linkedin page URL<span className="url-input"><b>https://</b><input placeholder="Enter a valid link" /></span></label>
          </div>
          <footer>
            <button type="button" className="experience-back" onClick={() => history.back()}>← <span>Back</span></button>
            <button className="experience-continue" disabled={!company} onClick={() => router.push("/onboarding/context")}>Continue <span>→</span></button>
          </footer>
        </form>
      </section>
    </main>
  );
}
