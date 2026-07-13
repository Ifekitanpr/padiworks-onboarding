"use client";

import { useRef, useState } from "react";
import {
  AlertTriangle, CalendarDays, ChevronDown, Download, FileDown, Link2Off, TrendingUp, Users, X,
} from "lucide-react";

type ReportCard = {
  id: string;
  title: string;
  description: string;
  stat: string;
  statLabel: string;
  icon: typeof TrendingUp;
};

const reportCards: ReportCard[] = [
  {
    id: "execution-health",
    title: "Execution Health Report",
    description: "Rollup of on-track, at-risk, and behind objectives across the organisation.",
    stat: "74",
    statLabel: "org-wide health score",
    icon: TrendingUp,
  },
  {
    id: "portfolio-risk",
    title: "Portfolio Risk Report",
    description: "Strategic priorities with multiple at-risk or behind objectives underneath them.",
    stat: "2",
    statLabel: "priorities at risk",
    icon: AlertTriangle,
  },
  {
    id: "ghost-work",
    title: "Ghost Work Report",
    description: "Work items and objectives with no link to a strategic priority or OKR.",
    stat: "5",
    statLabel: "unlinked work items",
    icon: Link2Off,
  },
  {
    id: "team-performance",
    title: "Team Performance Report",
    description: "Per-team rollup of objective completion, behaviour, and competency scores.",
    stat: "8",
    statLabel: "teams reporting",
    icon: Users,
  },
];

const appraisalBands = [
  { label: "Outstanding", pct: 12, color: "#15803d" },
  { label: "Strong", pct: 34, color: "#1d4ed8" },
  { label: "Meets", pct: 38, color: "#6941c6" },
  { label: "Development Needed", pct: 12, color: "#b45309" },
  { label: "Concern", pct: 4, color: "#d92d20" },
];

const dateOptions = ["This quarter", "Last quarter", "This year"];

export function ReportsSection() {
  const [dateRange, setDateRange] = useState("This quarter");
  const [dateOpen, setDateOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [activeReport, setActiveReport] = useState<ReportCard | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function showToast(message: string) {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }

  const ActiveReportIcon = activeReport?.icon;

  return (
    <>
      <div className="admin-header">
        <h2>Reports</h2>
        <p>Org-wide execution analytics, exportable for stakeholder reviews.</p>
      </div>

      <div className="home-grid" style={{ marginTop: 0 }}>
        <article className="stat-tile report-stat positive">
          <span>Execution health score</span>
          <strong>74</strong>
        </article>
        <article className="stat-tile report-stat warning">
          <span>Strategy execution alignment</span>
          <strong>64</strong>
        </article>
        <article className="stat-tile report-stat danger">
          <span>Ghost work items</span>
          <strong>5</strong>
        </article>
        <article className="stat-tile report-stat positive">
          <span>Objectives on track</span>
          <strong>58%</strong>
        </article>
      </div>

      <div className="plan-header" style={{ marginBottom: 14 }}>
        <div>
          <h2 style={{ fontSize: 14, margin: 0 }}>All reports</h2>
        </div>
        <div className="menu-wrap">
          <button className="date-button" onClick={() => setDateOpen((open) => !open)}>
            <CalendarDays size={16} />
            <span><small>Date filter</small>{dateRange}</span>
            <ChevronDown size={15} />
          </button>
          {dateOpen && (
            <div className="menu-panel menu-right">
              {dateOptions.map((option) => (
                <button key={option} onClick={() => { setDateRange(option); setDateOpen(false); showToast(`Filtering by ${option}`); }}>
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="report-card-grid">
        {reportCards.map((report) => {
          const Icon = report.icon;
          return (
            <article className="report-card" key={report.id}>
              <header>
                <span className={`report-card-icon ${report.id}`}><Icon size={18} /></span>
                <button className="plain-icon" aria-label={`Export ${report.title} as PDF`} onClick={() => showToast(`Preparing "${report.title}" PDF export…`)}><FileDown size={16} /></button>
              </header>
              <div className="report-card-copy">
                <h3>{report.title}</h3>
                <p>{report.description}</p>
              </div>
              <div className="report-card-metric"><strong>{report.stat}</strong><span>{report.statLabel}</span></div>
              <button className="report-card-action" onClick={() => setActiveReport(report)}>View report <span>→</span></button>
            </article>
          );
        })}
      </div>

      <div className="report-appraisal-card">
          <header>
            <span className="report-card-icon appraisal"><Download size={18} /></span>
            <div>
              <h3>Appraisal Cycle Summary</h3>
              <p>Distribution of appraisal outcomes across the last completed performance cycle.</p>
            </div>
            <div>
              <button className="soft-button" onClick={() => showToast("Preparing \"Appraisal Cycle Summary\" PDF export…")}>
                <FileDown size={14} /> Export PDF
              </button>
            </div>
          </header>
          <div className="report-appraisal-body">
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {appraisalBands.map((band) => (
                <div key={band.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ width: 150, flex: "none", fontSize: 11, color: "#344054" }}>{band.label}</span>
                  <div style={{ flex: 1, height: 10, borderRadius: 9, background: "#ece8f2", overflow: "hidden" }}>
                    <div style={{ width: `${band.pct}%`, height: "100%", borderRadius: 9, background: band.color }} />
                  </div>
                  <span style={{ width: 34, flex: "none", textAlign: "right", fontSize: 11, fontWeight: 650, color: "#344054" }}>{band.pct}%</span>
                </div>
              ))}
            </div>
          </div>
      </div>

      {activeReport && (
        <div className="report-view-backdrop" onClick={() => setActiveReport(null)}>
        <div className="report-view" aria-live="polite" onClick={(event) => event.stopPropagation()}>
          <header>
            <div className="report-view-icon">{ActiveReportIcon && <ActiveReportIcon size={20} />}</div>
            <div><span>Interactive report</span><h2>{activeReport.title}</h2><p>{activeReport.description}</p></div>
            <button className="plain-icon" aria-label="Close report" onClick={() => setActiveReport(null)}><X size={18} /></button>
          </header>
          <div className="report-view-grid">
            <article><span>Current result</span><strong>{activeReport.stat}</strong><small>{activeReport.statLabel}</small></article>
            <article><span>Previous period</span><strong>{activeReport.id === "execution-health" ? "69" : activeReport.id === "portfolio-risk" ? "3" : "7"}</strong><small>Last quarter</small></article>
            <article><span>Change</span><strong className="report-change">+7.2%</strong><small>Period over period</small></article>
          </div>
          <div className="report-bars">
            {[64, 71, 68, 76, 73, 82].map((value, index) => <i key={index} style={{ height: `${value}%` }}><span>{value}</span></i>)}
          </div>
          <div className="report-view-footer"><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span></div>
          <button className="btn-primary" onClick={() => showToast(`Preparing "${activeReport.title}" PDF export…`)}><FileDown size={14} /> Export report</button>
        </div>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </>
  );
}
