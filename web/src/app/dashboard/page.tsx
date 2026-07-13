"use client";
import "../strategy.css";

import {
  Archive, BarChart3, Bell, Bot, Building2, CalendarDays, Check, CheckCircle2, ChevronDown, ChevronRight,
  Circle, CircleHelp, Copy, FileDown, Home, Lightbulb, LogOut, MoreHorizontal, Pencil, Plus, Search, Settings,
  Sparkles, Target, Trash2, UserCircle2, UsersRound, X,
} from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { PadiworksMark } from "@/components/auth/padiworks-mark";

type Objective = {
  id: string;
  title: string;
  progress: number;
  state: "On track" | "At risk" | "Behind";
  initials: string;
  color: string;
  completed: boolean;
};

type Priority = {
  id: string;
  title: string;
  tag: string;
  items: Objective[];
};

type ScopeTab = "Organization" | "Teams";

const initialOrgPriorities: Priority[] = [
  {
    id: "market-leadership",
    title: "Market Leadership",
    tag: "Strategic growth",
    items: [
      { id: "ml-1", title: "Continue top-line growth that outpaces the industry", progress: 28, state: "On track", initials: "MD", color: "#ffd867", completed: false },
      { id: "ml-2", title: "Lead the shift to sustainable, tech-forward products", progress: 56, state: "On track", initials: "SA", color: "#ffc7d2", completed: true },
      { id: "ml-3", title: "Become the top-of-mind brand for our category enthusiasts", progress: 63, state: "Behind", initials: "JT", color: "#a8ddef", completed: false },
    ],
  },
  {
    id: "tech-transformation",
    title: "Tech Transformation",
    tag: "Transformation",
    items: [
      { id: "tt-1", title: "Modernise the core platform and improve delivery velocity", progress: 71, state: "On track", initials: "AK", color: "#c9e6cc", completed: false },
      { id: "tt-2", title: "Build an AI-ready data and capability foundation", progress: 42, state: "At risk", initials: "BI", color: "#d9ccff", completed: false },
    ],
  },
];

const initialTeamPriorities: Priority[] = [
  {
    id: "product-team",
    title: "Product Team Roadmap",
    tag: "Team priority",
    items: [
      { id: "pt-1", title: "Ship v2 onboarding experience", progress: 82, state: "On track", initials: "PW", color: "#ffe08b", completed: false },
      { id: "pt-2", title: "Reduce sign-up drop-off by 15%", progress: 34, state: "At risk", initials: "TN", color: "#c6e8f4", completed: false },
    ],
  },
  {
    id: "growth-team",
    title: "Growth Team Roadmap",
    tag: "Team priority",
    items: [
      { id: "gt-1", title: "Launch referral program", progress: 19, state: "Behind", initials: "OJ", color: "#ffc7d2", completed: false },
    ],
  },
];

const PALETTE = ["#ffd867", "#ffc7d2", "#a8ddef", "#c9e6cc", "#d9ccff", "#ffe08b", "#c6e8f4"];

const notifications = [
  { id: 1, title: 'AK commented on "Build an AI-ready data foundation"', time: "2h ago" },
  { id: 2, title: "Strategy health score increased to 78", time: "6h ago" },
  { id: 3, title: 'JT marked "Become the top-of-mind brand" as Behind', time: "1d ago" },
];

const dateOptions = ["This week", "This month", "This quarter", "Custom range"];

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

function DropdownMenu({
  id,
  openMenu,
  onToggle,
  trigger,
  align = "left",
  className = "",
  children,
}: {
  id: string;
  openMenu: string | null;
  onToggle: (id: string) => void;
  trigger: ReactNode;
  align?: "left" | "right";
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className="menu-wrap">
      <span onClick={() => onToggle(id)}>{trigger}</span>
      {openMenu === id && <div className={`menu-panel menu-${align} ${className}`.trim()}>{children}</div>}
    </div>
  );
}

function ScoreCard({ score, title, note, delta, onView }: { score: number; title: string; note: string; delta: string; onView: () => void }) {
  return <article className="score-card">
    <div className="score-ring" style={{ "--score": `${score * 3.6}deg` } as React.CSSProperties}><span>{score}</span></div>
    <div className="score-copy"><span className="ai-label"><Sparkles size={11} /> AI score</span><strong>{title}</strong><small>{delta} · {note}</small></div>
    <button aria-label={`View ${title}`} onClick={onView}><ChevronRight size={18} /></button>
  </article>;
}

function ObjectiveRow({
  item,
  groupId,
  openMenu,
  onToggleMenu,
  onToggleComplete,
  onRemove,
}: {
  item: Objective;
  groupId: string;
  openMenu: string | null;
  onToggleMenu: (id: string) => void;
  onToggleComplete: (groupId: string, itemId: string) => void;
  onRemove: (groupId: string, itemId: string) => void;
}) {
  const behind = item.state !== "On track";
  return <div className={`objective-row${item.completed ? " completed" : ""}`}>
    <span className="objective-icon"><Target size={15} /></span>
    <div className="objective-title"><strong>{item.title}</strong><span>Top-level OKR</span></div>
    <div className="cycle"><strong>Q3–Q4 Strategy Cycle</strong><span>Jul 01, 2026 – Dec 31, 2026</span></div>
    <Avatar initials={item.initials} color={item.color} />
    <div className="row-progress"><div><i className={behind ? "behind" : ""} style={{ width: `${item.progress}%` }} /></div><span>{item.progress}%</span></div>
    <span className={`status ${behind ? "behind" : ""}`}><i />{item.state}</span>
    <DropdownMenu
      id={`objective-${groupId}-${item.id}`}
      openMenu={openMenu}
      onToggle={onToggleMenu}
      align="right"
      trigger={<button className="plain-icon" aria-label="Objective options"><MoreHorizontal size={17} /></button>}
    >
      <button onClick={() => onToggleComplete(groupId, item.id)}>
        {item.completed ? <><Circle size={14} /> Mark as incomplete</> : <><CheckCircle2 size={14} /> Mark complete</>}
      </button>
      <div className="menu-divider" />
      <button className="danger" onClick={() => onRemove(groupId, item.id)}><Trash2 size={14} /> Remove objective</button>
    </DropdownMenu>
  </div>;
}

function PriorityCard({
  group,
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
}: {
  group: Priority;
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
}) {
  const [open, setOpen] = useState(true);
  const visibleItems = group.items.filter(
    (item) => !(hideCompleted && item.completed) && item.title.toLowerCase().includes(query.toLowerCase())
  );
  return <section className="priority-card">
    <header>
      <button className="plain-icon" onClick={() => setOpen(!open)} aria-label="Toggle priority"><ChevronDown className={!open ? "closed" : ""} size={17} /></button>
      <span className="target-badge"><Target size={16} /></span>
      <div><h3>{group.title}</h3><span className="priority-tag">{group.tag}</span></div>
      <div className="priority-state">
        <span>Current</span><b><i /> On track</b>
        <DropdownMenu
          id={`priority-${group.id}`}
          openMenu={openMenu}
          onToggle={onToggleMenu}
          align="right"
          trigger={<button className="plain-icon" aria-label="Priority options"><MoreHorizontal size={17} /></button>}
        >
          <button onClick={() => onRename(group.id, group.title)}><Pencil size={14} /> Rename</button>
          <button onClick={() => onDuplicate(group.id)}><Copy size={14} /> Duplicate</button>
          <div className="menu-divider" />
          <button className="danger" onClick={() => onDelete(group.id, group.title)}><Trash2 size={14} /> Delete priority</button>
        </DropdownMenu>
      </div>
    </header>
    {open && <div className="priority-body">
      <button className="add-inline" aria-label="Add objective" onClick={() => onAddObjective(group.id)}><Plus size={18} /></button>
      {visibleItems.map((item) => (
        <ObjectiveRow
          key={item.id}
          item={item}
          groupId={group.id}
          openMenu={openMenu}
          onToggleMenu={onToggleMenu}
          onToggleComplete={onToggleComplete}
          onRemove={onRemoveObjective}
        />
      ))}
      {visibleItems.length === 0 && <p className="priority-empty">No objectives yet — use the + button to add one.</p>}
    </div>}
  </section>;
}

export default function DashboardPage() {
  const router = useRouter();
  const [tab, setTab] = useState<ScopeTab>("Organization");
  const [view, setView] = useState<"Planner" | "Timeline">("Planner");
  const [hideCompleted, setHideCompleted] = useState(false);
  const [tour, setTour] = useState(true);
  const [query, setQuery] = useState("");
  const [insightsOpen, setInsightsOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [unread, setUnread] = useState(3);
  const [dateRange, setDateRange] = useState("No date range applied");
  const [sortDir, setSortDir] = useState<"asc" | "desc" | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; text: string }[]>([]);
  const [draft, setDraft] = useState("");
  const [priorityData, setPriorityData] = useState<Record<ScopeTab, Priority[]>>({
    Organization: initialOrgPriorities,
    Teams: initialTeamPriorities,
  });

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

  function updateActiveList(updater: (list: Priority[]) => Priority[]) {
    setPriorityData((prev) => ({ ...prev, [tab]: updater(prev[tab]) }));
  }

  function addPriority() {
    const title = window.prompt("Name this strategic priority", "New strategic priority");
    if (!title) return;
    const group: Priority = { id: `p-${Date.now()}`, title, tag: "Custom", items: [] };
    updateActiveList((list) => [group, ...list]);
    showToast(`Added "${title}"`);
  }

  function renameGroup(groupId: string, currentTitle: string) {
    const title = window.prompt("Rename priority", currentTitle);
    setOpenMenu(null);
    if (!title) return;
    updateActiveList((list) => list.map((g) => (g.id === groupId ? { ...g, title } : g)));
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
    if (!window.confirm(`Delete "${title}"? This can't be undone.`)) return;
    updateActiveList((list) => list.filter((g) => g.id !== groupId));
    showToast("Priority deleted");
  }

  function addObjective(groupId: string) {
    const title = window.prompt("What's the new objective?");
    setOpenMenu(null);
    if (!title) return;
    const initials = title.split(/\s+/).map((word) => word[0]).join("").slice(0, 2).toUpperCase() || "NA";
    const color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
    const item: Objective = { id: `o-${Date.now()}`, title, progress: 0, state: "On track", initials, color, completed: false };
    updateActiveList((list) => list.map((g) => (g.id === groupId ? { ...g, items: [item, ...g.items] } : g)));
    showToast("Objective added");
  }

  function toggleObjectiveComplete(groupId: string, itemId: string) {
    updateActiveList((list) =>
      list.map((g) => (g.id === groupId ? { ...g, items: g.items.map((item) => (item.id === itemId ? { ...item, completed: !item.completed } : item)) } : g))
    );
    setOpenMenu(null);
  }

  function removeObjective(groupId: string, itemId: string) {
    updateActiveList((list) => list.map((g) => (g.id === groupId ? { ...g, items: g.items.filter((item) => item.id !== itemId) } : g)));
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

  const activeList = priorityData[tab];
  const visibleGroups = activeList.filter(
    (group) =>
      group.title.toLowerCase().includes(query.toLowerCase()) ||
      group.items.some((item) => item.title.toLowerCase().includes(query.toLowerCase()))
  );

  return <div className="strategy-app">
    <aside className="slim-sidebar">
      <Logo />
      <nav>{menuItems.map(({ label, icon: Icon, active }) => <button key={label} className={active ? "active" : ""} aria-label={label} title={label}><Icon size={18} /><span>{label}</span></button>)}</nav>
      <div className="sidebar-bottom"><button aria-label="Help" title="Help"><CircleHelp size={18} /><span>Help</span></button><Avatar initials="AL" color="#dce9ff" /></div>
    </aside>

    <main>
      <header className="topbar">
        <div className="page-title">
          <h1>Organization Strategy</h1>
          <button className="star" aria-label="Favorite" onClick={() => setFavorited((f) => !f)}>{favorited ? "★" : "☆"}</button>
          <DropdownMenu
            id="page"
            openMenu={openMenu}
            onToggle={handleToggleMenu}
            trigger={<button className="plain-icon" aria-label="More options"><MoreHorizontal size={18} /></button>}
          >
            <button onClick={() => { showToast("Strategy duplicated"); setOpenMenu(null); }}><Copy size={14} /> Duplicate strategy</button>
            <button onClick={() => { showToast("Preparing PDF export…"); setOpenMenu(null); }}><FileDown size={14} /> Export as PDF</button>
            <div className="menu-divider" />
            <button className="danger" onClick={() => { showToast("Strategy archived"); setOpenMenu(null); }}><Archive size={14} /> Archive strategy</button>
          </DropdownMenu>
          <button className="insights-button" onClick={() => setInsightsOpen(true)}><Sparkles size={15} /> Ask Padi AI</button>
        </div>
        <div className="top-actions">
          <label className="header-search"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search strategy" /></label>
          <button className="create-button" onClick={() => setCreateOpen(true)}><Plus size={19} /></button>
          <DropdownMenu
            id="bell"
            openMenu={openMenu}
            onToggle={handleToggleMenu}
            align="right"
            className="notif-panel"
            trigger={<button className="bell" aria-label="Notifications"><Bell size={18} />{unread > 0 && <i />}</button>}
          >
            <div className="notif-header">Notifications</div>
            {notifications.map((n) => <div key={n.id} className="notif-item"><strong>{n.title}</strong><span>{n.time}</span></div>)}
          </DropdownMenu>
          <DropdownMenu
            id="profile"
            openMenu={openMenu}
            onToggle={handleToggleMenu}
            align="right"
            trigger={<Avatar initials="AL" color="#e9e2f8" />}
          >
            <div className="notif-header">Alex Adeyemi</div>
            <button onClick={() => { showToast("Profile settings coming soon"); setOpenMenu(null); }}><UserCircle2 size={14} /> View profile</button>
            <button onClick={() => { showToast("Account settings coming soon"); setOpenMenu(null); }}><Settings size={14} /> Account settings</button>
            <div className="menu-divider" />
            <button className="danger" onClick={() => router.push("/login")}><LogOut size={14} /> Log out</button>
          </DropdownMenu>
        </div>
      </header>

      <div className="workspace">
        <div className="scope-tabs">
          <button className={tab === "Organization" ? "active" : ""} onClick={() => setTab("Organization")}><Building2 size={14} /> Organization</button>
          <button className={tab === "Teams" ? "active" : ""} onClick={() => setTab("Teams")}><UsersRound size={14} /> Teams</button>
        </div>

        <div className="collaborators"><span>Owners and collaborators</span><div><Avatar initials="BI" color="#c5edaa" /><Avatar initials="AK" color="#ffe08b" /><Avatar initials="MI" color="#ffc7ca" /><Avatar initials="JT" color="#c6e8f4" /><Avatar initials="SA" color="#d8c8f1" /></div></div>

        <section className="strategy-narrative"><div className="narrative-mark"><PadiworksMark className="size-6" /></div><div><span>Strategy narrative</span><h2>Become the operating system for execution intelligence in growth companies.</h2><p>Win through measurable customer value, AI-native capability, and an accountable high-performance culture.</p></div><button onClick={() => setInsightsOpen(true)}>Review with Padi AI <ChevronRight size={15} /></button></section>

        <div className="scores">
          <ScoreCard score={78} title="Strategy health" delta="+4 this week" note="Objectives are well-defined & owned" onView={() => { setInsightsOpen(true); showToast("Opening insights for Strategy health"); }} />
          <ScoreCard score={64} title="Strategy execution alignment" delta="−2 this week" note="Some teams are drifting from priorities" onView={() => { setInsightsOpen(true); showToast("Opening insights for Strategy execution alignment"); }} />
        </div>

        <div className="view-tabs"><button className={view === "Planner" ? "active" : ""} onClick={() => setView("Planner")}>Planner</button><button className={view === "Timeline" ? "active" : ""} onClick={() => setView("Timeline")}>Timeline</button></div>

        <section className="plan-section">
          <div className="plan-header">
            <div><h2>Plan details</h2><button onClick={reorderPlan}>Reorder plan</button></div>
            <div>
              <button className="soft-button" onClick={addPriority}><Plus size={15} /> Add strategic priority</button>
              <button className={`check-button ${hideCompleted ? "checked" : ""}`} onClick={() => setHideCompleted(!hideCompleted)}><i>{hideCompleted && <Check size={12} />}</i> Hide completed</button>
              <DropdownMenu
                id="date"
                openMenu={openMenu}
                onToggle={handleToggleMenu}
                trigger={<button className="date-button"><CalendarDays size={16} /><span><small>Date filter</small>{dateRange}</span><ChevronDown size={15} /></button>}
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
                  query={query}
                  hideCompleted={hideCompleted}
                  openMenu={openMenu}
                  onToggleMenu={handleToggleMenu}
                  onRename={renameGroup}
                  onDuplicate={duplicateGroup}
                  onDelete={deleteGroup}
                  onAddObjective={addObjective}
                  onToggleComplete={toggleObjectiveComplete}
                  onRemoveObjective={removeObjective}
                />
              ))}
              {visibleGroups.length === 0 && <div className="empty-state"><Search size={24} /><strong>No strategy items found</strong><span>Try a different search term.</span></div>}
            </div>
          ) : (
            <div className="timeline-view">
              <div className="timeline-months"><span>July</span><span>August</span><span>September</span><span>October</span><span>November</span><span>December</span></div>
              {visibleGroups.map((group, i) => (
                <div className="timeline-row" key={group.id}>
                  <strong>{group.title}</strong>
                  <i style={{ left: `${i * 13 + 8}%`, width: `${58 - i * 9}%` }}><span>{group.items.length} objectives</span></i>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>

    <button className="tour-button" onClick={() => setTour(true)}><span><Bot size={18} /></span> Book a 1-on-1 tour</button>
    {tour && <aside className="tour-card"><button onClick={() => setTour(false)}><X size={16} /></button><span><Sparkles size={17} /></span><div><strong>New to Strategy?</strong><p>See how priorities connect to objectives, teams, and execution evidence.</p><div><button onClick={() => setTour(false)}>Maybe later</button><button onClick={() => setTour(false)}>Start guided tour</button></div></div></aside>}

    {insightsOpen && <div className="drawer-backdrop" onClick={() => setInsightsOpen(false)}>
      <aside className="ai-drawer" onClick={(event) => event.stopPropagation()}>
        <header><div><Image src="/images/auth/bot-icon.svg" alt="Padi AI" width={36} height={36} /><div><strong>Padi AI</strong><span>Strategy intelligence</span></div></div><button onClick={() => setInsightsOpen(false)}><X size={18} /></button></header>
        <section className="ai-summary"><span><Sparkles size={13} /> Executive insight</span><h2>Your strategy is clear, but execution is uneven.</h2><p>Market Leadership is healthy. Tech Transformation is under-supported by capability and ownership signals.</p></section>
        <div className="recommendations">
          <h3>Recommended actions</h3>
          <article><b>01</b><div><strong>Clarify transformation ownership</strong><p>Two objectives have contributors but no single accountable owner.</p></div></article>
          <article><b>02</b><div><strong>Connect work to outcomes</strong><p>11 active work items are not linked to a strategic priority.</p></div></article>
          <article><b>03</b><div><strong>Close the AI capability gap</strong><p>Create a development objective for data and AI readiness.</p></div></article>
        </div>
        {messages.length > 0 && <div className="chat-log">{messages.map((m, i) => <div key={i} className={`chat-bubble ${m.role}`}>{m.text}</div>)}</div>}
        <label className="ask-padi">
          <input placeholder="Ask about this strategy…" value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") sendMessage(); }} />
          <button onClick={sendMessage}><ChevronRight size={17} /></button>
        </label>
      </aside>
    </div>}

    {createOpen && <div className="drawer-backdrop" onClick={() => setCreateOpen(false)}>
      <div className="create-modal" onClick={(event) => event.stopPropagation()}>
        <button className="modal-close" onClick={() => setCreateOpen(false)}><X size={18} /></button>
        <span className="modal-icon"><Target size={20} /></span>
        <h2>Create strategy item</h2>
        <p>Start at the right level so every objective and work item stays traceable.</p>
        <div className="create-options">
          <button onClick={() => { setCreateOpen(false); addPriority(); }}><span><Target size={17} /></span><div><strong>Strategic priority</strong><small>Define a major direction for the organisation.</small></div><ChevronRight size={16} /></button>
          <button onClick={() => { setCreateOpen(false); if (activeList[0]) addObjective(activeList[0].id); }}><span><BarChart3 size={17} /></span><div><strong>Objective and key results</strong><small>Turn a priority into measurable outcomes.</small></div><ChevronRight size={16} /></button>
          <button onClick={() => { setCreateOpen(false); setInsightsOpen(true); }}><span><Sparkles size={17} /></span><div><strong>Draft with Padi AI</strong><small>Generate a strategy item from your business context.</small></div><ChevronRight size={16} /></button>
        </div>
      </div>
    </div>}

    {toast && <div className="toast">{toast}</div>}
  </div>;
}
