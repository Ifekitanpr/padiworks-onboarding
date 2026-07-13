"use client";
import "../strategy.css";

import {
  AlertTriangle, BarChart3, Bot, CalendarDays, Check, CheckCircle2, ChevronRight,
  Circle, CircleHelp, Clock, Copy, DollarSign, FileText, Home, Lightbulb, LogOut, Megaphone,
  MessageSquare, Pencil, Plus, Search, Send, Settings, Sparkles, Target, Trash2, TrendingUp,
  UserCircle2, UserPlus, UsersRound, X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Avatar, DropdownMenu } from "@/components/dashboard/primitives";
import { AdminCenterShell } from "@/components/admin-center/admin-center-shell";
import type { AdminCenterPage } from "@/components/admin-center/types";
import { ReportsSection } from "@/components/dashboard/reports-section";

type ObjectiveType = "Strategic" | "Lagging Indicator" | "Financial KPI" | "Initiative" | "Brand Awareness";

type Objective = {
  id: string;
  title: string;
  progress: number;
  target: number;
  type: ObjectiveType;
  state: "On track" | "At risk" | "Behind";
  initials: string;
  color: string;
  completed: boolean;
  champion: string;
  coChampion: string;
  ownerName?: string;
};

type Priority = {
  id: string;
  title: string;
  tag: string;
  items: Objective[];
};

type ScopeTab = "Organization" | "Teams";
type Section = "Home" | "Strategy" | "Objectives" | "Teams" | "Reports" | "Insights" | "Admin Center";
type TeamMember = { id: string; name: string; role: string; initials: string; color: string };
type Collaborator = { id: string; name: string; role: string; initials: string; color: string };
type DetailTarget = { scope: ScopeTab; groupId: string; groupTitle: string; item: Objective };
type Risk = { id: string; title: string; severity: "Low" | "Medium" | "High"; note: string };
type InviteDraft = { name: string; email: string; role: string; access: string; team: string; message: string };

const initialRisks: Record<string, Risk[]> = {
  "ml-3": [{ id: "r-ml-3-1", title: "Brand lift campaign delayed by 3 weeks", severity: "Medium", note: "Creative review is bottlenecked on legal sign-off." }],
  "tt-2": [
    { id: "r-tt-2-1", title: "No dedicated data engineer assigned", severity: "High", note: "AI capability work is blocked without a hire or internal transfer." },
    { id: "r-tt-2-2", title: "Data quality issues in source systems", severity: "Medium", note: "Discovered during the first model training pass." },
  ],
  "pt-2": [{ id: "r-pt-2-1", title: "Drop-off root cause not yet isolated", severity: "Medium", note: "Waiting on session-replay tooling access." }],
  "gt-1": [{ id: "r-gt-1-1", title: "Referral incentive budget not yet approved", severity: "High", note: "Finance review pushed to next cycle." }],
};

const OBJECTIVE_TYPE_META: Record<ObjectiveType, { icon: typeof Target; bg: string; fg: string }> = {
  "Strategic": { icon: Target, bg: "#f0ecf9", fg: "#6941c6" },
  "Lagging Indicator": { icon: MessageSquare, bg: "#fce7f3", fg: "#db2777" },
  "Financial KPI": { icon: DollarSign, bg: "#dcfce7", fg: "#15803d" },
  "Initiative": { icon: FileText, bg: "#dbeafe", fg: "#1d4ed8" },
  "Brand Awareness": { icon: Megaphone, bg: "#fef3c7", fg: "#b45309" },
};

const initialOrgPriorities: Priority[] = [
  {
    id: "market-leadership",
    title: "Market Leadership",
    tag: "Strategic growth",
    items: [
      { id: "ml-1", title: "Continue top-line growth that outpaces the industry", progress: 20, target: 100, type: "Financial KPI", state: "On track", initials: "MD", ownerName: "Micheal D", color: "#ffd867", completed: false, champion: "Growth", coChampion: "Finance" },
      { id: "ml-2", title: "Lead the shift to sustainable, tech-forward products", progress: 50, target: 100, type: "Strategic", state: "On track", initials: "SN", ownerName: "Sadia N", color: "#ffc7d2", completed: false, champion: "Product", coChampion: "Engineering" },
      { id: "ml-3", title: "Become the top-of-mind brand for our category enthusiasts", progress: 60, target: 80, type: "Brand Awareness", state: "Behind", initials: "JR", ownerName: "John R", color: "#a8ddef", completed: false, champion: "Marketing", coChampion: "Growth" },
    ],
  },
  {
    id: "tech-transformation",
    title: "Tech Transformation",
    tag: "Transformation",
    items: [
      { id: "tt-1", title: "Modernise the core platform and improve delivery velocity", progress: 71, target: 100, type: "Initiative", state: "On track", initials: "AK", color: "#c9e6cc", completed: false, champion: "Engineering", coChampion: "Product" },
      { id: "tt-2", title: "Build an AI-ready data and capability foundation", progress: 42, target: 100, type: "Strategic", state: "At risk", initials: "BI", color: "#d9ccff", completed: false, champion: "Data & AI", coChampion: "Engineering" },
    ],
  },
];

const initialTeamPriorities: Priority[] = [
  {
    id: "product-team",
    title: "Product Team Roadmap",
    tag: "Team priority",
    items: [
      { id: "pt-1", title: "Ship v2 onboarding experience", progress: 82, target: 100, type: "Initiative", state: "On track", initials: "PW", color: "#ffe08b", completed: false, champion: "Product", coChampion: "Growth" },
      { id: "pt-2", title: "Reduce sign-up drop-off by 15%", progress: 34, target: 100, type: "Financial KPI", state: "At risk", initials: "TN", color: "#c6e8f4", completed: false, champion: "Growth", coChampion: "Product" },
    ],
  },
  {
    id: "growth-team",
    title: "Growth Team Roadmap",
    tag: "Team priority",
    items: [
      { id: "gt-1", title: "Launch referral program", progress: 19, target: 100, type: "Brand Awareness", state: "Behind", initials: "OJ", color: "#ffc7d2", completed: false, champion: "Growth", coChampion: "Marketing" },
    ],
  },
];

const initialTeamMembers: TeamMember[] = [
  { id: "m-md", name: "Maria Duarte", role: "VP Growth", initials: "MD", color: "#ffd867" },
  { id: "m-sa", name: "Samuel Ade", role: "Head of Product", initials: "SA", color: "#ffc7d2" },
  { id: "m-jt", name: "Jade Tan", role: "Brand Lead", initials: "JT", color: "#a8ddef" },
  { id: "m-ak", name: "Ade Kolade", role: "Engineering Lead", initials: "AK", color: "#c9e6cc" },
  { id: "m-bi", name: "Bisi Ibrahim", role: "Data & AI Lead", initials: "BI", color: "#d9ccff" },
  { id: "m-pw", name: "Priya Wong", role: "Product Manager", initials: "PW", color: "#ffe08b" },
  { id: "m-tn", name: "Tomi Nwosu", role: "Growth Marketer", initials: "TN", color: "#c6e8f4" },
  { id: "m-oj", name: "Ola James", role: "Lifecycle Marketer", initials: "OJ", color: "#ffc7d2" },
];

const initialCollaborators: Collaborator[] = [
  { id: "c-bi", initials: "BI", color: "#c5edaa", name: "Bisi Ibrahim", role: "Data & AI Lead" },
  { id: "c-ak", initials: "AK", color: "#ffe08b", name: "Ade Kolade", role: "Engineering Lead" },
  { id: "c-mi", initials: "MI", color: "#ffc7ca", name: "Michael Ita", role: "Finance Lead" },
  { id: "c-jt", initials: "JT", color: "#c6e8f4", name: "Jade Tan", role: "Brand Lead" },
  { id: "c-sa", initials: "SA", color: "#d8c8f1", name: "Samuel Ade", role: "Head of Product" },
];

const OWNER_NAMES: Record<string, string> = {
  MD: "Micheal D", SN: "Sadia N", JR: "John R", AK: "Ade Kolade", BI: "Bisi Ibrahim",
  SA: "Samuel Ade", JT: "Jade Tan", PW: "Priya Wong", TN: "Tomi Nwosu", OJ: "Ola James",
};

const PALETTE = ["#ffd867", "#ffc7d2", "#a8ddef", "#c9e6cc", "#d9ccff", "#ffe08b", "#c6e8f4"];
const TEAMS = ["Growth", "Product", "Engineering", "Marketing", "Data & AI", "Finance", "Customer Success"];

function pickChampionTeams(): { champion: string; coChampion: string } {
  const champion = TEAMS[Math.floor(Math.random() * TEAMS.length)];
  const rest = TEAMS.filter((team) => team !== champion);
  const coChampion = rest[Math.floor(Math.random() * rest.length)];
  return { champion, coChampion };
}

const notifications = [
  { id: 1, title: 'AK commented on "Build an AI-ready data foundation"', time: "2h ago" },
  { id: 2, title: "Strategy health score increased to 78", time: "6h ago" },
  { id: 3, title: 'JT marked "Become the top-of-mind brand" as Behind', time: "1d ago" },
];

const dateOptions = ["This week", "This month", "This quarter", "Custom range"];

const timelineMonths = ["July", "August", "September", "October", "November", "December"];
const TIMELINE_TODAY_PCT = 42;

const menuItems: { label: Section; icon: typeof Home; figma?: string }[] = [
  { label: "Home", icon: Home, figma: "home-03" },
  { label: "Strategy", icon: Target, figma: "target-sidebar" },
  { label: "Objectives", icon: BarChart3, figma: "bar-chart-08" },
  { label: "Teams", icon: UsersRound, figma: "users-03" },
  { label: "Reports", icon: FileText },
  { label: "Insights", icon: Lightbulb, figma: "lightbulb-03" },
  { label: "Admin Center", icon: Settings, figma: "settings-02" },
];

function hashSeed(id: string): number {
  let h = 0;
  for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return h;
}

function trendPoints(item: Objective): number[] {
  const seed = hashSeed(item.id);
  const points: number[] = [];
  let value = Math.max(0, item.progress - 25 - (seed % 25));
  for (let i = 0; i < 11; i++) {
    value = Math.min(item.progress, value + (item.progress - value) / (11 - i) + ((seed >> (i % 8)) % 5) - 1);
    points.push(Math.max(0, Math.round(value)));
  }
  points.push(item.progress);
  return points;
}

function Logo() {
  return <div className="brand-mark" aria-label="Padiworks"><FigmaIcon name="padiworks-logo" size={32} /></div>;
}

function FigmaIcon({ name, size = 18, className = "" }: { name: string; size?: number; className?: string }) {
  return (
    <span
      className={`figma-icon ${className}`.trim()}
      style={{
        width: size,
        height: size,
        WebkitMaskImage: `url(/images/dashboard/icons/${name}.svg)`,
        maskImage: `url(/images/dashboard/icons/${name}.svg)`,
      }}
    />
  );
}

function ObjectiveIcon({ type, size = 15, className = "" }: { type: ObjectiveType; size?: number; className?: string }) {
  const meta = OBJECTIVE_TYPE_META[type];
  const Icon = meta.icon;
  return <span className={`objective-icon ${className}`.trim()} style={{ background: meta.bg, color: meta.fg }}><Icon size={size} /></span>;
}

function TrendChart({ points }: { points: number[] }) {
  const w = 400, h = 120, pad = 12;
  const max = Math.max(...points, 10);
  const stepX = (w - pad * 2) / (points.length - 1);
  const coords = points.map((p, i) => [pad + i * stepX, h - pad - (p / max) * (h - pad * 2)] as const);
  const path = coords.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="trend-chart" preserveAspectRatio="none">
      <path d={path} fill="none" stroke="var(--padi)" strokeWidth="2" />
      {coords.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i === coords.length - 1 ? 4.5 : 2.5} fill={i === coords.length - 1 ? "#fff" : "var(--padi)"} stroke="var(--padi)" strokeWidth={i === coords.length - 1 ? 2 : 0} />
      ))}
    </svg>
  );
}

function ScoreCard({ score, title, note, delta, onView }: { score: number; title: string; note: string; delta: string; onView: () => void }) {
  return <article className="score-card">
    <div className="score-ring" style={{ "--score": `${score * 3.6}deg` } as React.CSSProperties}><span>{score}%</span></div>
    <div className="score-copy"><span className="ai-label"><Sparkles size={11} /> AI score</span><strong>{title}</strong><small>{delta} · {note}</small></div>
    <button aria-label={`View ${title}`} onClick={onView}><ChevronRight size={18} /></button>
  </article>;
}

function ObjectiveRow({
  item,
  groupId,
  groupTitle,
  scope,
  openMenu,
  onToggleMenu,
  onToggleComplete,
  onRemove,
  onOpenDetail,
}: {
  item: Objective;
  groupId: string;
  groupTitle: string;
  scope: ScopeTab;
  openMenu: string | null;
  onToggleMenu: (id: string) => void;
  onToggleComplete: (groupId: string, itemId: string) => void;
  onRemove: (groupId: string, itemId: string) => void;
  onOpenDetail: (scope: ScopeTab, groupId: string, groupTitle: string, item: Objective) => void;
}) {
  const behind = item.state !== "On track";
  return <div className={`objective-card${item.completed ? " completed" : ""}`} onClick={() => onOpenDetail(scope, groupId, groupTitle, item)}>
    <div className="objective-card-top">
      <div className="objective-card-main">
        <ObjectiveIcon type={item.type} size={24} />
        <div className="objective-card-title">
          <strong>{item.title}</strong>
          <span className="objective-card-tag">Top level OKR</span>
        </div>
      </div>
      <div onClick={(event) => event.stopPropagation()}>
        <DropdownMenu
          id={`objective-${groupId}-${item.id}`}
          openMenu={openMenu}
          onToggle={onToggleMenu}
          align="right"
          trigger={<button className="plain-icon" aria-label="Objective options"><FigmaIcon name="dots-horizontal" size={18} /></button>}
        >
          <button onClick={() => onToggleComplete(groupId, item.id)}>
            {item.completed ? <><Circle size={14} /> Mark as incomplete</> : <><CheckCircle2 size={14} /> Mark complete</>}
          </button>
          <div className="menu-divider" />
          <button className="danger" onClick={() => onRemove(groupId, item.id)}><Trash2 size={14} /> Remove objective</button>
        </DropdownMenu>
      </div>
    </div>
    <div className="objective-card-bottom">
      <div className="objective-meta">
        <FigmaIcon name="calendar" size={18} />
        <div className="objective-meta-text"><strong>Q3–Q4 Strategy Cycle</strong><span>Jul 01, 2026 – Dec 31, 2026</span></div>
      </div>
      <div className="objective-card-right">
        <div className="objective-owner">
          <Avatar initials={item.initials} color={item.color} />
          <div className="objective-owner-text"><strong>{item.ownerName ?? OWNER_NAMES[item.initials] ?? "Unassigned"}</strong><span>Owner</span></div>
        </div>
        <div className="objective-progress"><div><i className={behind ? "behind" : ""} style={{ width: `${item.progress}%` }} /></div><span>{item.progress}%</span></div>
        <div className={`objective-status ${behind ? "behind" : ""}`}><i />{item.state}</div>
      </div>
    </div>
  </div>;
}

function PriorityCard({
  group,
  scope,
  query,
  hideCompleted,
  openMenu,
  onToggleMenu,
  onRename,
  onDuplicate,
  onDelete,
  onAddObjective,
  onToggleComplete,
  onRemoveObjective,
  onOpenDetail,
}: {
  group: Priority;
  scope: ScopeTab;
  query: string;
  hideCompleted: boolean;
  openMenu: string | null;
  onToggleMenu: (id: string) => void;
  onRename: (groupId: string, currentTitle: string) => void;
  onDuplicate: (groupId: string) => void;
  onDelete: (groupId: string, title: string) => void;
  onAddObjective: (groupId: string) => void;
  onToggleComplete: (groupId: string, itemId: string) => void;
  onRemoveObjective: (groupId: string, itemId: string) => void;
  onOpenDetail: (scope: ScopeTab, groupId: string, groupTitle: string, item: Objective) => void;
}) {
  const [open, setOpen] = useState(group.id === "market-leadership");
  const visibleItems = group.items.filter(
    (item) => !(hideCompleted && item.completed) && item.title.toLowerCase().includes(query.toLowerCase())
  );
  return <section className="priority-card">
    <header>
      <span className="target-badge"><FigmaIcon name="target-04" size={24} /></span>
      <button className="priority-chevron" onClick={() => setOpen(!open)} aria-label="Toggle priority">
        <FigmaIcon name={open ? "chevron-down-purple" : "chevron-right-purple"} size={18} />
      </button>
      <div className="priority-heading"><h3>{group.title}</h3><span className="priority-tag">{group.tag}</span></div>
      <div className="priority-state">
        <button className="priority-add" aria-label="Add objective" onClick={() => onAddObjective(group.id)}><FigmaIcon name="plus" size={16} /></button>
        <span>Current</span>
        <DropdownMenu
          id={`priority-${group.id}`}
          openMenu={openMenu}
          onToggle={onToggleMenu}
          align="right"
          trigger={<button className="priority-status-pill" aria-label="Priority options"><i /> On track <FigmaIcon name="dots-horizontal" size={18} /></button>}
        >
          <button onClick={() => onRename(group.id, group.title)}><Pencil size={14} /> Rename</button>
          <button onClick={() => onDuplicate(group.id)}><Copy size={14} /> Duplicate</button>
          <div className="menu-divider" />
          <button className="danger" onClick={() => onDelete(group.id, group.title)}><Trash2 size={14} /> Delete priority</button>
        </DropdownMenu>
      </div>
    </header>
    {open && <div className="priority-body">
      <button className="priority-tree-add" aria-label={`Add objective to ${group.title}`} onClick={() => onAddObjective(group.id)}>
        <Plus size={20} />
      </button>
      {visibleItems.map((item) => (
        <ObjectiveRow
          key={item.id}
          item={item}
          groupId={group.id}
          groupTitle={group.title}
          scope={scope}
          openMenu={openMenu}
          onToggleMenu={onToggleMenu}
          onToggleComplete={onToggleComplete}
          onRemove={onRemoveObjective}
          onOpenDetail={onOpenDetail}
        />
      ))}
      {visibleItems.length === 0 && <p className="priority-empty">No objectives yet — use the + button to add one.</p>}
    </div>}
  </section>;
}

function TimelineSection({
  groups,
  scope,
  onOpenDetail,
}: {
  groups: Priority[];
  scope: ScopeTab;
  onOpenDetail: (scope: ScopeTab, groupId: string, groupTitle: string, item: Objective) => void;
}) {
  const objectives = groups.flatMap((group) => group.items);
  const statusCounts = {
    onTrack: objectives.filter((item) => item.state === "On track").length,
    atRisk: objectives.filter((item) => item.state === "At risk").length,
    behind: objectives.filter((item) => item.state === "Behind").length,
  };

  return (
    <div className="timeline-view rich">
      <div className="timeline-overview">
        <div>
          <span className="timeline-eyebrow">Q3–Q4 strategy cycle</span>
          <strong>Execution timeline</strong>
          <p>See when priorities overlap and where delivery needs attention.</p>
        </div>
        <div className="timeline-legend" aria-label="Timeline status summary">
          <span><i className="on-track" />On track <b>{statusCounts.onTrack}</b></span>
          <span><i className="at-risk" />At risk <b>{statusCounts.atRisk}</b></span>
          <span><i className="behind" />Behind <b>{statusCounts.behind}</b></span>
        </div>
      </div>
      <div className="timeline-scroll">
      <div className="timeline-header">
        <div className="timeline-name-col">Priority and objective</div>
        {timelineMonths.map((m) => <div key={m} className="timeline-month-col">{m}</div>)}
      </div>
      {groups.map((group) => (
        <div className="timeline-group" key={group.id}>
          <div className="timeline-row parent">
            <div className="timeline-name"><span className="timeline-priority-icon"><FigmaIcon name="target-04" size={15} /></span><span>{group.title}<small>{group.items.length} objective{group.items.length === 1 ? "" : "s"}</small></span></div>
            <div className="timeline-track">
              <div className="timeline-today-mark" style={{ left: `${TIMELINE_TODAY_PCT}%` }} />
              <i className="timeline-bar parent-bar" style={{ left: "3%", width: "92%" }} />
            </div>
          </div>
          {group.items.map((item) => {
            const seed = hashSeed(item.id);
            const left = 5 + (seed % 5) * 11;
            const width = 20 + (seed % 4) * 13;
            const behind = item.state === "Behind";
            const atRisk = item.state === "At risk";
            return (
              <div className="timeline-row child" key={item.id} onClick={() => onOpenDetail(scope, group.id, group.title, item)}>
                <div className="timeline-name"><ObjectiveIcon type={item.type} size={12} className="sm" /><span>{item.title}<small>{item.state} · {item.progress}% complete</small></span></div>
                <div className="timeline-track">
                  <div className="timeline-today-mark" style={{ left: `${TIMELINE_TODAY_PCT}%` }} />
                  <i className={`timeline-bar ${behind ? "behind" : atRisk ? "at-risk" : "on-track"}`} style={{ left: `${left}%`, width: `${width}%` }}>
                    <span>{item.progress}%</span>
                  </i>
                </div>
              </div>
            );
          })}
        </div>
      ))}
      {groups.length === 0 && <div className="timeline-empty"><CalendarDays size={22} /><strong>No timeline items found</strong><span>Clear your filters to see the strategy cycle.</span></div>}
      </div>
    </div>
  );
}

function HomeSection({
  priorityData,
  teamMembers,
  onNavigate,
}: {
  priorityData: Record<ScopeTab, Priority[]>;
  teamMembers: TeamMember[];
  onNavigate: (section: Section) => void;
}) {
  const allGroups = [...priorityData.Organization, ...priorityData.Teams];
  const allObjectives = allGroups.flatMap((g) => g.items);
  const onTrack = allObjectives.filter((o) => o.state === "On track").length;
  const pct = allObjectives.length ? Math.round((onTrack / allObjectives.length) * 100) : 0;

  return <>
    <div className="section-intro"><div><span>Workspace overview</span><h1>Good afternoon, Alex</h1><p>Here&apos;s where your organization&apos;s execution stands today.</p></div><button className="soft-button" onClick={() => onNavigate("Insights")}><Sparkles size={15} /> View AI insights</button></div>
    <div className="home-grid">
      <article className="stat-tile"><span>Strategic priorities</span><strong>{allGroups.length}</strong></article>
      <article className="stat-tile"><span>Active objectives</span><strong>{allObjectives.length}</strong></article>
      <article className="stat-tile"><span>On track</span><strong>{pct}%</strong></article>
      <article className="stat-tile"><span>Team members</span><strong>{teamMembers.length}</strong></article>
    </div>
    <p className="section-label">Jump back in</p>
    <div className="shortcut-list">
      <button onClick={() => onNavigate("Strategy")}><Target size={16} /><div><strong>Organization Strategy</strong><small>Review priorities and OKRs</small></div><ChevronRight size={15} /></button>
      <button onClick={() => onNavigate("Objectives")}><BarChart3 size={16} /><div><strong>Objectives</strong><small>See every objective in one list</small></div><ChevronRight size={15} /></button>
      <button onClick={() => onNavigate("Teams")}><UsersRound size={16} /><div><strong>Teams</strong><small>Manage your workspace roster</small></div><ChevronRight size={15} /></button>
      <button onClick={() => onNavigate("Insights")}><Lightbulb size={16} /><div><strong>Insights</strong><small>AI-generated recommendations</small></div><ChevronRight size={15} /></button>
    </div>
    <p className="section-label">Recent activity</p>
    <div className="activity-feed">
      {notifications.map((n) => <div key={n.id} className="activity-item"><Clock size={14} /><span>{n.title}</span><small>{n.time}</small></div>)}
    </div>
  </>;
}

type LeadMeasure = { id: string; text: string };
type OperationalKRA = {
  id: string;
  name: string;
  team: string;
  goal: string;
  lagMeasure: string;
  leadMeasures: LeadMeasure[];
};

const initialKRAs: OperationalKRA[] = [
  {
    id: "kra-retention",
    name: "Customer Retention",
    team: "Customer Success",
    goal: "Reduce monthly customer churn to under 3%",
    lagMeasure: "Monthly customer churn rate",
    leadMeasures: [
      { id: "lm-1", text: "Onboarding completion rate within 7 days of signup" },
      { id: "lm-2", text: "Support ticket first-response time under 4 hours" },
    ],
  },
  {
    id: "kra-efficiency",
    name: "Operational Efficiency",
    team: "Engineering",
    goal: "Cut average process cycle time by 20%",
    lagMeasure: "Average cycle time (days)",
    leadMeasures: [
      { id: "lm-3", text: "% of processes with a documented SOP" },
    ],
  },
  {
    id: "kra-hiring",
    name: "Hiring Velocity",
    team: "People",
    goal: "Fill open engineering roles in under 45 days",
    lagMeasure: "Average time-to-fill (days)",
    leadMeasures: [],
  },
];

function OperationalObjectivesPanel() {
  const [kras, setKras] = useState<OperationalKRA[]>(initialKRAs);
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  function updateField(id: string, field: "name" | "team" | "goal" | "lagMeasure", value: string) {
    setKras((current) => current.map((kra) => (kra.id === id ? { ...kra, [field]: value } : kra)));
  }

  function addLeadMeasure(kraId: string) {
    const text = (drafts[kraId] ?? "").trim();
    if (!text) return;
    setKras((current) =>
      current.map((kra) =>
        kra.id === kraId ? { ...kra, leadMeasures: [...kra.leadMeasures, { id: `lm-${Date.now()}`, text }] } : kra
      )
    );
    setDrafts((current) => ({ ...current, [kraId]: "" }));
  }

  function removeLeadMeasure(kraId: string, leadId: string) {
    setKras((current) =>
      current.map((kra) =>
        kra.id === kraId ? { ...kra, leadMeasures: kra.leadMeasures.filter((lead) => lead.id !== leadId) } : kra
      )
    );
  }

  function addKRA() {
    const id = `kra-${Date.now()}`;
    setKras((current) => [
      ...current,
      { id, name: "New KRA", team: "Unassigned", goal: "Define the goal for this KRA", lagMeasure: "Define the outcome measure", leadMeasures: [] },
    ]);
  }

  function removeKRA(id: string) {
    setKras((current) => current.filter((kra) => kra.id !== id));
  }

  return (
    <>
      <div className="objective-filter-bar">
        <p className="section-label" style={{ margin: 0 }}>{kras.length} KRA{kras.length === 1 ? "" : "s"}</p>
        <button className="soft-button" onClick={addKRA}><Plus size={15} /> Add KRA</button>
      </div>
      {kras.map((kra) => (
        <div className="kra-card" key={kra.id}>
          <div className="kra-card-header">
            <input
              className="text-input"
              style={{ height: 36, fontWeight: 650, fontSize: 13, maxWidth: 260 }}
              value={kra.name}
              onChange={(event) => updateField(kra.id, "name", event.target.value)}
              aria-label="KRA name"
            />
            <span className="priority-tag">{kra.team}</span>
            <button className="plain-icon" aria-label={`Delete ${kra.name}`} onClick={() => removeKRA(kra.id)} style={{ marginLeft: "auto" }}><Trash2 size={15} /></button>
          </div>
          <div className="field-group">
            <div className="field-label-row"><span className="field-label">Goal</span></div>
            <input className="text-input" value={kra.goal} onChange={(event) => updateField(kra.id, "goal", event.target.value)} />
          </div>
          <div className="lag-lead-row">
            <span className="lag-lead-tag lag">Lag</span>
            <input className="text-input" style={{ height: 36 }} value={kra.lagMeasure} onChange={(event) => updateField(kra.id, "lagMeasure", event.target.value)} placeholder="Outcome measure (uncontrollable)" />
          </div>
          {kra.leadMeasures.map((lead) => (
            <div className="lag-lead-row" key={lead.id}>
              <span className="lag-lead-tag lead">Lead</span>
              <span style={{ flex: 1, fontSize: 12, color: "#344054" }}>{lead.text}</span>
              <button className="plain-icon" aria-label="Remove lead measure" onClick={() => removeLeadMeasure(kra.id, lead.id)}><X size={14} /></button>
            </div>
          ))}
          <div className="chip-add-row">
            <input
              className="text-input"
              placeholder="Add a lead measure (controllable input)…"
              value={drafts[kra.id] ?? ""}
              onChange={(event) => setDrafts((current) => ({ ...current, [kra.id]: event.target.value }))}
              onKeyDown={(event) => { if (event.key === "Enter") addLeadMeasure(kra.id); }}
            />
            <button className="soft-button" onClick={() => addLeadMeasure(kra.id)}>Add</button>
          </div>
          {kra.leadMeasures.length === 0 && (
            <div className="validation-banner" style={{ marginTop: 12, marginBottom: 0 }}>
              <CircleHelp size={16} />
              <span>This lag measure has no lead measures yet — a Key Result Area can&apos;t be activated without at least one controllable input driving the outcome.</span>
            </div>
          )}
        </div>
      ))}
    </>
  );
}

function ObjectivesSection({
  priorityData,
  onToggleComplete,
  onRemove,
  onOpenDetail,
}: {
  priorityData: Record<ScopeTab, Priority[]>;
  onToggleComplete: (scope: ScopeTab, groupId: string, itemId: string) => void;
  onRemove: (scope: ScopeTab, groupId: string, itemId: string) => void;
  onOpenDetail: (scope: ScopeTab, groupId: string, groupTitle: string, item: Objective) => void;
}) {
  const [objectiveTab, setObjectiveTab] = useState<"OKRs" | "Operational Objectives">("OKRs");
  const [filter, setFilter] = useState<"All" | "On track" | "At risk" | "Behind">("All");
  const [search, setSearch] = useState("");
  const rows = (["Organization", "Teams"] as ScopeTab[]).flatMap((scope) =>
    priorityData[scope].flatMap((group) => group.items.map((item) => ({ scope, group, item })))
  ).filter(
    ({ item }) => (filter === "All" || item.state === filter) && item.title.toLowerCase().includes(search.toLowerCase())
  );

  return <>
    <div className="section-intro"><div><span>Execution management</span><h1>Objectives</h1><p>Review ownership, progress, and risk across every strategic outcome.</p></div></div>
    <div className="objective-summary-grid">
      <article><span>Total objectives</span><strong>{rows.length}</strong></article>
      <article><span>On track</span><strong>{rows.filter(({ item }) => item.state === "On track").length}</strong></article>
      <article><span>Needs attention</span><strong>{rows.filter(({ item }) => item.state !== "On track").length}</strong></article>
    </div>
    <div className="view-tabs">
      <button className={objectiveTab === "OKRs" ? "active" : ""} onClick={() => setObjectiveTab("OKRs")}>OKRs</button>
      <button className={objectiveTab === "Operational Objectives" ? "active" : ""} onClick={() => setObjectiveTab("Operational Objectives")}>Operational Objectives</button>
    </div>

    {objectiveTab === "OKRs" ? <>
      <div className="objective-filter-bar">
        <label className="header-search inline-search"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search objectives" /></label>
        <div className="scope-tabs">
          {(["All", "On track", "At risk", "Behind"] as const).map((f) => (
            <button key={f} className={filter === f ? "active" : ""} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
      </div>
      <p className="section-label">{rows.length} objective{rows.length === 1 ? "" : "s"}</p>
      <div className="priority-list">
        {rows.map(({ scope, group, item }) => {
          const behind = item.state !== "On track";
          return (
            <div key={`${scope}-${item.id}`} className={`objective-card${item.completed ? " completed" : ""}`} onClick={() => onOpenDetail(scope, group.id, group.title, item)}>
              <div className="objective-card-top">
                <div className="objective-card-main">
                  <ObjectiveIcon type={item.type} size={24} />
                  <div className="objective-card-title">
                    <strong>{item.title}</strong>
                    <span className="objective-card-tag">{group.title}</span>
                    <span className="objective-card-tag scope">{scope}</span>
                  </div>
                </div>
                <div onClick={(event) => event.stopPropagation()} style={{ display: "flex", gap: 2 }}>
                  <button className="plain-icon" aria-label="Toggle complete" onClick={() => onToggleComplete(scope, group.id, item.id)}>{item.completed ? <Circle size={16} /> : <CheckCircle2 size={16} />}</button>
                  <button className="plain-icon" aria-label="Remove" onClick={() => onRemove(scope, group.id, item.id)}><Trash2 size={16} /></button>
                </div>
              </div>
              <div className="objective-card-bottom">
                <div className="objective-meta">
                  <UsersRound size={16} />
                  <div className="objective-meta-text"><strong>{item.champion}</strong><span>Co-champion: {item.coChampion}</span></div>
                </div>
                <div className="objective-card-right">
                  <div className="objective-owner">
                    <Avatar initials={item.initials} color={item.color} />
                    <div className="objective-owner-text"><strong>{item.ownerName ?? OWNER_NAMES[item.initials] ?? "Unassigned"}</strong><span>Owner</span></div>
                  </div>
                  <div className="objective-progress"><div><i className={behind ? "behind" : ""} style={{ width: `${item.progress}%` }} /></div><span>{item.progress}%</span></div>
                  <div className={`objective-status ${behind ? "behind" : ""}`}><i />{item.state}</div>
                </div>
              </div>
            </div>
          );
        })}
        {rows.length === 0 && <div className="empty-state"><Search size={24} /><strong>No objectives found</strong><span>Try a different filter or search term.</span></div>}
      </div>
    </> : <OperationalObjectivesPanel />}
  </>;
}

function TeamsSection({
  members,
  onInvite,
  onRemove,
  onChangeRole,
  onOpenMember,
}: {
  members: TeamMember[];
  onInvite: () => void;
  onRemove: (id: string, name: string) => void;
  onChangeRole: (id: string, currentRole: string) => void;
  onOpenMember: (member: TeamMember) => void;
}) {
  const leadership = members.filter((member) => /lead|head|vp/i.test(member.role)).length;
  return <>
    <div className="section-intro"><div><span>People and ownership</span><h1>Teams</h1><p>Manage the people accountable for turning strategy into measurable outcomes.</p></div><button className="soft-button" onClick={onInvite}><UserPlus size={15} /> Invite teammate</button></div>
    <div className="team-summary-grid">
      <article><UsersRound size={17} /><div><span>Team members</span><strong>{members.length}</strong></div></article>
      <article><Target size={17} /><div><span>Objective owners</span><strong>{members.filter((member) => ["MD","SN","JR","AK","BI"].includes(member.initials)).length}</strong></div></article>
      <article><UserCircle2 size={17} /><div><span>Leadership roles</span><strong>{leadership}</strong></div></article>
    </div>
    <div className="objective-filter-bar">
      <div><p className="section-label" style={{ margin: 0 }}>Workspace directory</p><span className="team-count">{members.length} active members</span></div>
    </div>
    <div className="team-roster">
      {members.map((member) => (
        <div key={member.id} className="team-row" onClick={() => onOpenMember(member)}>
          <Avatar initials={member.initials} color={member.color} />
          <div><strong>{member.name}</strong><span>{member.role}</span><small>{["MD","SA","JT","AK","BI"].includes(member.initials) ? "Owns active objectives" : "Workspace contributor"}</small></div>
          <span className="member-status"><i /> Active</span>
          <button className="plain-icon" aria-label="Change role" onClick={(event) => { event.stopPropagation(); onChangeRole(member.id, member.role); }}><Pencil size={15} /></button>
          <button className="plain-icon" aria-label="Remove teammate" onClick={(event) => { event.stopPropagation(); onRemove(member.id, member.name); }}><Trash2 size={15} /></button>
        </div>
      ))}
    </div>
  </>;
}

function InsightsSection({
  messages,
  draft,
  setDraft,
  onSend,
}: {
  messages: { role: "user" | "assistant"; text: string }[];
  draft: string;
  setDraft: (value: string) => void;
  onSend: () => void;
}) {
  return <>
    <div className="section-intro insights-intro"><div><span>Execution intelligence</span><h1>Insights</h1><p>Signals, risks, and recommended actions generated from your current strategy.</p></div><span className="live-signal"><i /> Live analysis</span></div>
    <div className="insight-signal-grid">
      <article><TrendingUp size={18} /><div><span>Strategy health</span><strong>78%</strong><small>+4 this week</small></div></article>
      <article><AlertTriangle size={18} /><div><span>Objectives at risk</span><strong>3</strong><small>Across 2 priorities</small></div></article>
      <article><UsersRound size={18} /><div><span>Ownership gaps</span><strong>2</strong><small>Need an accountable owner</small></div></article>
    </div>
    <section className="ai-summary">
      <span><Sparkles size={13} /> Executive insight</span>
      <h2>Your strategy is clear, but execution is uneven.</h2>
      <p>Market Leadership is healthy. Tech Transformation is under-supported by capability and ownership signals.</p>
    </section>
    <div className="recommendations">
      <h3>Recommended actions</h3>
      <article><b>01</b><div><strong>Clarify transformation ownership</strong><p>Two objectives have contributors but no single accountable owner.</p></div></article>
      <article><b>02</b><div><strong>Connect work to outcomes</strong><p>11 active work items are not linked to a strategic priority.</p></div></article>
      <article><b>03</b><div><strong>Close the AI capability gap</strong><p>Create a development objective for data and AI readiness.</p></div></article>
    </div>
    <div className="insight-detail-grid">
      <section className="insight-panel">
        <header><div><span>Portfolio signals</span><h3>Risk concentration</h3></div><AlertTriangle size={17} /></header>
        <div className="risk-row"><div><strong>Tech Transformation</strong><span>2 objectives need attention</span></div><b className="risk-high">High</b></div>
        <div className="risk-row"><div><strong>Market Leadership</strong><span>1 objective is behind</span></div><b className="risk-medium">Medium</b></div>
        <div className="risk-row"><div><strong>Product Team</strong><span>Healthy ownership signals</span></div><b className="risk-low">Low</b></div>
      </section>
      <section className="insight-panel">
        <header><div><span>Weekly movement</span><h3>Execution pulse</h3></div><TrendingUp size={17} /></header>
        <div className="pulse-chart">{[36,52,48,64,58,72,78].map((height,index)=><i key={index} style={{height:`${height}%`}} />)}</div>
        <p>Alignment improved by <strong>6 points</strong> over the last seven check-ins.</p>
      </section>
    </div>
    <p className="section-label">Ask Padi AI</p>
    <div className="insights-chat">
      {messages.length === 0 && <p className="priority-empty">Ask about scores, risk, or what to prioritize next.</p>}
      {messages.length === 0 && <div className="insight-prompts">
        {["What needs attention this week?", "Where are teams misaligned?", "Summarise portfolio risk"].map((prompt) => <button key={prompt} onClick={() => setDraft(prompt)}>{prompt}</button>)}
      </div>}
      {messages.length > 0 && <div className="chat-log inline">{messages.map((m, i) => <div key={i} className={`chat-bubble ${m.role}`}>{m.text}</div>)}</div>}
      <label className="ask-padi inline">
        <input placeholder="Ask about this strategy…" value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") onSend(); }} />
        <button onClick={onSend}><ChevronRight size={17} /></button>
      </label>
    </div>
  </>;
}

export default function DashboardPage() {
  const router = useRouter();
  const [section, setSection] = useState<Section>("Strategy");
  const [tab, setTab] = useState<ScopeTab>("Organization");
  const [view, setView] = useState<"Planner" | "Timeline">("Planner");
  const [hideCompleted, setHideCompleted] = useState(false);
  const [tour, setTour] = useState(false);
  const [query, setQuery] = useState("");
  const [insightsOpen, setInsightsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [helpDraft, setHelpDraft] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [unread, setUnread] = useState(3);
  const [dateRange, setDateRange] = useState("No date range applied");
  const [sortDir, setSortDir] = useState<"asc" | "desc" | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; text: string }[]>([]);
  const [draft, setDraft] = useState("");
  const [promptModal, setPromptModal] = useState<{ heading: string; label: string; confirmLabel: string; onSubmit: (value: string) => void; kind?: "priority" | "objective"; context?: string } | null>(null);
  const [promptValue, setPromptValue] = useState("");
  const [confirmModal, setConfirmModal] = useState<{ heading: string; message: string; confirmLabel: string; onConfirm: () => void } | null>(null);
  const [priorityData, setPriorityData] = useState<Record<ScopeTab, Priority[]>>({
    Organization: initialOrgPriorities,
    Teams: initialTeamPriorities,
  });
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers);
  const [collaborators, setCollaborators] = useState<Collaborator[]>(initialCollaborators);
  const [adminTarget, setAdminTarget] = useState<AdminCenterPage>("Strategy Setup");
  const [memberDetail, setMemberDetail] = useState<TeamMember | null>(null);
  const [detailItem, setDetailItem] = useState<DetailTarget | null>(null);
  const [detailTab, setDetailTab] = useState<"Details" | "Updates" | "Risks" | "Relationships">("Details");
  const [comments, setComments] = useState<Record<string, { author: string; text: string; time: string }[]>>({});
  const [commentDraft, setCommentDraft] = useState("");
  const [risks, setRisks] = useState<Record<string, Risk[]>>(initialRisks);
  const [riskDraft, setRiskDraft] = useState("");
  const [riskSeverityDraft, setRiskSeverityDraft] = useState<Risk["severity"]>("Medium");
  const [progressModal, setProgressModal] = useState<{ scope: ScopeTab; groupId: string; itemId: string } | null>(null);
  const [progressValue, setProgressValue] = useState(0);
  const [progressCheckinDraft, setProgressCheckinDraft] = useState("");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteDraft, setInviteDraft] = useState<InviteDraft>({ name: "", email: "", role: "Team member", access: "Contributor", team: "Product", message: "" });

  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (!(event.target as HTMLElement).closest(".menu-wrap")) setOpenMenu(null);
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  function showToast(message: string) {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }

  function handleToggleMenu(id: string) {
    setOpenMenu((current) => {
      const next = current === id ? null : id;
      if (id === "bell" && next === "bell") setUnread(0);
      return next;
    });
  }

  function updateList(scope: ScopeTab, updater: (list: Priority[]) => Priority[]) {
    setPriorityData((prev) => ({ ...prev, [scope]: updater(prev[scope]) }));
  }

  function updateActiveList(updater: (list: Priority[]) => Priority[]) {
    updateList(tab, updater);
  }

  function addPriority() {
    setPromptValue("");
    setPromptModal({
      heading: "Add strategic priority",
      label: "Priority name",
      confirmLabel: "Add priority",
      kind: "priority",
      context: tab === "Organization" ? "Organization strategy" : "Team strategy",
      onSubmit: (title) => {
        const group: Priority = { id: `p-${Date.now()}`, title, tag: "Custom", items: [] };
        updateActiveList((list) => [group, ...list]);
        showToast(`Added "${title}"`);
      },
    });
  }

  function renameGroup(groupId: string, currentTitle: string) {
    setOpenMenu(null);
    setPromptValue(currentTitle);
    setPromptModal({
      heading: "Rename priority",
      label: "Priority name",
      confirmLabel: "Save",
      onSubmit: (title) => {
        updateActiveList((list) => list.map((g) => (g.id === groupId ? { ...g, title } : g)));
      },
    });
  }

  function duplicateGroup(groupId: string) {
    updateActiveList((list) => {
      const group = list.find((g) => g.id === groupId);
      if (!group) return list;
      const copy: Priority = {
        ...group,
        id: `p-${Date.now()}`,
        title: `${group.title} (copy)`,
        items: group.items.map((item) => ({ ...item, id: `o-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` })),
      };
      const index = list.findIndex((g) => g.id === groupId);
      const next = [...list];
      next.splice(index + 1, 0, copy);
      return next;
    });
    showToast("Priority duplicated");
    setOpenMenu(null);
  }

  function deleteGroup(groupId: string, title: string) {
    setOpenMenu(null);
    setConfirmModal({
      heading: "Delete priority",
      message: `Delete "${title}"? This can't be undone.`,
      confirmLabel: "Delete",
      onConfirm: () => {
        updateActiveList((list) => list.filter((g) => g.id !== groupId));
        showToast("Priority deleted");
      },
    });
  }

  function addObjective(groupId: string, scope: ScopeTab = tab) {
    setOpenMenu(null);
    setPromptValue("");
    setPromptModal({
      heading: "Add objective",
      label: "Objective title",
      confirmLabel: "Add objective",
      kind: "objective",
      context: priorityData[scope].find((group) => group.id === groupId)?.title ?? "Strategic priority",
      onSubmit: (title) => {
        const initials = title.split(/\s+/).map((word) => word[0]).join("").slice(0, 2).toUpperCase() || "NA";
        const color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
        const item: Objective = { id: `o-${Date.now()}`, title, progress: 0, target: 100, type: "Initiative", state: "On track", initials, color, completed: false, ...pickChampionTeams() };
        updateList(scope, (list) => list.map((g) => (g.id === groupId ? { ...g, items: [item, ...g.items] } : g)));
        showToast("Objective added");
      },
    });
  }

  function toggleObjectiveComplete(scope: ScopeTab, groupId: string, itemId: string) {
    updateList(scope, (list) =>
      list.map((g) => (g.id === groupId ? { ...g, items: g.items.map((item) => (item.id === itemId ? { ...item, completed: !item.completed } : item)) } : g))
    );
    setOpenMenu(null);
  }

  function removeObjective(scope: ScopeTab, groupId: string, itemId: string) {
    updateList(scope, (list) => list.map((g) => (g.id === groupId ? { ...g, items: g.items.filter((item) => item.id !== itemId) } : g)));
    showToast("Objective removed");
    setOpenMenu(null);
  }

  function reorderPlan() {
    const dir = sortDir === "asc" ? "desc" : "asc";
    updateActiveList((list) => [...list].sort((a, b) => (dir === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title))));
    setSortDir(dir);
    showToast(`Sorted ${dir === "asc" ? "A → Z" : "Z → A"}`);
  }

  function sendMessage() {
    const text = draft.trim();
    if (!text) return;
    setMessages((current) => [...current, { role: "user", text }]);
    setDraft("");
    setTimeout(() => {
      setMessages((current) => [
        ...current,
        { role: "assistant", text: 'Here\'s a quick take: focus first on unblocking "Build an AI-ready data and capability foundation" — it\'s the biggest drag on your execution alignment score.' },
      ]);
    }, 500);
  }

  function sendHelpMessage() {
    const text = helpDraft.trim();
    if (!text) return;
    setHelpDraft("");
    setHelpOpen(false);
    showToast("Message sent to support — we'll reply by email");
  }

  function inviteCollaborator() {
    setPromptValue("");
    setPromptModal({
      heading: "Invite collaborator",
      label: "Full name",
      confirmLabel: "Send invite",
      onSubmit: (name) => {
        const initials = name.split(/\s+/).map((word) => word[0]).join("").slice(0, 2).toUpperCase() || "NA";
        const color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
        setCollaborators((current) => [...current, { id: `c-${Date.now()}`, initials, color, name, role: "Collaborator" }]);
        showToast(`Invited ${name}`);
      },
    });
  }

  function inviteTeamMember() {
    setInviteDraft({ name: "", email: "", role: "Team member", access: "Contributor", team: "Product", message: "" });
    setInviteOpen(true);
  }

  function submitTeamInvite(event: React.FormEvent) {
    event.preventDefault();
    const name = inviteDraft.name.trim();
    const email = inviteDraft.email.trim();
    if (!name || !/^\S+@\S+\.\S+$/.test(email)) return;
    const initials = name.split(/\s+/).map((word) => word[0]).join("").slice(0, 2).toUpperCase() || "NA";
    const color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
    setTeamMembers((current) => [...current, { id: `m-${Date.now()}`, name, role: inviteDraft.role, initials, color }]);
    setInviteOpen(false);
    showToast(`Invitation sent to ${email}`);
  }

  function changeMemberRole(id: string, currentRole: string) {
    setPromptValue(currentRole);
    setPromptModal({
      heading: "Change role",
      label: "Role",
      confirmLabel: "Save",
      onSubmit: (role) => setTeamMembers((current) => current.map((m) => (m.id === id ? { ...m, role } : m))),
    });
  }

  function removeMember(id: string, name: string) {
    setConfirmModal({
      heading: "Remove teammate",
      message: `Remove ${name} from the workspace?`,
      confirmLabel: "Remove",
      onConfirm: () => {
        setTeamMembers((current) => current.filter((m) => m.id !== id));
        showToast(`${name} removed`);
      },
    });
  }

  function startGuidedTour() {
    setTour(false);
    const steps = [
      "Step 1 of 4 — Set your top strategic priorities here.",
      "Step 2 of 4 — Objectives roll up under each priority.",
      "Step 3 of 4 — Ask Padi AI anytime for an executive read on your strategy.",
      "Step 4 of 4 — Check Objectives, Teams, and Insights from the sidebar.",
    ];
    steps.forEach((text, i) => setTimeout(() => showToast(text), i * 2200));
  }

  function submitPromptModal(event: React.FormEvent) {
    event.preventDefault();
    const value = promptValue.trim();
    if (!value || !promptModal) return;
    promptModal.onSubmit(value);
    setPromptModal(null);
  }

  function openDetail(scope: ScopeTab, groupId: string, groupTitle: string, item: Objective) {
    setDetailItem({ scope, groupId, groupTitle, item });
    setDetailTab("Details");
  }

  function ownerName(initials: string) {
    return teamMembers.find((m) => m.initials === initials)?.name ?? OWNER_NAMES[initials] ?? "Unassigned";
  }

  function addComment() {
    const text = commentDraft.trim();
    if (!text || !detailItem) return;
    setComments((current) => ({
      ...current,
      [detailItem.item.id]: [...(current[detailItem.item.id] ?? []), { author: "Alex Adeyemi", text, time: "Just now" }],
    }));
    setCommentDraft("");
  }

  function addRisk() {
    const title = riskDraft.trim();
    if (!title || !detailItem) return;
    const itemId = detailItem.item.id;
    const severity = riskSeverityDraft;
    setRisks((current) => {
      const existing = current[itemId] ?? [];
      const risk: Risk = { id: `risk-${itemId}-${existing.length + 1}`, title, severity, note: "" };
      return { ...current, [itemId]: [...existing, risk] };
    });
    setRiskDraft("");
    setRiskSeverityDraft("Medium");
    showToast("Risk flagged");
  }

  function removeRisk(riskId: string) {
    if (!detailItem) return;
    setRisks((current) => ({
      ...current,
      [detailItem.item.id]: (current[detailItem.item.id] ?? []).filter((risk) => risk.id !== riskId),
    }));
    showToast("Risk resolved");
  }

  function openProgressModal() {
    if (!detailItem) return;
    setProgressValue(detailItem.item.progress);
    setProgressCheckinDraft("");
    setProgressModal({ scope: detailItem.scope, groupId: detailItem.groupId, itemId: detailItem.item.id });
  }

  function saveProgress() {
    if (!progressModal) return;
    const { scope, groupId, itemId } = progressModal;
    const previousProgress = detailItem?.item.id === itemId ? detailItem.item.progress : null;
    updateList(scope, (list) => list.map((g) => (g.id === groupId ? { ...g, items: g.items.map((it) => (it.id === itemId ? { ...it, progress: progressValue } : it)) } : g)));
    setDetailItem((current) => (current && current.item.id === itemId ? { ...current, item: { ...current.item, progress: progressValue } } : current));
    if (previousProgress !== null && previousProgress !== progressValue) {
      const note = progressCheckinDraft.trim();
      const direction = progressValue > previousProgress ? "up" : "down";
      const text = `Progress moved ${direction} from ${previousProgress}% to ${progressValue}%.${note ? ` ${note}` : ""}`;
      setComments((current) => ({
        ...current,
        [itemId]: [...(current[itemId] ?? []), { author: "Alex Adeyemi", text, time: "Just now" }],
      }));
    }
    setProgressCheckinDraft("");
    setProgressModal(null);
    showToast("Progress updated");
  }

  const activeList = priorityData[tab];
  const visibleGroups = activeList.filter(
    (group) =>
      group.title.toLowerCase().includes(query.toLowerCase()) ||
      group.items.some((item) => item.title.toLowerCase().includes(query.toLowerCase()))
  );

  const visibleCollaborators = collaborators.slice(0, 5);
  const collaboratorOverflow = collaborators.length - visibleCollaborators.length;

  return <div className="strategy-app">
    <aside className="slim-sidebar">
      <Logo />
      <button className="workspace-switcher active" aria-label="Current workspace"><span>PW</span></button>
      <button className="sidebar-create" aria-label="Create" onClick={() => setCreateOpen(true)}><FigmaIcon name="plus-dark" size={16} /></button>
      <hr className="sidebar-divider" />
      <nav>
        {menuItems.map(({ label, icon: Icon, figma }) => (
          <button key={label} className={section === label ? "active" : ""} aria-label={label} title={label} onClick={() => setSection(label)}>
            {figma ? <FigmaIcon name={figma} size={18} /> : <Icon size={18} />}
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </aside>

    <main>
      <div className="trial-banner">
        <span>Your free trial <strong>remains 14 days</strong></span>
        <span>·</span>
        <button onClick={() => showToast("Upgrade flow coming soon")}>Upgrade plan</button>
      </div>
      <header className="topbar">
        <div className="breadcrumb">
          <div className="breadcrumb-nav">
            <button aria-label="Back" onClick={() => router.back()}><FigmaIcon name="arrow-narrow-left" size={16} /></button>
            <button aria-label="Forward" onClick={() => router.forward()}><FigmaIcon name="arrow-narrow-right" size={16} /></button>
          </div>
          <div className="breadcrumb-divider" />
          <div className="breadcrumb-path">
            <span>All Workspaces</span>
            <FigmaIcon name="breadcrumb-indicator" size={16} />
            <strong>Epa&apos;s Workspace</strong>
          </div>
        </div>
        <div className="top-actions">
          <DropdownMenu
            id="bell"
            openMenu={openMenu}
            onToggle={handleToggleMenu}
            align="right"
            className="notif-panel"
            trigger={<button className="bell" aria-label="Notifications"><FigmaIcon name="bell-01" size={20} />{unread > 0 && <i />}</button>}
          >
            <div className="notif-header">Notifications</div>
            {notifications.map((n) => <div key={n.id} className="notif-item"><strong>{n.title}</strong><span>{n.time}</span></div>)}
          </DropdownMenu>
          <button className="insights-button" aria-label="Ask Padi AI" onClick={() => setInsightsOpen(true)}><FigmaIcon name="ai-magic" size={20} /></button>
          <DropdownMenu
            id="profile"
            openMenu={openMenu}
            onToggle={handleToggleMenu}
            align="right"
            trigger={<div className="profile-trigger"><span className="avatar-wrap"><Avatar initials="AL" color="#e9e2f8" /><i className="status-dot" /></span><FigmaIcon name="chevron-down" size={16} /></div>}
          >
            <div className="notif-header">Alex Adeyemi</div>
            <button onClick={() => { setAdminTarget("Account & Profile"); setSection("Admin Center"); setOpenMenu(null); }}><UserCircle2 size={14} /> View profile</button>
            <button onClick={() => { setAdminTarget("Account & Profile"); setSection("Admin Center"); setOpenMenu(null); }}><Settings size={14} /> Account settings</button>
            <button onClick={() => { setHelpOpen(true); setOpenMenu(null); }}><CircleHelp size={14} /> Help & support</button>
            <div className="menu-divider" />
            <button className="danger" onClick={() => router.push("/login")}><LogOut size={14} /> Log out</button>
          </DropdownMenu>
        </div>
      </header>

      <div className="workspace">
        {section === "Home" && <HomeSection priorityData={priorityData} teamMembers={teamMembers} onNavigate={setSection} />}

        {section === "Strategy" && <>
          <div className="strategy-page-heading">
            <div><span>Organization strategy</span><h1>Turn priorities into measurable execution</h1><p>Connect strategic direction, accountable owners, and progress signals in one place.</p></div>
            <div className="strategy-cycle-card"><CalendarDays size={17} /><div><span>Active cycle</span><strong>Q3–Q4 2026</strong><small>Jul 01 – Dec 31</small></div></div>
          </div>
          <div className="scope-row">
            <div className="scope-switch">
              <button className={tab === "Organization" ? "active" : ""} onClick={() => setTab("Organization")}>Organization</button>
              <button className={tab === "Teams" ? "active" : ""} onClick={() => setTab("Teams")}>Teams</button>
            </div>

            <DropdownMenu
              id="collaborators"
              openMenu={openMenu}
              onToggle={handleToggleMenu}
              align="right"
              className="notif-panel"
              trigger={<div className="collaborators"><span>Owners and collaborators</span><div>{visibleCollaborators.map((c) => <Avatar key={c.id} initials={c.initials} color={c.color} />)}{collaboratorOverflow > 0 && <span className="avatar-overflow">+{collaboratorOverflow}</span>}</div></div>}
            >
              <div className="notif-header">Collaborators</div>
              {collaborators.map((c) => <div key={c.id} className="notif-item"><strong>{c.name}</strong><span>{c.role}</span></div>)}
              <div className="menu-divider" />
              <button onClick={() => { setOpenMenu(null); inviteCollaborator(); }}><UserPlus size={14} /> Invite collaborator</button>
            </DropdownMenu>
          </div>

          <div className="scores">
            <ScoreCard score={78} title="Strategy health" delta="+4 this week" note="Objectives are well-defined & owned" onView={() => { setInsightsOpen(true); showToast("Opening insights for Strategy health"); }} />
            <ScoreCard score={78} title="Strategy execution alignment" delta="−2 this week" note="Some teams are drifting from priorities" onView={() => { setInsightsOpen(true); showToast("Opening insights for Strategy execution alignment"); }} />
          </div>

          <section className="strategy-narrative">
            <div className="strategy-narrative-main">
              <div className="narrative-mark"><FigmaIcon name="padiworks-logo" size={28} /></div>
              <div><span>Strategy narrative</span><h2>Become the operating system for execution intelligence in growth companies.</h2><p>Win through measurable customer value, AI-native capability, and an accountable high-performance culture.</p></div>
            </div>
            <button onClick={() => setInsightsOpen(true)}>Review with Padi AI <FigmaIcon name="arrow-narrow-right-white" size={16} /></button>
          </section>

          <div className="view-tabs">
            <button className={view === "Planner" ? "active" : ""} onClick={() => setView("Planner")}><FigmaIcon name="calendar-check-01" size={16} /> Planner</button>
            <button className={view === "Timeline" ? "active" : ""} onClick={() => setView("Timeline")}><FigmaIcon name="gantt-chart" size={16} /> Timeline</button>
          </div>

          <section className="plan-section">
            <div className="plan-header">
              <div><h2>Plan details</h2><button onClick={reorderPlan}>Reorder plan</button></div>
              <div>
                <label className="header-search inline-search"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search strategy" /></label>
                <button className="soft-button" onClick={addPriority}><Plus size={15} /> Add strategic priority</button>
                <button className={`check-button ${hideCompleted ? "checked" : ""}`} onClick={() => setHideCompleted(!hideCompleted)}><i>{hideCompleted && <Check size={12} />}</i> Hide completed</button>
                <DropdownMenu
                  id="date"
                  openMenu={openMenu}
                  onToggle={handleToggleMenu}
                  trigger={<button className="date-button"><FigmaIcon name="calendar" size={18} /><span>{dateRange === "No date range applied" ? "Date Filter" : dateRange}</span></button>}
                >
                  {dateOptions.map((option) => (
                    <button key={option} onClick={() => { setDateRange(option); setOpenMenu(null); showToast(`Filtering by ${option}`); }}>{option}</button>
                  ))}
                  <div className="menu-divider" />
                  <button onClick={() => { setDateRange("No date range applied"); setOpenMenu(null); }}>Clear filter</button>
                </DropdownMenu>
              </div>
            </div>
            <p className="section-label">Strategic priorities</p>
            {view === "Planner" ? (
              <div className="priority-list">
                {visibleGroups.map((group) => (
                  <PriorityCard
                    key={group.id}
                    group={group}
                    scope={tab}
                    query={query}
                    hideCompleted={hideCompleted}
                    openMenu={openMenu}
                    onToggleMenu={handleToggleMenu}
                    onRename={renameGroup}
                    onDuplicate={duplicateGroup}
                    onDelete={deleteGroup}
                    onAddObjective={addObjective}
                    onToggleComplete={(groupId, itemId) => toggleObjectiveComplete(tab, groupId, itemId)}
                    onRemoveObjective={(groupId, itemId) => removeObjective(tab, groupId, itemId)}
                    onOpenDetail={openDetail}
                  />
                ))}
                {visibleGroups.length === 0 && <div className="empty-state"><Search size={24} /><strong>No strategy items found</strong><span>Try a different search term.</span></div>}
              </div>
            ) : (
              <TimelineSection groups={visibleGroups} scope={tab} onOpenDetail={openDetail} />
            )}
          </section>
        </>}

        {section === "Objectives" && (
          <ObjectivesSection
            priorityData={priorityData}
            onToggleComplete={toggleObjectiveComplete}
            onRemove={removeObjective}
            onOpenDetail={openDetail}
          />
        )}

        {section === "Teams" && (
          <TeamsSection members={teamMembers} onInvite={inviteTeamMember} onRemove={removeMember} onChangeRole={changeMemberRole} onOpenMember={setMemberDetail} />
        )}

        {section === "Insights" && (
          <InsightsSection messages={messages} draft={draft} setDraft={setDraft} onSend={sendMessage} />
        )}

        {section === "Reports" && <ReportsSection />}

        {section === "Admin Center" && (
          <AdminCenterShell key={adminTarget} showToast={showToast} initialPage={adminTarget} />
        )}
      </div>
    </main>

    <button className="tour-button" onClick={() => setTour(true)}><span><Bot size={18} /></span> Book a 1-on-1 tour</button>
    {tour && <aside className="tour-card"><button onClick={() => setTour(false)}><X size={16} /></button><span><Sparkles size={17} /></span><div><strong>New to Strategy?</strong><p>See how priorities connect to objectives, teams, and execution evidence.</p><div><button onClick={() => setTour(false)}>Maybe later</button><button onClick={startGuidedTour}>Start guided tour</button></div></div></aside>}

    {insightsOpen && <div className="drawer-backdrop" onClick={() => setInsightsOpen(false)}>
      <aside className="ai-drawer strategy-review-drawer" onClick={(event) => event.stopPropagation()}>
        <header><div><span className="ai-brand-icon"><Image src="/images/auth/bot-icon.svg" alt="" width={26} height={26} /></span><div><strong>Padi AI strategy review</strong><span>Analysed just now · Q3–Q4 cycle</span></div></div><button aria-label="Close strategy review" onClick={() => setInsightsOpen(false)}><X size={18} /></button></header>
        <div className="ai-review-intro"><span><Sparkles size={12} /> Executive review</span><h2>Your direction is strong. Execution needs sharper ownership.</h2><p>Padi reviewed priorities, objectives, progress updates, and team ownership across this strategy cycle.</p></div>
        <div className="ai-review-metrics">
          <div><span>Health score</span><strong>78<small>/100</small></strong><b className="positive"><TrendingUp size={11} /> +4</b></div>
          <div><span>Needs attention</span><strong>3</strong><small>objectives</small></div>
          <div><span>Ownership gaps</span><strong>2</strong><small>unresolved</small></div>
        </div>
        <section className="ai-focus-card">
          <div className="ai-focus-heading"><span><AlertTriangle size={14} /> Primary focus</span><b>High impact</b></div>
          <h3>Tech Transformation is under-supported</h3>
          <p>Capability and ownership gaps are slowing two objectives. Assigning one accountable owner and resolving the data-engineering gap would improve execution confidence.</p>
          <div><span>Tech Transformation</span><span>2 objectives affected</span></div>
        </section>
        <div className="recommendations ai-review-actions">
          <div className="recommendation-heading"><div><span>Action plan</span><h3>Recommended next steps</h3></div><small>Prioritized by impact</small></div>
          <article><b>01</b><div><strong>Clarify transformation ownership</strong><p>Assign one accountable owner to the two objectives currently shared across contributors.</p><button onClick={() => { setInsightsOpen(false); setSection("Teams"); showToast("Reviewing objective owners and team accountability"); }}>Review owners <ChevronRight size={13} /></button></div></article>
          <article><b>02</b><div><strong>Connect work to outcomes</strong><p>Link 11 active work items to a measurable strategic objective.</p><button onClick={() => { setInsightsOpen(false); setSection("Objectives"); showToast("Reviewing objectives that need stronger connections"); }}>View unlinked work <ChevronRight size={13} /></button></div></article>
          <article><b>03</b><div><strong>Close the AI capability gap</strong><p>Add a capability objective for data engineering and AI readiness.</p><button onClick={() => { setInsightsOpen(false); setSection("Strategy"); setTab("Organization"); setView("Planner"); addObjective("tech-transformation", "Organization"); }}>Create objective <Plus size={13} /></button></div></article>
        </div>
        {messages.length > 0 && <div className="chat-log">{messages.map((m, i) => <div key={i} className={`chat-bubble ${m.role}`}>{m.text}</div>)}</div>}
        <label className="ask-padi">
          <Sparkles size={15} />
          <input placeholder="Ask Padi to explain a signal or suggest an action…" value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") sendMessage(); }} />
          <button aria-label="Send question" onClick={sendMessage}><Send size={15} /></button>
        </label>
      </aside>
    </div>}

    {helpOpen && <div className="drawer-backdrop" onClick={() => setHelpOpen(false)}>
      <aside className="ai-drawer" onClick={(event) => event.stopPropagation()}>
        <header><div><span className="modal-icon"><CircleHelp size={20} /></span><div><strong>Help & support</strong><span>We usually reply within a few hours</span></div></div><button onClick={() => setHelpOpen(false)}><X size={18} /></button></header>
        <div className="recommendations">
          <h3>Popular topics</h3>
          <article><b><Target size={14} /></b><div><strong>Setting up strategic priorities</strong><p>Learn how priorities, objectives, and teams connect.</p></div></article>
          <article><b><UsersRound size={14} /></b><div><strong>Inviting your team</strong><p>Add teammates and assign ownership of objectives.</p></div></article>
          <article><b><Settings size={14} /></b><div><strong>Workspace settings</strong><p>Manage notifications, visibility, and access.</p></div></article>
        </div>
        <label className="ask-padi">
          <input placeholder="Message support…" value={helpDraft} onChange={(event) => setHelpDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") sendHelpMessage(); }} />
          <button onClick={sendHelpMessage}><Send size={16} /></button>
        </label>
      </aside>
    </div>}

    {detailItem && <div className="drawer-backdrop" onClick={() => setDetailItem(null)}>
      <aside className="ai-drawer detail-sheet" onClick={(event) => event.stopPropagation()}>
        <header className="detail-sheet-header">
          <div className="detail-sheet-title">
            <ObjectiveIcon type={detailItem.item.type} size={20} />
            <div><span className="detail-kicker">{detailItem.groupTitle}</span><h2>{detailItem.item.title}</h2><div className="detail-title-badges"><span className="type-badge">{detailItem.item.type}</span><span className={`drawer-status ${detailItem.item.state !== "On track" ? "behind" : ""}`}><i />{detailItem.item.state}</span></div></div>
          </div>
          <div className="detail-header-actions"><button className="soft-button" onClick={openProgressModal}><TrendingUp size={14} /> Update</button><button className="modal-close" onClick={() => setDetailItem(null)}><X size={18} /></button></div>
        </header>

        <div className="detail-overview-strip">
          <div><span>Priority</span><strong><Target size={13} /> {detailItem.groupTitle}</strong></div>
          <div><span>Owner</span><strong><Avatar initials={detailItem.item.initials} color={detailItem.item.color} /> {detailItem.item.ownerName ?? ownerName(detailItem.item.initials)}</strong></div>
          <div><span>Cycle</span><strong><CalendarDays size={13} /> Q3–Q4</strong></div>
        </div>

        <div className="detail-tabs">
          {(["Details", "Updates", "Risks", "Relationships"] as const).map((t) => (
            <button key={t} className={detailTab === t ? "active" : ""} onClick={() => setDetailTab(t)}>{t}</button>
          ))}
        </div>

        {detailTab === "Details" && <>
          <div className="progress-display">
            <div className="progress-display-numbers">
              <strong>{detailItem.item.progress}%</strong><span>of {detailItem.item.target}%</span>
              <span className={`status ${detailItem.item.state !== "On track" ? "behind" : ""}`}><i />{detailItem.item.state}</span>
            </div>
            <div className="progress-display-bar"><i className={detailItem.item.state !== "On track" ? "behind" : ""} style={{ width: `${Math.min(100, (detailItem.item.progress / detailItem.item.target) * 100)}%` }} /></div>
          </div>
          <button className="soft-button" style={{ marginBottom: 18 }} onClick={() => setDetailTab("Updates")}><TrendingUp size={14} /> Log a check-in in Updates</button>
          <TrendChart points={trendPoints(detailItem.item)} />
          <div className="detail-field"><span>Owner</span><div className="detail-field-value"><Avatar initials={detailItem.item.initials} color={detailItem.item.color} /> {ownerName(detailItem.item.initials)}</div></div>
          <div className="detail-field"><span>Priority</span><div className="detail-field-value"><Target size={15} /> {detailItem.groupTitle}</div></div>
          <div className="detail-field"><span>Champion team</span><div className="detail-field-value"><UsersRound size={15} /> {detailItem.item.champion}</div></div>
          <div className="detail-field"><span>Co-Champion team</span><div className="detail-field-value"><UsersRound size={15} /> {detailItem.item.coChampion}</div></div>
          <div className="detail-field"><span>Time frame</span><div className="detail-field-value"><CalendarDays size={15} /> Jul 01, 2026 – Dec 31, 2026</div></div>
          <div className="detail-completeness">
            <div><span>Objective setup</span><strong>80% complete</strong></div><div><i style={{width:"80%"}} /></div><p>Add a success measure to complete this objective&apos;s setup.</p>
          </div>
        </>}

        {detailTab === "Updates" && <>
          <button className="update-progress-btn btn-primary" onClick={openProgressModal}>Log a check-in</button>
          <p className="priority-empty" style={{ marginTop: 0 }}>Progress updates and check-ins logged against this objective.</p>
          <div className="detail-comments" style={{ marginTop: 0 }}>
            {(comments[detailItem.item.id] ?? []).length === 0 && (
              <div className="empty-state" style={{ minHeight: 120, marginBottom: 16 }}>
                <Clock size={20} />
                <strong>No updates yet</strong>
                <span>Post the first check-in below.</span>
              </div>
            )}
            {(comments[detailItem.item.id] ?? []).map((c, i) => (
              <div key={i} className="comment"><Avatar initials="AL" color="#e9e2f8" /><div><strong>{c.author}</strong><span>{c.time}</span><p>{c.text}</p></div></div>
            ))}
            <label className="ask-padi inline">
              <input placeholder="Post an update…" value={commentDraft} onChange={(event) => setCommentDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") addComment(); }} />
              <button onClick={addComment}><Send size={15} /></button>
            </label>
          </div>
        </>}

        {detailTab === "Risks" && <>
          {(risks[detailItem.item.id] ?? []).length === 0 ? (
            <div className="empty-state" style={{ minHeight: 120, marginBottom: 16 }}>
              <AlertTriangle size={20} />
              <strong>No risks flagged</strong>
              <span>This objective has no open blockers.</span>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
              {(risks[detailItem.item.id] ?? []).map((risk) => {
                const palette = risk.severity === "High" ? { bg: "#fef3f2", fg: "#d92d20" } : risk.severity === "Medium" ? { bg: "#fff3c7", fg: "#946200" } : { bg: "#f0f2f5", fg: "#475367" };
                return (
                  <div key={risk.id} className="lag-lead-row" style={{ alignItems: "flex-start" }}>
                    <span className="lag-lead-tag" style={{ background: palette.bg, color: palette.fg }}>{risk.severity}</span>
                    <div style={{ flex: 1 }}>
                      <strong style={{ display: "block", fontSize: 12 }}>{risk.title}</strong>
                      {risk.note && <span style={{ display: "block", marginTop: 3, color: "var(--muted)", fontSize: 11 }}>{risk.note}</span>}
                    </div>
                    <button className="plain-icon" aria-label="Resolve risk" onClick={() => removeRisk(risk.id)}><Check size={14} /></button>
                  </div>
                );
              })}
            </div>
          )}
          <div className="chip-add-row">
            <select className="select-input" style={{ height: 44, width: 110, flex: "none" }} value={riskSeverityDraft} onChange={(event) => setRiskSeverityDraft(event.target.value as Risk["severity"])}>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            <input
              className="text-input"
              placeholder="Flag a risk or blocker…"
              value={riskDraft}
              onChange={(event) => setRiskDraft(event.target.value)}
              onKeyDown={(event) => { if (event.key === "Enter") addRisk(); }}
            />
            <button className="soft-button" onClick={addRisk}>Add</button>
          </div>
        </>}

        {detailTab === "Relationships" && <>
          <div className="detail-field"><span>Strategic priority</span><div className="detail-field-value"><Target size={15} /> {detailItem.groupTitle}</div></div>
          <div className="detail-field"><span>Champion team</span><div className="detail-field-value"><UsersRound size={15} /> {detailItem.item.champion}</div></div>
          <div className="detail-field"><span>Co-Champion team</span><div className="detail-field-value"><UsersRound size={15} /> {detailItem.item.coChampion}</div></div>
          <p className="section-label">Sibling objectives under this priority</p>
          {(() => {
            const siblings = priorityData[detailItem.scope].find((g) => g.id === detailItem.groupId)?.items.filter((i) => i.id !== detailItem.item.id) ?? [];
            if (siblings.length === 0) {
              return <p className="priority-empty">No other objectives under this priority yet.</p>;
            }
            return (
              <div className="sibling-list">
                {siblings.map((sibling) => (
                  <div key={sibling.id} className="sibling-row" onClick={() => openDetail(detailItem.scope, detailItem.groupId, detailItem.groupTitle, sibling)}>
                    <ObjectiveIcon type={sibling.type} size={16} className="sm" />
                    <div className="sibling-title"><strong>{sibling.title}</strong><span>Champion {sibling.champion}</span></div>
                    <div className={`objective-status ${sibling.state !== "On track" ? "behind" : ""}`}><i />{sibling.state}</div>
                  </div>
                ))}
              </div>
            );
          })()}
        </>}
      </aside>
    </div>}

    {memberDetail && <div className="drawer-backdrop" onClick={() => setMemberDetail(null)}>
      <aside className="ai-drawer detail-sheet" onClick={(event) => event.stopPropagation()}>
        <header className="detail-sheet-header">
          <div className="detail-sheet-title">
            <Avatar initials={memberDetail.initials} color={memberDetail.color} />
            <div><h2>{memberDetail.name}</h2><span className="type-badge">{memberDetail.role}</span></div>
          </div>
          <button className="modal-close" onClick={() => setMemberDetail(null)}><X size={18} /></button>
        </header>

        <div className="member-profile-card">
          <Avatar initials={memberDetail.initials} color={memberDetail.color} />
          <div><strong>{memberDetail.name}</strong><span>{memberDetail.role}</span><small><i /> Active workspace member</small></div>
        </div>

        <div className="member-drawer-stats"><div><span>Owned</span><strong>{(["Organization", "Teams"] as ScopeTab[]).flatMap((scope) => priorityData[scope].flatMap((group) => group.items)).filter((item) => item.initials === memberDetail.initials).length}</strong></div><div><span>On track</span><strong>{(["Organization", "Teams"] as ScopeTab[]).flatMap((scope) => priorityData[scope].flatMap((group) => group.items)).filter((item) => item.initials === memberDetail.initials && item.state === "On track").length}</strong></div><div><span>Check-ins</span><strong>4</strong></div></div>

        <p className="section-label">Objectives owned</p>
        {(() => {
          const owned = (["Organization", "Teams"] as ScopeTab[]).flatMap((scope) =>
            priorityData[scope].flatMap((group) => group.items
              .filter((item) => item.initials === memberDetail.initials)
              .map((item) => ({ scope, group, item })))
          );
          if (owned.length === 0) {
            return <p className="priority-empty">No objectives currently owned by {memberDetail.name}.</p>;
          }
          return (
            <div className="sibling-list">
              {owned.map(({ scope, group, item }) => (
                <div
                  key={item.id}
                  className="sibling-row"
                  onClick={() => { setMemberDetail(null); openDetail(scope, group.id, group.title, item); }}
                >
                  <ObjectiveIcon type={item.type} size={16} className="sm" />
                  <div className="sibling-title"><strong>{item.title}</strong><span>{group.title} · {scope}</span></div>
                  <div className={`objective-status ${item.state !== "On track" ? "behind" : ""}`}><i />{item.state}</div>
                </div>
              ))}
            </div>
          );
        })()}

        <p className="section-label">Actions</p>
        <div className="modal-actions" style={{ justifyContent: "flex-start" }}>
          <button className="btn-ghost" onClick={() => { changeMemberRole(memberDetail.id, memberDetail.role); }}><Pencil size={13} /> Change role</button>
          <button
            className="btn-danger"
            onClick={() => { const target = memberDetail; setMemberDetail(null); removeMember(target.id, target.name); }}
          >
            <Trash2 size={13} /> Remove teammate
          </button>
        </div>
      </aside>
    </div>}

    {progressModal && <div className="drawer-backdrop" onClick={() => setProgressModal(null)}>
      <div className="create-modal" onClick={(event) => event.stopPropagation()}>
        <button className="modal-close" onClick={() => setProgressModal(null)}><X size={18} /></button>
        <span className="modal-icon"><TrendingUp size={20} /></span>
        <h2>Update progress</h2>
        <div className="progress-slider-row">
          <input type="range" min={0} max={100} value={progressValue} onChange={(event) => setProgressValue(Number(event.target.value))} />
          <strong>{progressValue}%</strong>
        </div>
        <label className="prompt-modal-label">
          Check-in note (optional)
          <textarea
            className="textarea-input prompt-modal-input"
            style={{ height: "auto" }}
            rows={3}
            placeholder="What changed since the last update?"
            value={progressCheckinDraft}
            onChange={(event) => setProgressCheckinDraft(event.target.value)}
          />
        </label>
        <div className="modal-actions">
          <button className="btn-ghost" onClick={() => setProgressModal(null)}>Cancel</button>
          <button className="btn-primary" onClick={saveProgress}>Save</button>
        </div>
      </div>
    </div>}

    {createOpen && <div className="drawer-backdrop" onClick={() => setCreateOpen(false)}>
      <div className="create-modal" onClick={(event) => event.stopPropagation()}>
        <button className="modal-close" onClick={() => setCreateOpen(false)}><X size={18} /></button>
        <span className="modal-icon"><Target size={20} /></span>
        <h2>Create strategy item</h2>
        <p>Start at the right level so every objective and work item stays traceable.</p>
        <div className="create-options">
          <button onClick={() => { setCreateOpen(false); setSection("Strategy"); addPriority(); }}><span><Target size={17} /></span><div><strong>Strategic priority</strong><small>Define a major direction for the organisation.</small></div><ChevronRight size={16} /></button>
          <button onClick={() => { setCreateOpen(false); setSection("Strategy"); if (activeList[0]) addObjective(activeList[0].id); }}><span><BarChart3 size={17} /></span><div><strong>Objective and key results</strong><small>Turn a priority into measurable outcomes.</small></div><ChevronRight size={16} /></button>
          <button onClick={() => { setCreateOpen(false); setInsightsOpen(true); }}><span><Sparkles size={17} /></span><div><strong>Draft with Padi AI</strong><small>Generate a strategy item from your business context.</small></div><ChevronRight size={16} /></button>
        </div>
      </div>
    </div>}

    {inviteOpen && <div className="drawer-backdrop" onClick={() => setInviteOpen(false)}>
      <form className="create-modal invite-modal" onClick={(event) => event.stopPropagation()} onSubmit={submitTeamInvite}>
        <button type="button" className="modal-close" aria-label="Close invitation" onClick={() => setInviteOpen(false)}><X size={18} /></button>
        <div className="invite-modal-heading">
          <span className="modal-icon"><UserPlus size={20} /></span>
          <div><span>Workspace invitation</span><h2>Invite a teammate</h2><p>Add someone to the workspace and define what they can access from day one.</p></div>
        </div>
        <div className="invite-form-grid">
          <label className="prompt-modal-label">Full name<input className="prompt-modal-input" autoFocus value={inviteDraft.name} onChange={(event) => setInviteDraft((current) => ({ ...current, name: event.target.value }))} placeholder="e.g. Amaka Okafor" /></label>
          <label className="prompt-modal-label">Work email<input className="prompt-modal-input" type="email" value={inviteDraft.email} onChange={(event) => setInviteDraft((current) => ({ ...current, email: event.target.value }))} placeholder="amaka@company.com" /></label>
          <label className="prompt-modal-label">Job role<select className="select-input invite-select" value={inviteDraft.role} onChange={(event) => setInviteDraft((current) => ({ ...current, role: event.target.value }))}><option>Team member</option><option>Product Manager</option><option>Team Lead</option><option>Department Head</option><option>Executive</option></select></label>
          <label className="prompt-modal-label">Primary team<select className="select-input invite-select" value={inviteDraft.team} onChange={(event) => setInviteDraft((current) => ({ ...current, team: event.target.value }))}>{TEAMS.map((team) => <option key={team}>{team}</option>)}</select></label>
        </div>
        <fieldset className="invite-access"><legend>Workspace access</legend><p>Choose the level of control this teammate should have.</p><div>{["Contributor", "Manager", "Admin"].map((access) => <button type="button" key={access} className={inviteDraft.access === access ? "active" : ""} onClick={() => setInviteDraft((current) => ({ ...current, access }))}><span>{access}</span><small>{access === "Contributor" ? "View strategy and update assigned work" : access === "Manager" ? "Manage team objectives and check-ins" : "Manage workspace settings and access"}</small>{inviteDraft.access === access && <Check size={14} />}</button>)}</div></fieldset>
        <label className="prompt-modal-label">Personal message <span className="optional-label">Optional</span><textarea className="textarea-input invite-message" value={inviteDraft.message} onChange={(event) => setInviteDraft((current) => ({ ...current, message: event.target.value }))} placeholder="Add context about why they’re joining the workspace…" /></label>
        <div className="invite-summary"><UsersRound size={16} /><span><strong>{inviteDraft.team} team</strong>{inviteDraft.access} access · Email invitation expires in 7 days</span></div>
        <div className="modal-actions"><button type="button" className="btn-ghost" onClick={() => setInviteOpen(false)}>Cancel</button><button type="submit" className="btn-primary" disabled={!inviteDraft.name.trim() || !/^\S+@\S+\.\S+$/.test(inviteDraft.email.trim())}><UserPlus size={14} /> Send invitation</button></div>
      </form>
    </div>}

    {promptModal && <div className="drawer-backdrop" onClick={() => setPromptModal(null)}>
      <form className={`create-modal${promptModal.kind ? " enhanced-create-modal" : ""}`} onClick={(event) => event.stopPropagation()} onSubmit={submitPromptModal}>
        <button type="button" className="modal-close" onClick={() => setPromptModal(null)}><X size={18} /></button>
        <span className="modal-icon">{promptModal.kind === "priority" ? <Target size={20} /> : promptModal.kind === "objective" ? <BarChart3 size={20} /> : <Pencil size={20} />}</span>
        {promptModal.kind && <span className="create-eyebrow">{promptModal.context}</span>}
        <h2>{promptModal.heading}</h2>
        {promptModal.kind && <p className="create-description">{promptModal.kind === "priority" ? "Define a clear strategic direction that objectives and team plans can align to." : "Add a measurable outcome beneath this priority. Ownership and progress can be completed next."}</p>}
        <label className="prompt-modal-label">
          {promptModal.label}
          <input className="prompt-modal-input" autoFocus value={promptValue} onChange={(event) => setPromptValue(event.target.value)} placeholder={promptModal.kind === "priority" ? "e.g. Expand market leadership" : promptModal.kind === "objective" ? "e.g. Increase enterprise revenue by 30%" : undefined} />
        </label>
        {promptModal.kind && <>
          <div className="creation-preview"><span>Preview</span><div><i>{promptModal.kind === "priority" ? <Target size={17} /> : <BarChart3 size={17} />}</i><strong>{promptValue.trim() || (promptModal.kind === "priority" ? "Your strategic priority" : "Your objective")}</strong><small>{promptModal.kind === "priority" ? "Strategic priority · Current" : "Top level OKR · 0% progress"}</small></div></div>
          <div className="creation-next"><CheckCircle2 size={15} /><span><strong>Next:</strong> {promptModal.kind === "priority" ? "add objectives and define success measures" : "assign an owner, target, and reporting cycle"}</span></div>
        </>}
        <div className="modal-actions">
          <button type="button" className="btn-ghost" onClick={() => setPromptModal(null)}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={!promptValue.trim()}>{promptModal.confirmLabel}</button>
        </div>
      </form>
    </div>}

    {confirmModal && <div className="drawer-backdrop" onClick={() => setConfirmModal(null)}>
      <div className="create-modal confirm-modal" onClick={(event) => event.stopPropagation()}>
        <button className="modal-close" onClick={() => setConfirmModal(null)}><X size={18} /></button>
        <span className="modal-icon danger-icon"><Trash2 size={20} /></span>
        <h2>{confirmModal.heading}</h2>
        <p>{confirmModal.message}</p>
        <div className="modal-actions">
          <button className="btn-ghost" onClick={() => setConfirmModal(null)}>Cancel</button>
          <button className="btn-danger" onClick={() => { confirmModal.onConfirm(); setConfirmModal(null); }}>{confirmModal.confirmLabel}</button>
        </div>
      </div>
    </div>}

    {toast && <div className="toast">{toast}</div>}
  </div>;
}
