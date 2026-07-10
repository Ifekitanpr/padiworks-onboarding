"use client";
import "./strategy.css";

import {
  BarChart3, Bell, Bot, Building2, CalendarDays, Check, ChevronDown, ChevronRight,
  CircleHelp, Home, Lightbulb, MoreHorizontal, Plus, Search, Settings,
  Sparkles, Target, UsersRound, X,
} from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { PadiworksMark } from "@/components/auth/padiworks-mark";

const priorities = [
  {
    title: "Market Leadership",
    tag: "Strategic growth",
    items: [
      ["Continue top-line growth that outpaces the industry", "28", "On track", "MD", "#ffd867"],
      ["Lead the shift to sustainable, tech-forward products", "56", "On track", "SA", "#ffc7d2"],
      ["Become the top-of-mind brand for our category enthusiasts", "63", "Behind", "JT", "#a8ddef"],
    ],
  },
  {
    title: "Tech Transformation",
    tag: "Transformation",
    items: [
      ["Modernise the core platform and improve delivery velocity", "71", "On track", "AK", "#c9e6cc"],
      ["Build an AI-ready data and capability foundation", "42", "At risk", "BI", "#d9ccff"],
    ],
  },
];

const menuItems = [
  { label: "Home", icon: Home },
  { label: "Strategy", icon: Target, active: true },
  { label: "Objectives", icon: BarChart3 },
  { label: "Teams", icon: UsersRound },
  { label: "Insights", icon: Lightbulb },
  { label: "Admin settings", icon: Settings },
];

function Logo() {
  return <div className="brand-mark" aria-label="Padiworks"><PadiworksMark className="size-6" /></div>;
}

function Avatar({ initials, color }: { initials: string; color: string }) {
  return <span className="avatar" style={{ backgroundColor: color }}>{initials}</span>;
}

function ScoreCard({ score, title, note, delta }: { score: number; title: string; note: string; delta: string }) {
  return <article className="score-card">
    <div className="score-ring" style={{ "--score": `${score * 3.6}deg` } as React.CSSProperties}><span>{score}</span></div>
    <div className="score-copy"><span className="ai-label"><Sparkles size={11} /> AI score</span><strong>{title}</strong><small>{delta} · {note}</small></div>
    <button aria-label={`View ${title}`}><ChevronRight size={18} /></button>
  </article>;
}

function ObjectiveRow({ item }: { item: string[] }) {
  const [title, progress, state, initials, color] = item;
  const behind = state !== "On track";
  return <div className="objective-row">
    <span className="objective-icon"><Target size={15} /></span>
    <div className="objective-title"><strong>{title}</strong><span>Top-level OKR</span></div>
    <div className="cycle"><strong>Q3–Q4 Strategy Cycle</strong><span>Jul 01, 2026 – Dec 31, 2026</span></div>
    <Avatar initials={initials} color={color} />
    <div className="row-progress"><div><i className={behind ? "behind" : ""} style={{ width: `${progress}%` }} /></div><span>{progress}%</span></div>
    <span className={`status ${behind ? "behind" : ""}`}><i />{state}</span>
    <button className="plain-icon"><MoreHorizontal size={17} /></button>
  </div>;
}

function PriorityCard({ group }: { group: typeof priorities[number] }) {
  const [open, setOpen] = useState(true);
  return <section className="priority-card">
    <header>
      <button className="plain-icon" onClick={() => setOpen(!open)} aria-label="Toggle priority"><ChevronDown className={!open ? "closed" : ""} size={17} /></button>
      <span className="target-badge"><Target size={16} /></span>
      <div><h3>{group.title}</h3><span className="priority-tag">{group.tag}</span></div>
      <div className="priority-state"><span>Current</span><b><i /> On track</b><button className="plain-icon"><MoreHorizontal size={17} /></button></div>
    </header>
    {open && <div className="priority-body"><button className="add-inline" aria-label="Add objective"><Plus size={18} /></button>{group.items.map((item) => <ObjectiveRow key={item[0]} item={item} />)}</div>}
  </section>;
}

export default function HomePage() {
  const [tab, setTab] = useState<"Organization" | "Teams">("Organization");
  const [view, setView] = useState<"Planner" | "Timeline">("Planner");
  const [hideCompleted, setHideCompleted] = useState(false);
  const [tour, setTour] = useState(true);
  const [query, setQuery] = useState("");
  const [insightsOpen, setInsightsOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  const visiblePriorities = priorities.map((group) => ({
    ...group,
    items: group.items.filter((item) => item[0].toLowerCase().includes(query.toLowerCase())),
  })).filter((group) => group.title.toLowerCase().includes(query.toLowerCase()) || group.items.length > 0);

  return <div className="strategy-app">
    <aside className="slim-sidebar">
      <Logo />
      <nav>{menuItems.map(({ label, icon: Icon, active }) => <button key={label} className={active ? "active" : ""} aria-label={label} title={label}><Icon size={18} /><span>{label}</span></button>)}</nav>
      <div className="sidebar-bottom"><button aria-label="Help" title="Help"><CircleHelp size={18} /><span>Help</span></button><Avatar initials="AL" color="#dce9ff" /></div>
    </aside>

    <main>
      <header className="topbar">
        <div className="page-title"><h1>Organization Strategy</h1><button className="star" aria-label="Favorite">★</button><button className="plain-icon"><MoreHorizontal size={18} /></button><button className="insights-button" onClick={() => setInsightsOpen(true)}><Sparkles size={15} /> Ask Padi AI</button></div>
        <div className="top-actions"><label className="header-search"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search strategy" /></label><button className="create-button" onClick={() => setCreateOpen(true)}><Plus size={19} /></button><button className="bell"><Bell size={18} /><i /></button><Avatar initials="AL" color="#e9e2f8" /></div>
      </header>

      <div className="workspace">
        <div className="scope-tabs"><button className={tab === "Organization" ? "active" : ""} onClick={() => setTab("Organization")}><Building2 size={14} /> Organization</button><button className={tab === "Teams" ? "active" : ""} onClick={() => setTab("Teams")}><UsersRound size={14} /> Teams</button></div>

        <div className="collaborators"><span>Owners and collaborators</span><div><Avatar initials="BI" color="#c5edaa" /><Avatar initials="AK" color="#ffe08b" /><Avatar initials="MI" color="#ffc7ca" /><Avatar initials="JT" color="#c6e8f4" /><Avatar initials="SA" color="#d8c8f1" /></div></div>

        <section className="strategy-narrative"><div className="narrative-mark"><PadiworksMark className="size-6" /></div><div><span>Strategy narrative</span><h2>Become the operating system for execution intelligence in growth companies.</h2><p>Win through measurable customer value, AI-native capability, and an accountable high-performance culture.</p></div><button onClick={() => setInsightsOpen(true)}>Review with Padi AI <ChevronRight size={15} /></button></section>

        <div className="scores"><ScoreCard score={78} title="Strategy health" delta="+4 this week" note="Objectives are well-defined & owned" /><ScoreCard score={64} title="Strategy execution alignment" delta="−2 this week" note="Some teams are drifting from priorities" /></div>

        <div className="view-tabs"><button className={view === "Planner" ? "active" : ""} onClick={() => setView("Planner")}>Planner</button><button className={view === "Timeline" ? "active" : ""} onClick={() => setView("Timeline")}>Timeline</button></div>

        <section className="plan-section">
          <div className="plan-header"><div><h2>Plan details</h2><button>Reorder plan</button></div><div><button className="soft-button"><Plus size={15} /> Add strategic priority</button><button className={`check-button ${hideCompleted ? "checked" : ""}`} onClick={() => setHideCompleted(!hideCompleted)}><i>{hideCompleted && <Check size={12} />}</i> Hide completed</button><button className="date-button"><CalendarDays size={16} /><span><small>Date filter</small>No date range applied</span><ChevronDown size={15} /></button></div></div>
          <p className="section-label">Strategic priorities</p>
          {view === "Planner" ? <div className="priority-list">{visiblePriorities.map(group => <PriorityCard key={group.title} group={group} />)}{visiblePriorities.length === 0 && <div className="empty-state"><Search size={24}/><strong>No strategy items found</strong><span>Try a different search term.</span></div>}</div> : <div className="timeline-view"><div className="timeline-months"><span>July</span><span>August</span><span>September</span><span>October</span><span>November</span><span>December</span></div>{visiblePriorities.map((group, i) => <div className="timeline-row" key={group.title}><strong>{group.title}</strong><i style={{ left: `${i * 13 + 8}%`, width: `${58 - i * 9}%` }}><span>{group.items.length} objectives</span></i></div>)}</div>}
        </section>
      </div>
    </main>

    <button className="tour-button"><span><Bot size={18} /></span> Book a 1-on-1 tour</button>
    {tour && <aside className="tour-card"><button onClick={() => setTour(false)}><X size={16} /></button><span><Sparkles size={17} /></span><div><strong>New to Strategy?</strong><p>See how priorities connect to objectives, teams, and execution evidence.</p><div><button onClick={() => setTour(false)}>Maybe later</button><button onClick={() => setTour(false)}>Start guided tour</button></div></div></aside>}
    {insightsOpen && <div className="drawer-backdrop" onClick={() => setInsightsOpen(false)}><aside className="ai-drawer" onClick={(event) => event.stopPropagation()}><header><div><Image src="/images/auth/v2/bot-icon.svg" alt="Padi AI" width={36} height={36}/><div><strong>Padi AI</strong><span>Strategy intelligence</span></div></div><button onClick={() => setInsightsOpen(false)}><X size={18}/></button></header><section className="ai-summary"><span><Sparkles size={13}/> Executive insight</span><h2>Your strategy is clear, but execution is uneven.</h2><p>Market Leadership is healthy. Tech Transformation is under-supported by capability and ownership signals.</p></section><div className="recommendations"><h3>Recommended actions</h3><article><b>01</b><div><strong>Clarify transformation ownership</strong><p>Two objectives have contributors but no single accountable owner.</p></div></article><article><b>02</b><div><strong>Connect work to outcomes</strong><p>11 active work items are not linked to a strategic priority.</p></div></article><article><b>03</b><div><strong>Close the AI capability gap</strong><p>Create a development objective for data and AI readiness.</p></div></article></div><label className="ask-padi"><input placeholder="Ask about this strategy…"/><button><ChevronRight size={17}/></button></label></aside></div>}
    {createOpen && <div className="drawer-backdrop" onClick={() => setCreateOpen(false)}><div className="create-modal" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setCreateOpen(false)}><X size={18}/></button><span className="modal-icon"><Target size={20}/></span><h2>Create strategy item</h2><p>Start at the right level so every objective and work item stays traceable.</p><div className="create-options"><button onClick={() => setCreateOpen(false)}><span><Target size={17}/></span><div><strong>Strategic priority</strong><small>Define a major direction for the organisation.</small></div><ChevronRight size={16}/></button><button onClick={() => setCreateOpen(false)}><span><BarChart3 size={17}/></span><div><strong>Objective and key results</strong><small>Turn a priority into measurable outcomes.</small></div><ChevronRight size={16}/></button><button onClick={() => {setCreateOpen(false);setInsightsOpen(true)}}><span><Sparkles size={17}/></span><div><strong>Draft with Padi AI</strong><small>Generate a strategy item from your business context.</small></div><ChevronRight size={16}/></button></div></div></div>}
  </div>;
}
