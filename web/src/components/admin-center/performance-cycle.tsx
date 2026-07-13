"use client";

import { useState } from "react";
import { Info, Lock, Plus, Trash2 } from "lucide-react";
import type { AdminSectionProps } from "./types";

type CycleTab = "Appraisal" | "360" | "Check-ins" | "Surveys";

const cycleTabs: CycleTab[] = ["Appraisal", "360", "Check-ins", "Surveys"];

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

type ScoreWeights = { objectives: number; behaviour: number; competency: number };

type Band = { id: string; label: string; color: string; min: number; max: number | null };

const initialBands: Band[] = [
  { id: "outstanding", label: "Outstanding", color: "#15803d", min: 90, max: 100 },
  { id: "strong", label: "Strong", color: "#1d4ed8", min: 80, max: 89 },
  { id: "meets", label: "Meets", color: "#6941c6", min: 70, max: 79 },
  { id: "development", label: "Development Needed", color: "#b45309", min: 60, max: 69 },
  { id: "concern", label: "Concern", color: "#d92d20", min: 0, max: 59 },
];

type RaterWeights = { manager: number; sameTeam: number; crossFunctional: number; subordinates: number };

type CheckinType = {
  id: string;
  label: string;
  description: string;
  frequency: "Weekly" | "Biweekly" | "Monthly";
};

const initialCheckinTypes: CheckinType[] = [
  { id: "okr", label: "OKR / Operational Objectives", description: "Progress updates against quarterly OKRs and day-to-day operational targets.", frequency: "Biweekly" },
  { id: "performance", label: "Performance", description: "Manager-employee check-in on overall performance since the last appraisal cycle.", frequency: "Monthly" },
  { id: "sprint", label: "Sprint / Project", description: "Delivery-focused check-ins tied to active sprints or project milestones.", frequency: "Weekly" },
  { id: "probation", label: "Probation / Onboarding", description: "Structured check-ins during a new hire's probation or onboarding period.", frequency: "Biweekly" },
];

type SurveyQuestion = { id: string; text: string };

const initialQuestions: SurveyQuestion[] = [
  { id: "q1", text: "How likely are you to recommend this company as a great place to work? (0-10)" },
  { id: "q2", text: "I feel my manager genuinely cares about my wellbeing." },
  { id: "q3", text: "I have the tools and resources I need to do my job well." },
  { id: "q4", text: "I see a clear path for my growth here over the next 12 months." },
];

let questionCounter = initialQuestions.length;

export function PerformanceCycle({ showToast }: AdminSectionProps) {
  const [tab, setTab] = useState<CycleTab>("Appraisal");

  // --- Tab 1: Appraisal settings & cycle ---
  const [weights, setWeights] = useState<ScoreWeights>({ objectives: 50, behaviour: 25, competency: 25 });
  const weightTotal = weights.objectives + weights.behaviour + weights.competency;
  const [bands, setBands] = useState<Band[]>(initialBands);
  const [biasThreshold, setBiasThreshold] = useState(15);
  const [cadence, setCadence] = useState<"Quarterly" | "Bi-Annual" | "Annual">("Quarterly");
  const [startMonth, setStartMonth] = useState("January");

  const updateWeight = (key: keyof ScoreWeights, value: number) => {
    setWeights((current) => ({ ...current, [key]: value }));
  };

  const updateBand = (id: string, field: "min" | "max", value: number) => {
    setBands((current) => current.map((band) => (band.id === id ? { ...band, [field]: value } : band)));
  };

  const saveAppraisal = () => {
    showToast("Appraisal settings & cycle saved");
  };

  // --- Tab 2: 360 setup ---
  const [raterWeights, setRaterWeights] = useState<RaterWeights>({ manager: 40, sameTeam: 30, crossFunctional: 20, subordinates: 10 });
  const raterTotal = raterWeights.manager + raterWeights.sameTeam + raterWeights.crossFunctional + raterWeights.subordinates;
  const [feedbackWindow, setFeedbackWindow] = useState(14);
  const [minRaters, setMinRaters] = useState(3);
  const [maxRaters, setMaxRaters] = useState(8);

  const updateRaterWeight = (key: keyof RaterWeights, value: number) => {
    setRaterWeights((current) => ({ ...current, [key]: value }));
  };

  const save360 = () => {
    showToast("360 setup saved");
  };

  // --- Tab 3: Check-ins setup ---
  const [checkinTypes, setCheckinTypes] = useState<CheckinType[]>(initialCheckinTypes);

  const updateFrequency = (id: string, frequency: CheckinType["frequency"]) => {
    setCheckinTypes((current) => current.map((item) => (item.id === id ? { ...item, frequency } : item)));
  };

  const saveCheckins = () => {
    showToast("Check-ins setup saved");
  };

  // --- Tab 4: Survey setups ---
  const [questions, setQuestions] = useState<SurveyQuestion[]>(initialQuestions);

  const addQuestion = () => {
    if (questions.length >= 30) return;
    questionCounter += 1;
    setQuestions((current) => [...current, { id: `q${questionCounter}`, text: "" }]);
  };

  const removeQuestion = (id: string) => {
    setQuestions((current) => current.filter((question) => question.id !== id));
  };

  const updateQuestion = (id: string, text: string) => {
    setQuestions((current) => current.map((question) => (question.id === id ? { ...question, text } : question)));
  };

  const saveSurveys = () => {
    showToast("Survey setup saved");
  };

  return (
    <>
      <div className="admin-header">
        <h2>Performance Cycle Configuration</h2>
        <p>Controls how the appraisal cycle, 360 feedback, check-ins, and surveys run org-wide.</p>
      </div>

      <div className="view-tabs">
        {cycleTabs.map((item) => (
          <button key={item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}>
            {item === "360" ? "360 Setup" : item === "Appraisal" ? "Appraisal Settings & Cycle" : item}
          </button>
        ))}
      </div>

      {tab === "Appraisal" && (
        <>
          <div className="settings-card">
            <h3>Composite scoring weights</h3>
            <div className="weight-row">
              <span className="weight-row-label">Objectives</span>
              <input
                type="range"
                min={0}
                max={100}
                value={weights.objectives}
                onChange={(event) => updateWeight("objectives", Number(event.target.value))}
              />
              <span className="weight-row-value">{weights.objectives}%</span>
            </div>
            <div className="weight-row">
              <span className="weight-row-label">Behaviour</span>
              <input
                type="range"
                min={0}
                max={100}
                value={weights.behaviour}
                onChange={(event) => updateWeight("behaviour", Number(event.target.value))}
              />
              <span className="weight-row-value">{weights.behaviour}%</span>
            </div>
            <div className="weight-row">
              <span className="weight-row-label">Competency</span>
              <input
                type="range"
                min={0}
                max={100}
                value={weights.competency}
                onChange={(event) => updateWeight("competency", Number(event.target.value))}
              />
              <span className="weight-row-value">{weights.competency}%</span>
            </div>
            <div className={weightTotal === 100 ? "weight-total" : "weight-total error"}>
              Total weight: {weightTotal}% {weightTotal === 100 ? "— balanced" : "— must equal 100% before saving"}
            </div>
          </div>

          <div className="settings-card">
            <h3>Performance bands</h3>
            <div className="data-table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Band</th>
                    <th>Min score</th>
                    <th>Max score</th>
                  </tr>
                </thead>
                <tbody>
                  {bands.map((band) => (
                    <tr key={band.id}>
                      <td>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                          <span style={{ width: 9, height: 9, borderRadius: "50%", background: band.color, display: "inline-block", flex: "none" }} />
                          {band.label}
                        </span>
                      </td>
                      <td>
                        <input
                          type="number"
                          className="text-input"
                          style={{ height: 32, width: 80, padding: "0 10px" }}
                          min={0}
                          max={100}
                          value={band.min}
                          onChange={(event) => updateBand(band.id, "min", Number(event.target.value))}
                        />
                      </td>
                      <td>
                        {band.max === null ? (
                          <span style={{ color: "var(--muted)" }}>—</span>
                        ) : (
                          <input
                            type="number"
                            className="text-input"
                            style={{ height: 32, width: 80, padding: "0 10px" }}
                            min={0}
                            max={100}
                            value={band.max}
                            onChange={(event) => updateBand(band.id, "max", Number(event.target.value))}
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="field-hint">These thresholds define how a final composite score maps to a performance rating shown across the platform.</p>
          </div>

          <div className="settings-card">
            <h3>Bias alert threshold</h3>
            <div className="field-group" style={{ marginBottom: 12 }}>
              <div className="field-label-row">
                <span className="field-label">Deviation threshold</span>
              </div>
              <input
                type="number"
                className="text-input"
                style={{ width: 140 }}
                min={0}
                max={100}
                value={biasThreshold}
                onChange={(event) => setBiasThreshold(Number(event.target.value))}
              />
              <p className="field-hint">
                Fires when a manager&apos;s manual score adjustment deviates more than {biasThreshold}% from the AI-computed evidence
                baseline. When triggered, the manager must write a justification of at least 100 characters before the score can be
                submitted.
              </p>
            </div>
            <div className="settings-row">
              <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <Lock size={13} /> Allow disabling this check
              </span>
              <label className="toggle-switch">
                <input type="checkbox" checked={false} disabled readOnly />
                <span className="toggle-track" />
              </label>
            </div>
            <div className="validation-banner" style={{ marginTop: 14, marginBottom: 0 }}>
              <Info size={15} style={{ flex: "none", marginTop: 1 }} />
              <span>
                This is a platform-integrity rule: only a Super Admin can disable the bias alert check. Managers and Directors cannot
                turn it off, even for their own teams.
              </span>
            </div>
          </div>

          <div className="settings-card">
            <h3>Cycle cadence</h3>
            <div className="inline-fields">
              <div className="field-group" style={{ marginBottom: 0 }}>
                <div className="field-label-row"><span className="field-label">Cadence</span></div>
                <select
                  className="select-input"
                  value={cadence}
                  onChange={(event) => setCadence(event.target.value as "Quarterly" | "Bi-Annual" | "Annual")}
                >
                  <option value="Quarterly">Quarterly</option>
                  <option value="Bi-Annual">Bi-Annual</option>
                  <option value="Annual">Annual</option>
                </select>
              </div>
              <div className="field-group" style={{ marginBottom: 0 }}>
                <div className="field-label-row"><span className="field-label">Cycle start month</span></div>
                <select className="select-input" value={startMonth} onChange={(event) => setStartMonth(event.target.value)}>
                  {months.map((month) => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <button className="btn-primary" disabled={weightTotal !== 100} onClick={saveAppraisal}>
            Save appraisal settings
          </button>
        </>
      )}

      {tab === "360" && (
        <>
          <div className="settings-card">
            <h3>Rater types & weights</h3>
            <div className="weight-row">
              <span className="weight-row-label">Self</span>
              <input type="range" min={0} max={0} value={0} disabled style={{ opacity: 0.4 }} />
              <span className="weight-row-value">0%</span>
            </div>
            <p className="field-hint" style={{ marginTop: -6, marginBottom: 10 }}>
              Self-assessment is reflection-only and never contributes to the composite 360 score.
            </p>
            <div className="weight-row">
              <span className="weight-row-label">Direct Manager</span>
              <input
                type="range"
                min={0}
                max={100}
                value={raterWeights.manager}
                onChange={(event) => updateRaterWeight("manager", Number(event.target.value))}
              />
              <span className="weight-row-value">{raterWeights.manager}%</span>
            </div>
            <div className="weight-row">
              <span className="weight-row-label">Same-Team Peers</span>
              <input
                type="range"
                min={0}
                max={100}
                value={raterWeights.sameTeam}
                onChange={(event) => updateRaterWeight("sameTeam", Number(event.target.value))}
              />
              <span className="weight-row-value">{raterWeights.sameTeam}%</span>
            </div>
            <div className="weight-row">
              <span className="weight-row-label">Cross-Functional Peers</span>
              <input
                type="range"
                min={0}
                max={100}
                value={raterWeights.crossFunctional}
                onChange={(event) => updateRaterWeight("crossFunctional", Number(event.target.value))}
              />
              <span className="weight-row-value">{raterWeights.crossFunctional}%</span>
            </div>
            <div className="weight-row">
              <span className="weight-row-label">Subordinates</span>
              <input
                type="range"
                min={0}
                max={100}
                value={raterWeights.subordinates}
                onChange={(event) => updateRaterWeight("subordinates", Number(event.target.value))}
              />
              <span className="weight-row-value">{raterWeights.subordinates}%</span>
            </div>
            <div className={raterTotal === 100 ? "weight-total" : "weight-total error"}>
              Total weight (excl. Self): {raterTotal}% {raterTotal === 100 ? "— balanced" : "— must equal 100% before saving"}
            </div>
          </div>

          <div className="settings-card">
            <h3>Feedback window & rater limits</h3>
            <div className="inline-fields">
              <div className="field-group" style={{ marginBottom: 0 }}>
                <div className="field-label-row"><span className="field-label">Feedback window (days)</span></div>
                <input
                  type="number"
                  className="text-input"
                  min={1}
                  value={feedbackWindow}
                  onChange={(event) => setFeedbackWindow(Number(event.target.value))}
                />
              </div>
              <div className="field-group" style={{ marginBottom: 0 }}>
                <div className="field-label-row"><span className="field-label">Min raters per employee</span></div>
                <input
                  type="number"
                  className="text-input"
                  min={1}
                  value={minRaters}
                  onChange={(event) => setMinRaters(Number(event.target.value))}
                />
              </div>
            </div>
            <div className="field-group" style={{ marginTop: 14, marginBottom: 0, maxWidth: 220 }}>
              <div className="field-label-row"><span className="field-label">Max raters per employee</span></div>
              <input
                type="number"
                className="text-input"
                min={minRaters}
                value={maxRaters}
                onChange={(event) => setMaxRaters(Number(event.target.value))}
              />
            </div>
          </div>

          <button className="btn-primary" disabled={raterTotal !== 100} onClick={save360}>
            Save 360 setup
          </button>
        </>
      )}

      {tab === "Check-ins" && (
        <>
          {checkinTypes.map((item) => (
            <div className="settings-card" key={item.id}>
              <h3>{item.label}</h3>
              <p className="field-hint" style={{ marginTop: -8, marginBottom: 14 }}>{item.description}</p>
              <div className="settings-row" style={{ borderTop: 0, paddingTop: 0 }}>
                <span>Frequency</span>
                <select
                  className="select-input"
                  style={{ width: 160 }}
                  value={item.frequency}
                  onChange={(event) => updateFrequency(item.id, event.target.value as CheckinType["frequency"])}
                >
                  <option value="Weekly">Weekly</option>
                  <option value="Biweekly">Biweekly</option>
                  <option value="Monthly">Monthly</option>
                </select>
              </div>
              <div className="settings-row">
                <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <Lock size={13} /> Manager remark required
                </span>
                <label className="toggle-switch">
                  <input type="checkbox" checked disabled readOnly />
                  <span className="toggle-track" />
                </label>
              </div>
              <p className="field-hint">Cannot be disabled — platform integrity rule.</p>
            </div>
          ))}
          <button className="btn-primary" onClick={saveCheckins}>Save check-ins setup</button>
        </>
      )}

      {tab === "Surveys" && (
        <>
          <div className="settings-card" style={{ background: "var(--padi-soft)", border: "1px solid #e5dbf5" }}>
            <h3 style={{ display: "flex", alignItems: "center", gap: 7 }}><Info size={15} /> eNPS scoring</h3>
            <p className="field-hint" style={{ marginTop: 0, color: "var(--padi-dark)" }}>
              The eNPS score is calculated as %Promoters (scoring 9-10) minus %Detractors (scoring 0-6) on the recommend-this-company
              question. Scores 7-8 are Passives and are excluded from the calculation.
            </p>
          </div>

          <div className="settings-card">
            <h3>Survey questions</h3>
            {questions.map((question, index) => (
              <div className="chip-add-row" key={question.id}>
                <input
                  className="text-input"
                  value={question.text}
                  placeholder={`Question ${index + 1}`}
                  onChange={(event) => updateQuestion(question.id, event.target.value)}
                />
                <button className="btn-ghost" onClick={() => removeQuestion(question.id)} aria-label="Remove question">
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
            <button
              className="soft-button"
              style={{ marginTop: 10 }}
              disabled={questions.length >= 30}
              onClick={addQuestion}
            >
              <Plus size={14} /> Add question
            </button>
            <p className="field-hint">
              {questions.length}/30 questions — surveys are capped at 25-30 questions to protect completion rates.
            </p>
          </div>

          <button className="btn-primary" onClick={saveSurveys}>Save survey setup</button>
        </>
      )}
    </>
  );
}
