"use client";

import { useState } from "react";
import { Check, Pencil, Plus, Target, Trash2, X } from "lucide-react";
import type { AdminSectionProps } from "./types";

type StrategyTab =
  | "Vision"
  | "Purpose"
  | "Core Values"
  | "North Star Metric"
  | "Guardrail Metrics"
  | "Business & Operating Model"
  | "Capabilities"
  | "Value Streams"
  | "Strategic Priorities";

const tabs: StrategyTab[] = [
  "Vision",
  "Purpose",
  "Core Values",
  "North Star Metric",
  "Guardrail Metrics",
  "Business & Operating Model",
  "Capabilities",
  "Value Streams",
  "Strategic Priorities",
];

const VISION_MAX = 200;
const VISION_WARN = 180;
const PURPOSE_MAX = 300;
const PURPOSE_WARN = 280;
const CORE_VALUES_MAX = 10;
const GUARDRAILS_MAX = 10;
const PRIORITIES_MAX = 20;

type Guardrail = { id: string; name: string; threshold: string };
type ValueStream = { id: string; name: string; description: string };
type Priority = { id: string; title: string; weight: string };
type Horizon = "3-Year" | "5-Year" | "10-Year";

const operatingModels = ["Centralised", "Decentralised", "Matrix", "Agile", "Hybrid"] as const;
const frequencies = ["Weekly", "Monthly", "Quarterly"] as const;
const horizons: Horizon[] = ["3-Year", "5-Year", "10-Year"];

let idCounter = 0;
function nextId(prefix: string) {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}

export function StrategySetup({ showToast }: AdminSectionProps) {
  const [tab, setTab] = useState<StrategyTab>("Vision");

  // Vision
  const [vision, setVision] = useState(
    "Become the operating system for execution intelligence in growth companies."
  );

  // Purpose
  const [purpose, setPurpose] = useState(
    "We exist to help ambitious companies turn strategy into daily execution, so every team knows what matters and why it matters right now."
  );

  // Core values
  const [coreValues, setCoreValues] = useState<string[]>([
    "Ownership",
    "Curiosity",
    "Candor",
    "Craft",
    "Customer Obsession",
  ]);
  const [newCoreValue, setNewCoreValue] = useState("");

  // North star metric
  const [nsmName, setNsmName] = useState("Weekly Active Execution Teams");
  const [nsmBaseline, setNsmBaseline] = useState("120");
  const [nsmTarget, setNsmTarget] = useState("500");
  const [nsmFrequency, setNsmFrequency] = useState<(typeof frequencies)[number]>("Monthly");
  const [nsmSource, setNsmSource] = useState("Product analytics (Amplitude)");

  // Guardrail metrics
  const [guardrails, setGuardrails] = useState<Guardrail[]>([
    { id: nextId("gr"), name: "Customer churn rate", threshold: "< 4% monthly" },
    { id: nextId("gr"), name: "Employee eNPS", threshold: "> 40" },
    { id: nextId("gr"), name: "Support response time", threshold: "< 6 hrs" },
  ]);
  const [newGuardrailName, setNewGuardrailName] = useState("");
  const [newGuardrailThreshold, setNewGuardrailThreshold] = useState("");

  // Business & operating model
  const [businessModel, setBusinessModel] = useState("B2B SaaS, subscription-based, enterprise + mid-market");
  const [operatingModel, setOperatingModel] = useState<(typeof operatingModels)[number]>("Hybrid");

  // Capabilities
  const [capabilities, setCapabilities] = useState<string[]>([
    "AI-native product development",
    "Regulatory compliance",
    "Customer success at scale",
  ]);
  const [newCapability, setNewCapability] = useState("");

  // Value streams
  const [valueStreams, setValueStreams] = useState<ValueStream[]>([
    { id: nextId("vs"), name: "Customer Acquisition", description: "Attract and convert qualified prospects into paying customers." },
    { id: nextId("vs"), name: "Product Delivery", description: "Ship reliable, valuable product increments continuously." },
    { id: nextId("vs"), name: "Talent Development", description: "Grow the skills and capacity of our people." },
  ]);
  const [newStreamName, setNewStreamName] = useState("");
  const [newStreamDescription, setNewStreamDescription] = useState("");
  const [editingStreamId, setEditingStreamId] = useState<string | null>(null);
  const [editStreamName, setEditStreamName] = useState("");
  const [editStreamDescription, setEditStreamDescription] = useState("");

  // Strategic priorities
  const [horizon, setHorizon] = useState<Horizon>("3-Year");
  const [priorities, setPriorities] = useState<Record<Horizon, Priority[]>>({
    "3-Year": [
      { id: nextId("pr"), title: "Achieve category leadership in mid-market", weight: "40" },
      { id: nextId("pr"), title: "Build a self-serve growth engine", weight: "30" },
      { id: nextId("pr"), title: "Reach net-positive unit economics", weight: "30" },
    ],
    "5-Year": [
      { id: nextId("pr"), title: "Expand into two new geographic markets", weight: "" },
      { id: nextId("pr"), title: "Launch an AI-native second product line", weight: "" },
    ],
    "10-Year": [
      { id: nextId("pr"), title: "Become the default execution platform for growth companies globally", weight: "" },
    ],
  });
  const [newPriorityTitle, setNewPriorityTitle] = useState("");
  const [newPriorityWeight, setNewPriorityWeight] = useState("");
  const [editingPriorityId, setEditingPriorityId] = useState<string | null>(null);
  const [editPriorityTitle, setEditPriorityTitle] = useState("");
  const [editPriorityWeight, setEditPriorityWeight] = useState("");

  function addCoreValue() {
    const value = newCoreValue.trim();
    if (!value || coreValues.length >= CORE_VALUES_MAX) return;
    setCoreValues((current) => [...current, value]);
    setNewCoreValue("");
  }

  function removeCoreValue(index: number) {
    setCoreValues((current) => current.filter((_, i) => i !== index));
  }

  function addCapability() {
    const value = newCapability.trim();
    if (!value) return;
    setCapabilities((current) => [...current, value]);
    setNewCapability("");
  }

  function removeCapability(index: number) {
    setCapabilities((current) => current.filter((_, i) => i !== index));
  }

  function addGuardrail() {
    const name = newGuardrailName.trim();
    if (!name || guardrails.length >= GUARDRAILS_MAX) return;
    setGuardrails((current) => [...current, { id: nextId("gr"), name, threshold: newGuardrailThreshold.trim() }]);
    setNewGuardrailName("");
    setNewGuardrailThreshold("");
  }

  function removeGuardrail(id: string) {
    setGuardrails((current) => current.filter((g) => g.id !== id));
  }

  function addValueStream() {
    const name = newStreamName.trim();
    if (!name) return;
    setValueStreams((current) => [...current, { id: nextId("vs"), name, description: newStreamDescription.trim() }]);
    setNewStreamName("");
    setNewStreamDescription("");
  }

  function removeValueStream(id: string) {
    setValueStreams((current) => current.filter((v) => v.id !== id));
  }

  function startEditStream(stream: ValueStream) {
    setEditingStreamId(stream.id);
    setEditStreamName(stream.name);
    setEditStreamDescription(stream.description);
  }

  function saveEditStream(id: string) {
    setValueStreams((current) =>
      current.map((v) => (v.id === id ? { ...v, name: editStreamName.trim() || v.name, description: editStreamDescription.trim() } : v))
    );
    setEditingStreamId(null);
  }

  const activePriorities = priorities[horizon];
  const weightSum = activePriorities.reduce((sum, p) => sum + (parseFloat(p.weight) || 0), 0);
  const anyWeightSet = activePriorities.some((p) => p.weight.trim() !== "");
  const weightError = anyWeightSet && Math.round(weightSum) !== 100;

  function addPriority() {
    const title = newPriorityTitle.trim();
    if (!title || activePriorities.length >= PRIORITIES_MAX) return;
    setPriorities((current) => ({
      ...current,
      [horizon]: [...current[horizon], { id: nextId("pr"), title, weight: newPriorityWeight.trim() }],
    }));
    setNewPriorityTitle("");
    setNewPriorityWeight("");
  }

  function removePriority(id: string) {
    setPriorities((current) => ({ ...current, [horizon]: current[horizon].filter((p) => p.id !== id) }));
  }

  function startEditPriority(priority: Priority) {
    setEditingPriorityId(priority.id);
    setEditPriorityTitle(priority.title);
    setEditPriorityWeight(priority.weight);
  }

  function saveEditPriority(id: string) {
    setPriorities((current) => ({
      ...current,
      [horizon]: current[horizon].map((p) =>
        p.id === id ? { ...p, title: editPriorityTitle.trim() || p.title, weight: editPriorityWeight.trim() } : p
      ),
    }));
    setEditingPriorityId(null);
  }

  return (
    <>
      <div className="admin-header">
        <h2>Strategy Setup</h2>
        <p>
          The foundational strategy configuration every other module builds on — OKRs, team plans, and
          appraisals all trace back to what you define here. Set this once per strategic cycle and revisit it
          as the business evolves.
        </p>
      </div>

      <div className="strategy-setup-tabs" role="tablist" aria-label="Strategy setup sections">
        {tabs.map((t, index) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tab === t}
            className={tab === t ? "active" : ""}
            onClick={() => setTab(t)}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{t}</strong>
          </button>
        ))}
      </div>

      {tab === "Vision" && (
        <div className="settings-card">
          <h3>Vision</h3>
          <div className="field-group" style={{ marginBottom: 6 }}>
            <div className="field-label-row">
              <span className="field-label">Vision statement</span>
              <span className={`char-counter${vision.length > VISION_WARN ? " warn" : ""}`}>
                {vision.length} / {VISION_MAX}
              </span>
            </div>
            <input
              className="text-input"
              value={vision}
              maxLength={VISION_MAX}
              onChange={(event) => setVision(event.target.value.slice(0, VISION_MAX))}
              placeholder="Become the operating system for execution intelligence in growth companies."
            />
            <p className="field-hint">A single, ambitious sentence describing the future state you&apos;re building toward.</p>
          </div>
          <button className="btn-primary" onClick={() => showToast("Vision saved")}>
            Save
          </button>
        </div>
      )}

      {tab === "Purpose" && (
        <div className="settings-card">
          <h3>Purpose</h3>
          <div className="field-group" style={{ marginBottom: 6 }}>
            <div className="field-label-row">
              <span className="field-label">Purpose statement</span>
              <span className={`char-counter${purpose.length > PURPOSE_WARN ? " warn" : ""}`}>
                {purpose.length} / {PURPOSE_MAX}
              </span>
            </div>
            <textarea
              className="textarea-input"
              value={purpose}
              maxLength={PURPOSE_MAX}
              onChange={(event) => setPurpose(event.target.value.slice(0, PURPOSE_MAX))}
              placeholder="Why this organisation exists, beyond making money."
            />
            <p className="field-hint">Explain why the organisation exists — the deeper reason behind the vision.</p>
          </div>
          <button className="btn-primary" onClick={() => showToast("Purpose saved")}>
            Save
          </button>
        </div>
      )}

      {tab === "Core Values" && (
        <div className="settings-card">
          <h3>Core Values</h3>
          <p className="field-hint" style={{ marginBottom: 12 }}>
            Recommend 4–7 values that guide day-to-day decisions and behaviours (max {CORE_VALUES_MAX}).
          </p>
          <div className="chip-list">
            {coreValues.map((value, index) => (
              <span className="chip" key={`${value}-${index}`}>
                {value}
                <button onClick={() => removeCoreValue(index)} aria-label={`Remove ${value}`}>
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
          <div className="chip-add-row">
            <input
              className="text-input"
              value={newCoreValue}
              onChange={(event) => setNewCoreValue(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && addCoreValue()}
              placeholder="Add a core value"
              disabled={coreValues.length >= CORE_VALUES_MAX}
            />
            <button className="soft-button" onClick={addCoreValue} disabled={coreValues.length >= CORE_VALUES_MAX}>
              <Plus size={14} /> Add
            </button>
          </div>
          {coreValues.length >= CORE_VALUES_MAX && (
            <p className="field-hint">You&apos;ve reached the maximum of {CORE_VALUES_MAX} core values.</p>
          )}
          <div style={{ marginTop: 16 }}>
            <button className="btn-primary" onClick={() => showToast("Core values saved")}>
              Save
            </button>
          </div>
        </div>
      )}

      {tab === "North Star Metric" && (
        <div className="settings-card">
          <h3>North Star Metric</h3>
          <p className="field-hint" style={{ marginBottom: 14 }}>
            The single most important metric for the organisation — the clearest signal that you&apos;re delivering
            durable value.
          </p>
          <div className="field-group">
            <div className="field-label-row">
              <span className="field-label">Metric name</span>
            </div>
            <input className="text-input" value={nsmName} onChange={(event) => setNsmName(event.target.value)} placeholder="e.g. Weekly Active Execution Teams" />
          </div>
          <div className="inline-fields">
            <div className="field-group">
              <div className="field-label-row">
                <span className="field-label">Baseline</span>
              </div>
              <input
                className="text-input"
                type="number"
                value={nsmBaseline}
                onChange={(event) => setNsmBaseline(event.target.value)}
              />
            </div>
            <div className="field-group">
              <div className="field-label-row">
                <span className="field-label">Target</span>
              </div>
              <input
                className="text-input"
                type="number"
                value={nsmTarget}
                onChange={(event) => setNsmTarget(event.target.value)}
              />
            </div>
          </div>
          <div className="inline-fields">
            <div className="field-group">
              <div className="field-label-row">
                <span className="field-label">Measurement frequency</span>
              </div>
              <select
                className="select-input"
                value={nsmFrequency}
                onChange={(event) => setNsmFrequency(event.target.value as (typeof frequencies)[number])}
              >
                {frequencies.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
            <div className="field-group">
              <div className="field-label-row">
                <span className="field-label">Data source</span>
              </div>
              <input className="text-input" value={nsmSource} onChange={(event) => setNsmSource(event.target.value)} placeholder="e.g. Product analytics" />
            </div>
          </div>
          <button className="btn-primary" onClick={() => showToast("North Star Metric saved")}>
            Save
          </button>
        </div>
      )}

      {tab === "Guardrail Metrics" && (
        <div className="settings-card">
          <h3>Guardrail Metrics</h3>
          <p className="field-hint" style={{ marginBottom: 12 }}>
            Metrics that protect the North Star from being gamed. Recommend 2–5 (max {GUARDRAILS_MAX}).
          </p>
          {guardrails.map((g) => (
            <div className="kra-card" key={g.id}>
              <div className="kra-card-header">
                <h4>{g.name}</h4>
                <button className="plain-icon" onClick={() => removeGuardrail(g.id)} aria-label={`Remove ${g.name}`}>
                  <Trash2 size={14} />
                </button>
              </div>
              <span className="lag-lead-tag lag">Threshold: {g.threshold || "Not set"}</span>
            </div>
          ))}
          <div className="chip-add-row">
            <input
              className="text-input"
              value={newGuardrailName}
              onChange={(event) => setNewGuardrailName(event.target.value)}
              placeholder="Metric name (e.g. Customer churn rate)"
              disabled={guardrails.length >= GUARDRAILS_MAX}
            />
            <input
              className="text-input"
              value={newGuardrailThreshold}
              onChange={(event) => setNewGuardrailThreshold(event.target.value)}
              placeholder="Threshold (e.g. < 4% monthly)"
              disabled={guardrails.length >= GUARDRAILS_MAX}
            />
            <button className="soft-button" onClick={addGuardrail} disabled={guardrails.length >= GUARDRAILS_MAX}>
              <Plus size={14} /> Add
            </button>
          </div>
          {guardrails.length >= GUARDRAILS_MAX && (
            <p className="field-hint">You&apos;ve reached the maximum of {GUARDRAILS_MAX} guardrail metrics.</p>
          )}
          <div style={{ marginTop: 16 }}>
            <button className="btn-primary" onClick={() => showToast("Guardrail metrics saved")}>
              Save
            </button>
          </div>
        </div>
      )}

      {tab === "Business & Operating Model" && (
        <div className="settings-card">
          <h3>Business Model</h3>
          <div className="field-group">
            <div className="field-label-row">
              <span className="field-label">Description</span>
            </div>
            <input
              className="text-input"
              value={businessModel}
              onChange={(event) => setBusinessModel(event.target.value)}
              placeholder="e.g. B2B SaaS, subscription-based"
            />
            <p className="field-hint">How the organisation creates, delivers, and captures value.</p>
          </div>

          <h3 style={{ marginTop: 20 }}>Operating Model</h3>
          <div className="field-group">
            <div className="field-label-row">
              <span className="field-label">Structure</span>
            </div>
            <div className="pill-toggle-group">
              {operatingModels.map((model) => (
                <button
                  key={model}
                  className={`pill-toggle${operatingModel === model ? " active" : ""}`}
                  onClick={() => setOperatingModel(model)}
                >
                  {model}
                </button>
              ))}
            </div>
            <p className="field-hint">How decisions flow and work gets coordinated across the organisation.</p>
          </div>
          <button className="btn-primary" onClick={() => showToast("Business & operating model saved")}>
            Save
          </button>
        </div>
      )}

      {tab === "Capabilities" && (
        <div className="settings-card">
          <h3>Organisational Capabilities</h3>
          <p className="field-hint" style={{ marginBottom: 12 }}>
            The distinctive capabilities the organisation needs to execute its strategy.
          </p>
          <div className="chip-list">
            {capabilities.map((value, index) => (
              <span className="chip" key={`${value}-${index}`}>
                {value}
                <button onClick={() => removeCapability(index)} aria-label={`Remove ${value}`}>
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
          <div className="chip-add-row">
            <input
              className="text-input"
              value={newCapability}
              onChange={(event) => setNewCapability(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && addCapability()}
              placeholder="Add a capability"
            />
            <button className="soft-button" onClick={addCapability}>
              <Plus size={14} /> Add
            </button>
          </div>
          <div style={{ marginTop: 16 }}>
            <button className="btn-primary" onClick={() => showToast("Capabilities saved")}>
              Save
            </button>
          </div>
        </div>
      )}

      {tab === "Value Streams" && (
        <div className="settings-card">
          <h3>Value Streams</h3>
          <p className="field-hint" style={{ marginBottom: 12 }}>
            The end-to-end streams of activity that deliver value to customers or the business.
          </p>
          {valueStreams.map((stream) =>
            editingStreamId === stream.id ? (
              <div className="kra-card" key={stream.id}>
                <input
                  className="text-input"
                  style={{ marginBottom: 8 }}
                  value={editStreamName}
                  onChange={(event) => setEditStreamName(event.target.value)}
                  placeholder="Value stream name"
                />
                <textarea
                  className="textarea-input"
                  value={editStreamDescription}
                  onChange={(event) => setEditStreamDescription(event.target.value)}
                  placeholder="Short description"
                />
                <div className="modal-actions" style={{ marginTop: 10 }}>
                  <button className="btn-ghost" onClick={() => setEditingStreamId(null)}>
                    Cancel
                  </button>
                  <button className="btn-primary" onClick={() => saveEditStream(stream.id)}>
                    <Check size={14} /> Done
                  </button>
                </div>
              </div>
            ) : (
              <div className="kra-card" key={stream.id}>
                <div className="kra-card-header">
                  <h4>{stream.name}</h4>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button className="plain-icon" onClick={() => startEditStream(stream)} aria-label={`Edit ${stream.name}`}>
                      <Pencil size={14} />
                    </button>
                    <button className="plain-icon" onClick={() => removeValueStream(stream.id)} aria-label={`Remove ${stream.name}`}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <p style={{ margin: 0, color: "var(--muted)", fontSize: 11, lineHeight: 1.6 }}>{stream.description}</p>
              </div>
            )
          )}
          <div className="kra-card">
            <input
              className="text-input"
              style={{ marginBottom: 8 }}
              value={newStreamName}
              onChange={(event) => setNewStreamName(event.target.value)}
              placeholder="New value stream name"
            />
            <div className="chip-add-row" style={{ marginTop: 0 }}>
              <input
                className="text-input"
                value={newStreamDescription}
                onChange={(event) => setNewStreamDescription(event.target.value)}
                placeholder="Short description"
              />
              <button className="soft-button" onClick={addValueStream}>
                <Plus size={14} /> Add
              </button>
            </div>
          </div>
          <button className="btn-primary" onClick={() => showToast("Value streams saved")}>
            Save
          </button>
        </div>
      )}

      {tab === "Strategic Priorities" && (
        <div className="settings-card">
          <h3>Strategic Priorities</h3>
          <p className="field-hint" style={{ marginBottom: 12 }}>
            Recommend 6–12 priorities per horizon (max {PRIORITIES_MAX}). Weights are optional — if you set
            them, they should add up to 100 for that horizon.
          </p>
          <div className="pill-toggle-group" style={{ marginBottom: 16 }}>
            {horizons.map((h) => (
              <button key={h} className={`pill-toggle${horizon === h ? " active" : ""}`} onClick={() => setHorizon(h)}>
                {h}
              </button>
            ))}
          </div>

          {anyWeightSet && (
            <div className={`weight-total${weightError ? " error" : ""}`}>
              <Target size={13} style={{ marginRight: 6, verticalAlign: -2 }} />
              Total weight for {horizon}: {weightSum}%{weightError ? " — weights should sum to 100%" : ""}
            </div>
          )}

          <div style={{ marginTop: 14 }}>
            {activePriorities.length === 0 && <p className="priority-empty">No priorities yet for this horizon.</p>}
            {activePriorities.map((priority) =>
              editingPriorityId === priority.id ? (
                <div className="weight-row" key={priority.id}>
                  <input
                    className="text-input"
                    style={{ flex: 1 }}
                    value={editPriorityTitle}
                    onChange={(event) => setEditPriorityTitle(event.target.value)}
                  />
                  <input
                    className="text-input"
                    type="number"
                    min={0}
                    max={100}
                    style={{ width: 80, flex: "none" }}
                    value={editPriorityWeight}
                    onChange={(event) => setEditPriorityWeight(event.target.value)}
                    placeholder="Weight"
                  />
                  <button className="plain-icon" onClick={() => saveEditPriority(priority.id)} aria-label="Save">
                    <Check size={16} />
                  </button>
                </div>
              ) : (
                <div className="weight-row" key={priority.id}>
                  <span className="weight-row-label" style={{ width: "auto", flex: 1 }}>
                    {priority.title}
                  </span>
                  <span className="weight-row-value">{priority.weight ? `${priority.weight}%` : "—"}</span>
                  <button className="plain-icon" onClick={() => startEditPriority(priority)} aria-label={`Edit ${priority.title}`}>
                    <Pencil size={14} />
                  </button>
                  <button className="plain-icon" onClick={() => removePriority(priority.id)} aria-label={`Remove ${priority.title}`}>
                    <Trash2 size={14} />
                  </button>
                </div>
              )
            )}
          </div>

          <div className="chip-add-row">
            <input
              className="text-input"
              value={newPriorityTitle}
              onChange={(event) => setNewPriorityTitle(event.target.value)}
              placeholder={`Add a ${horizon} priority`}
              disabled={activePriorities.length >= PRIORITIES_MAX}
            />
            <input
              className="text-input"
              type="number"
              min={0}
              max={100}
              style={{ width: 90, flex: "none" }}
              value={newPriorityWeight}
              onChange={(event) => setNewPriorityWeight(event.target.value)}
              placeholder="Weight %"
              disabled={activePriorities.length >= PRIORITIES_MAX}
            />
            <button className="soft-button" onClick={addPriority} disabled={activePriorities.length >= PRIORITIES_MAX}>
              <Plus size={14} /> Add
            </button>
          </div>
          {activePriorities.length >= PRIORITIES_MAX && (
            <p className="field-hint">You&apos;ve reached the maximum of {PRIORITIES_MAX} priorities for this horizon.</p>
          )}

          <div style={{ marginTop: 16 }}>
            <button className="btn-primary" onClick={() => showToast(`${horizon} strategic priorities saved`)}>
              Save
            </button>
          </div>
        </div>
      )}
    </>
  );
}
