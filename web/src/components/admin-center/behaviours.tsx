"use client";

import { useState } from "react";
import { AlertTriangle, Plus, Trash2, X } from "lucide-react";
import type { AdminSectionProps } from "./types";

type BehaviourCategory = {
  id: string;
  coreValue: string;
  behaviours: string[];
};

type TeamMember = {
  id: string;
  name: string;
  role: string;
  objectivesScore: number;
  behaviourScore: number;
};

const MIN_BEHAVIOURS = 3;
const MAX_BEHAVIOURS = 8;
const GAP_THRESHOLD = 25;

const initialCategories: BehaviourCategory[] = [
  {
    id: "ownership",
    coreValue: "Ownership",
    behaviours: [
      "Follows through on commitments without being chased",
      "Proactively flags risks before being asked",
      "Takes responsibility for mistakes without deflecting",
      "Treats company resources like their own",
    ],
  },
  {
    id: "candor",
    coreValue: "Candor",
    behaviours: [
      "Gives direct feedback instead of avoiding hard conversations",
      "Raises disagreement in the room, not after the meeting",
      "Shares bad news early rather than burying it",
    ],
  },
  {
    id: "craft",
    coreValue: "Craft",
    behaviours: [
      "Sweats the details others would let slide",
      "Seeks feedback on work before it's asked for",
      "Continuously improves how the work gets done, not just the output",
      "Leaves things better documented than they were found",
    ],
  },
  {
    id: "customer-obsession",
    coreValue: "Customer Obsession",
    behaviours: [
      "Brings customer evidence into decisions, not just opinions",
      "Responds to customer-impacting issues with urgency",
      "Pushes back on internally-convenient shortcuts that hurt users",
    ],
  },
  {
    id: "collaboration",
    coreValue: "Collaboration",
    behaviours: [
      "Shares context proactively instead of hoarding information",
      "Credits others' contributions in front of stakeholders",
      "Asks for help early instead of struggling silently",
    ],
  },
];

const initialTeam: TeamMember[] = [
  { id: "t1", name: "Amaka Obi", role: "Sales Lead", objectivesScore: 92, behaviourScore: 58 },
  { id: "t2", name: "David Chen", role: "Product Manager", objectivesScore: 81, behaviourScore: 76 },
  { id: "t3", name: "Bisi Adebayo", role: "Engineering Manager", objectivesScore: 74, behaviourScore: 88 },
  { id: "t4", name: "Tunde Bakare", role: "Customer Success", objectivesScore: 65, behaviourScore: 70 },
  { id: "t5", name: "Grace Okafor", role: "Marketing Lead", objectivesScore: 95, behaviourScore: 62 },
  { id: "t6", name: "Femi Alabi", role: "Finance Analyst", objectivesScore: 70, behaviourScore: 81 },
];

export function Behaviours({ showToast }: AdminSectionProps) {
  const [tab, setTab] = useState<"Setup" | "Management">("Setup");
  const [categories, setCategories] = useState<BehaviourCategory[]>(initialCategories);
  const [team] = useState<TeamMember[]>(initialTeam);
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  const addCategory = () => {
    const id = `category-${Date.now()}`;
    setCategories((prev) => [
      ...prev,
      { id, coreValue: "New Core Value", behaviours: ["Describe an observable behaviour"] },
    ]);
    showToast("Behaviour category added");
  };

  const removeCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    showToast("Behaviour category removed");
  };

  const renameCategory = (id: string, coreValue: string) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, coreValue } : c)));
  };

  const removeBehaviour = (categoryId: string, index: number) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === categoryId ? { ...c, behaviours: c.behaviours.filter((_, i) => i !== index) } : c,
      ),
    );
    showToast("Behaviour removed");
  };

  const addBehaviour = (categoryId: string) => {
    const text = (drafts[categoryId] || "").trim();
    if (!text) return;
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id !== categoryId) return c;
        if (c.behaviours.length >= MAX_BEHAVIOURS) return c;
        return { ...c, behaviours: [...c.behaviours, text] };
      }),
    );
    setDrafts((prev) => ({ ...prev, [categoryId]: "" }));
    showToast("Behaviour added");
  };

  return (
    <>
      <div className="admin-header">
        <h2>Behaviours</h2>
        <p>
          Behaviours are the observable, day-to-day expression of a Core Value &mdash; the concrete things a
          manager can actually see and rate someone on, not the abstract value itself.
        </p>
      </div>

      <div className="view-tabs">
        <button className={tab === "Setup" ? "active" : ""} onClick={() => setTab("Setup")}>
          Setup
        </button>
        <button className={tab === "Management" ? "active" : ""} onClick={() => setTab("Management")}>
          Management
        </button>
      </div>

      {tab === "Setup" && (
        <>
          {categories.map((category) => {
            const draft = drafts[category.id] || "";
            const count = category.behaviours.length;
            const atMax = count >= MAX_BEHAVIOURS;
            const underMin = count < MIN_BEHAVIOURS;
            return (
              <div className="kra-card" key={category.id}>
                <div className="kra-card-header">
                  <input
                    className="text-input"
                    style={{ height: 36, fontWeight: 650, fontSize: 13, maxWidth: 320 }}
                    value={category.coreValue}
                    onChange={(e) => renameCategory(category.id, e.target.value)}
                    aria-label="Core value name"
                  />
                  <button
                    className="plain-icon"
                    onClick={() => removeCategory(category.id)}
                    aria-label={`Delete ${category.coreValue} category`}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <div className="chip-list">
                  {category.behaviours.map((behaviour, index) => (
                    <span className="chip" key={`${category.id}-${index}`}>
                      {behaviour}
                      <button
                        onClick={() => removeBehaviour(category.id, index)}
                        aria-label={`Remove behaviour: ${behaviour}`}
                      >
                        <X size={11} />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="chip-add-row">
                  <input
                    className="text-input"
                    placeholder={atMax ? "Maximum of 8 behaviours reached" : "Add an observable behaviour…"}
                    value={draft}
                    disabled={atMax}
                    onChange={(e) => setDrafts((prev) => ({ ...prev, [category.id]: e.target.value }))}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addBehaviour(category.id);
                      }
                    }}
                  />
                  <button
                    className="soft-button"
                    onClick={() => addBehaviour(category.id)}
                    disabled={atMax || !draft.trim()}
                  >
                    <Plus size={14} /> Add
                  </button>
                </div>
                <p className="field-hint">
                  {underMin
                    ? `Add at least ${MIN_BEHAVIOURS - count} more behaviour${MIN_BEHAVIOURS - count === 1 ? "" : "s"} — categories need 3-8 concrete, observable behaviours.`
                    : atMax
                      ? "This category has reached the 8-behaviour cap. Remove one to add another."
                      : `${count} of 8 behaviours defined.`}
                </p>
              </div>
            );
          })}

          <button className="soft-button" onClick={addCategory}>
            <Plus size={15} /> Add behaviour category
          </button>
        </>
      )}

      {tab === "Management" && (
        <>
          <div className="validation-banner info">
            <AlertTriangle size={15} />
            <span>
              <strong>Results-vs-Behaviour Gap:</strong> when someone&apos;s Objectives score outpaces their
              Behaviour score by more than {GAP_THRESHOLD} points, they&apos;re flagged as a &ldquo;results at
              any cost&rdquo; risk &mdash; hitting targets while eroding how the work gets done.
            </span>
          </div>

          <div className="data-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Behaviour score</th>
                  <th>Results-vs-Behaviour gap</th>
                  <th>Flag</th>
                </tr>
              </thead>
              <tbody>
                {team.map((member) => {
                  const gap = member.objectivesScore - member.behaviourScore;
                  const flagged = gap > GAP_THRESHOLD;
                  return (
                    <tr key={member.id}>
                      <td>
                        <strong style={{ display: "block", fontSize: 12 }}>{member.name}</strong>
                        <span style={{ color: "var(--muted)", fontSize: 10 }}>{member.role}</span>
                      </td>
                      <td>{member.behaviourScore}</td>
                      <td>{gap > 0 ? `+${gap}` : gap}</td>
                      <td>
                        {flagged ? (
                          <span className="role-pill super-admin">
                            <AlertTriangle size={11} style={{ marginRight: 4 }} />
                            Results-at-cost risk
                          </span>
                        ) : (
                          <span style={{ color: "var(--muted)" }}>—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}
