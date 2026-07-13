"use client";

import { useState } from "react";
import { Plus, X, Trash2, Layers } from "lucide-react";
import type { AdminSectionProps } from "./types";

type ViewTab = "Setup" | "Management" | "Matrices";

type SkillUnit = {
  id: string;
  name: string;
  elements: string[];
};

type TeamMember = {
  id: string;
  name: string;
  initials: string;
  unitId: string;
  avgProficiency: number;
};

type BandLevel = {
  id: string;
  label: string;
};

const bandLevels: BandLevel[] = [
  { id: "ic1", label: "IC1" },
  { id: "ic2", label: "IC2" },
  { id: "ic3", label: "IC3" },
  { id: "mgr", label: "Manager" },
  { id: "smgr", label: "Senior Manager" },
];

const proficiencyLabels: Record<number, string> = {
  1: "Novice",
  2: "Beginner",
  3: "Developing",
  4: "Competent",
  5: "Proficient",
  6: "Advanced",
  7: "Expert",
};

const seedUnits: SkillUnit[] = [
  {
    id: "u1",
    name: "Backend Engineering",
    elements: ["API design", "Database performance", "Incident response", "System architecture"],
  },
  {
    id: "u2",
    name: "Stakeholder Communication",
    elements: ["Executive updates", "Cross-functional alignment", "Written clarity"],
  },
  {
    id: "u3",
    name: "Product Discovery",
    elements: ["User research", "Problem framing", "Prioritisation", "Metrics definition"],
  },
  {
    id: "u4",
    name: "People Leadership",
    elements: ["Coaching", "Delegation", "Performance feedback", "Hiring judgement", "Conflict resolution"],
  },
];

const seedMembers: TeamMember[] = [
  { id: "m1", name: "Adaeze Okafor", initials: "AO", unitId: "u1", avgProficiency: 6 },
  { id: "m2", name: "Tunde Bakare", initials: "TB", unitId: "u2", avgProficiency: 4 },
  { id: "m3", name: "Chiamaka Nwosu", initials: "CN", unitId: "u3", avgProficiency: 5 },
  { id: "m4", name: "Femi Adeyemi", initials: "FA", unitId: "u4", avgProficiency: 5 },
  { id: "m5", name: "Ngozi Eze", initials: "NE", unitId: "u1", avgProficiency: 3 },
  { id: "m6", name: "Segun Olawale", initials: "SO", unitId: "u3", avgProficiency: 2 },
];

function buildInitialMatrix(units: SkillUnit[]): Record<string, Record<string, number>> {
  const matrix: Record<string, Record<string, number>> = {};
  let seed = 0;
  units.forEach((unit) => {
    unit.elements.forEach((element, elementIndex) => {
      const key = `${unit.id}::${element}`;
      matrix[key] = {};
      bandLevels.forEach((band, bandIndex) => {
        // Ramp expected proficiency up across band levels, varied a little per element.
        const base = 1 + bandIndex + (elementIndex % 2);
        matrix[key][band.id] = Math.min(7, Math.max(1, base + (seed % 2)));
      });
      seed += 1;
    });
  });
  return matrix;
}

function LevelDots({ filled }: { filled: number }) {
  return (
    <div className="level-dot-row">
      {Array.from({ length: 7 }, (_, index) => (
        <span key={index} className={`level-dot${index < filled ? " filled" : ""}`}>
          {index + 1}
        </span>
      ))}
    </div>
  );
}

export function Competencies({ showToast }: AdminSectionProps) {
  const [tab, setTab] = useState<ViewTab>("Setup");
  const [units, setUnits] = useState<SkillUnit[]>(seedUnits);
  const [members] = useState<TeamMember[]>(seedMembers);
  const [matrix, setMatrix] = useState<Record<string, Record<string, number>>>(() => buildInitialMatrix(seedUnits));
  const [activeMatrixUnitId, setActiveMatrixUnitId] = useState(seedUnits[0].id);
  const [newElementDrafts, setNewElementDrafts] = useState<Record<string, string>>({});

  function unitName(unitId: string) {
    return units.find((unit) => unit.id === unitId)?.name ?? "Unassigned";
  }

  function renameUnit(unitId: string, name: string) {
    setUnits((current) => current.map((unit) => (unit.id === unitId ? { ...unit, name } : unit)));
  }

  function commitUnitRename(unitId: string) {
    const unit = units.find((item) => item.id === unitId);
    if (unit) showToast(`"${unit.name}" saved`);
  }

  function addUnit() {
    const id = `u${Date.now()}`;
    setUnits((current) => [...current, { id, name: "New Skill Unit", elements: [] }]);
    showToast("Skill unit added");
  }

  function removeUnit(unitId: string) {
    const unit = units.find((item) => item.id === unitId);
    setUnits((current) => current.filter((item) => item.id !== unitId));
    setMatrix((current) => {
      const next = { ...current };
      Object.keys(next).forEach((key) => {
        if (key.startsWith(`${unitId}::`)) delete next[key];
      });
      return next;
    });
    if (activeMatrixUnitId === unitId) {
      const remaining = units.filter((item) => item.id !== unitId);
      if (remaining.length > 0) setActiveMatrixUnitId(remaining[0].id);
    }
    if (unit) showToast(`"${unit.name}" removed`);
  }

  function addElement(unitId: string) {
    const draft = (newElementDrafts[unitId] ?? "").trim();
    if (!draft) return;
    setUnits((current) =>
      current.map((unit) => (unit.id === unitId ? { ...unit, elements: [...unit.elements, draft] } : unit))
    );
    setMatrix((current) => ({
      ...current,
      [`${unitId}::${draft}`]: Object.fromEntries(bandLevels.map((band) => [band.id, 3])),
    }));
    setNewElementDrafts((current) => ({ ...current, [unitId]: "" }));
    showToast(`"${draft}" added`);
  }

  function removeElement(unitId: string, element: string) {
    setUnits((current) =>
      current.map((unit) =>
        unit.id === unitId ? { ...unit, elements: unit.elements.filter((item) => item !== element) } : unit
      )
    );
    setMatrix((current) => {
      const next = { ...current };
      delete next[`${unitId}::${element}`];
      return next;
    });
    showToast(`"${element}" removed`);
  }

  function cycleProficiency(unitId: string, element: string, bandId: string) {
    const key = `${unitId}::${element}`;
    setMatrix((current) => {
      const row = current[key] ?? {};
      const value = row[bandId] ?? 1;
      const next = value >= 7 ? 1 : value + 1;
      return { ...current, [key]: { ...row, [bandId]: next } };
    });
    const bandLabel = bandLevels.find((band) => band.id === bandId)?.label ?? bandId;
    showToast(`Expected proficiency for "${element}" at ${bandLabel} updated`);
  }

  const activeUnit = units.find((unit) => unit.id === activeMatrixUnitId) ?? units[0];

  return (
    <>
      <div className="admin-header">
        <h2>Competencies</h2>
        <p>
          Padiworks competencies are company-specific, not generic industry templates. Skill units group related
          skill elements, each rated on a 7-point proficiency scale. The competency matrix sets the expected
          proficiency per skill element at every work band level, driving both the hiring bar and appraisal
          competency scoring.
        </p>
      </div>

      <div className="view-tabs">
        {(["Setup", "Management", "Matrices"] as ViewTab[]).map((item) => (
          <button key={item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}>
            {item}
          </button>
        ))}
      </div>

      {tab === "Setup" && (
        <>
          <div className="plan-header" style={{ marginBottom: 14 }}>
            <div>
              <h2 style={{ fontSize: 14 }}>Skill units</h2>
            </div>
            <button className="soft-button" onClick={addUnit}>
              <Plus size={14} /> Add skill unit
            </button>
          </div>

          {units.map((unit) => (
            <div className="kra-card" key={unit.id}>
              <div className="kra-card-header">
                <input
                  className="text-input"
                  style={{ height: 36, fontSize: 13, fontWeight: 650, maxWidth: 320 }}
                  value={unit.name}
                  onChange={(event) => renameUnit(unit.id, event.target.value)}
                  onBlur={() => commitUnitRename(unit.id)}
                  aria-label="Skill unit name"
                />
                <button className="plain-icon" onClick={() => removeUnit(unit.id)} aria-label={`Remove ${unit.name}`}>
                  <Trash2 size={15} />
                </button>
              </div>

              <div className="chip-list">
                {unit.elements.length === 0 && (
                  <span style={{ color: "var(--muted)", fontSize: 11 }}>No skill elements yet.</span>
                )}
                {unit.elements.map((element) => (
                  <span className="chip" key={element}>
                    {element}
                    <button onClick={() => removeElement(unit.id, element)} aria-label={`Remove ${element}`}>
                      <X size={11} />
                    </button>
                  </span>
                ))}
              </div>

              <div className="chip-add-row">
                <input
                  className="text-input"
                  placeholder="Add a skill element…"
                  value={newElementDrafts[unit.id] ?? ""}
                  onChange={(event) =>
                    setNewElementDrafts((current) => ({ ...current, [unit.id]: event.target.value }))
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      addElement(unit.id);
                    }
                  }}
                />
                <button className="soft-button" onClick={() => addElement(unit.id)}>
                  <Plus size={14} /> Add
                </button>
              </div>
            </div>
          ))}
        </>
      )}

      {tab === "Management" && (
        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Skill unit</th>
                <th>Current avg proficiency</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                      <span className="avatar" style={{ background: "var(--padi-soft)", color: "var(--padi)" }}>
                        {member.initials}
                      </span>
                      {member.name}
                    </div>
                  </td>
                  <td>{unitName(member.unitId)}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <LevelDots filled={member.avgProficiency} />
                      <span style={{ color: "var(--muted)", fontSize: 10 }}>
                        {member.avgProficiency} · {proficiencyLabels[member.avgProficiency]}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "Matrices" && activeUnit && (
        <>
          <div className="pill-toggle-group" style={{ marginBottom: 16 }}>
            {units.map((unit) => (
              <button
                key={unit.id}
                className={`pill-toggle${unit.id === activeMatrixUnitId ? " active" : ""}`}
                onClick={() => setActiveMatrixUnitId(unit.id)}
              >
                {unit.name}
              </button>
            ))}
          </div>

          {activeUnit.elements.length === 0 ? (
            <div className="empty-state">
              <Layers size={22} />
              <strong>No skill elements</strong>
              <span>Add skill elements to &quot;{activeUnit.name}&quot; in the Setup tab to build its matrix.</span>
            </div>
          ) : (
            <div className="matrix-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Skill element</th>
                    {bandLevels.map((band) => (
                      <th key={band.id}>{band.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {activeUnit.elements.map((element) => {
                    const key = `${activeUnit.id}::${element}`;
                    const row = matrix[key] ?? {};
                    return (
                      <tr key={element}>
                        <td style={{ fontWeight: 600, whiteSpace: "nowrap" }}>{element}</td>
                        {bandLevels.map((band) => {
                          const value = row[band.id] ?? 1;
                          return (
                            <td key={band.id}>
                              <button
                                className="level-dot filled"
                                style={{ width: 26, height: 26, fontSize: 10, border: 0 }}
                                onClick={() => cycleProficiency(activeUnit.id, element, band.id)}
                                title={`${proficiencyLabels[value]} — click to change`}
                              >
                                {value}
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </>
  );
}
