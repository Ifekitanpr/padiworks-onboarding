"use client";

import { useEffect, useState } from "react";
import {
  KeyResultModal,
  ObjectiveDrawer,
  OkrBuilder,
  ProgressModal,
  type KrType,
} from "./objectives-workspace";
import "./strategy-workspace.css";

type Section = "entry" | "priorities" | "knowledge" | "setup";
type Modal =
  | null
  | "delete-priority"
  | "add-priority"
  | "reorder"
  | "loading"
  | "delete-guardrail";

const priorities = [
  {
    title: "Market Leadership",
    progress: 50,
    status: "On track",
    color: "green",
  },
  {
    title: "Tech Transformation",
    progress: 30,
    status: "At risk",
    color: "orange",
  },
  {
    title: "Tech Transformation",
    progress: 10,
    status: "Off track",
    color: "red",
  },
  {
    title: "Tech Transformation",
    progress: 100,
    status: "Completed",
    color: "green",
    past: true,
  },
];

const teamPriorities = [
  {
    title: "Platform Reliability",
    progress: 72,
    status: "On track",
    color: "green",
  },
  {
    title: "AI-ready Engineering",
    progress: 46,
    status: "At risk",
    color: "orange",
  },
  {
    title: "Delivery Excellence",
    progress: 18,
    status: "Off track",
    color: "red",
  },
];

const objectives = [
  ["Continue top-line growth that outpaces the industry", 70, "On track"],
  ["Lead the shift to sustainable, tech-forward products", 41, "At risk"],
  [
    "Become the top-of-mind brand for our category enthusiasts",
    12,
    "Off track",
  ],
  [
    "Become the top-of-mind brand for our category enthusiasts",
    0,
    "Not started",
  ],
] as const;
const strategyAsset = (name: string) => `/assets/dashboard/strategy/${name}`;

export function StrategyWorkspace({
  initialSection = "entry",
  emptyPriorities = false,
  initialScope = "organization",
}: {
  initialSection?: Section;
  emptyPriorities?: boolean;
  initialScope?: "organization" | "teams";
}) {
  const [scope, setScope] = useState(initialScope);
  const [team, setTeam] = useState("Engineering");
  const [section, setSection] = useState<Section>(initialSection);
  const [modal, setModal] = useState<Modal>(null);
  const [planner, setPlanner] = useState<"planner" | "timeline">("planner");
  const [expanded, setExpanded] = useState(false);
  const [timeframeOpen, setTimeframeOpen] = useState(false);
  const [timeframe, setTimeframe] = useState("In 3 years");
  const [objectiveDrawer, setObjectiveDrawer] = useState(false);
  const [strategyDrawerTab, setStrategyDrawerTab] = useState<
    "Overview" | "Key Results" | "Updates" | "Relationships" | "Comments"
  >("Overview");
  const [strategyKrModal, setStrategyKrModal] = useState(false);
  const [strategyKrType, setStrategyKrType] = useState<KrType>("Metric");
  const [strategyKrSuggestions, setStrategyKrSuggestions] = useState(false);
  const [strategyProgress, setStrategyProgress] = useState(false);
  const [strategyOkrBuilder, setStrategyOkrBuilder] = useState(false);
  const [menu, setMenu] = useState<string | null>(null);
  const [knowledgeTab, setKnowledgeTab] = useState<
    "links" | "documents" | "context"
  >("links");
  const [setupTab, setSetupTab] = useState<
    | "foundation"
    | "direction"
    | "execution"
    | "mandate"
    | "omtm"
    | "capabilities"
  >("foundation");
  const [editSetup, setEditSetup] = useState(false);
  const [setupSource, setSetupSource] = useState<"ai" | "manual">("ai");
  const [addLink, setAddLink] = useState(false);
  const [links, setLinks] = useState<string[]>([]);

  const navigate = (next: Section) => {
    setSection(next);
    const path =
      scope === "teams"
        ? next === "entry"
          ? "/dashboard/strategy/teams"
          : `/dashboard/strategy/teams/${next === "knowledge" ? "knowledge-base" : next}`
        : next === "entry"
          ? "/dashboard/strategy"
          : `/dashboard/strategy/${next === "knowledge" ? "knowledge-base" : next}`;
    window.history.replaceState({}, "", path);
  };
  const switchScope = (nextScope: "organization" | "teams") => {
    setScope(nextScope);
    setSection("entry");
    setSetupTab(nextScope === "teams" ? "mandate" : "foundation");
    setEditSetup(false);
    window.history.replaceState(
      {},
      "",
      nextScope === "teams"
        ? "/dashboard/strategy/teams"
        : "/dashboard/strategy",
    );
  };

  useEffect(() => {
    if (modal !== "loading") return;
    const setupTimer = window.setTimeout(() => {
      setSetupSource("ai");
      setModal(null);
      navigate("setup");
    }, 1400);
    return () => window.clearTimeout(setupTimer);
    // The current scope determines the destination when generation completes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modal, scope]);

  return (
    <main className="dash-shell">
      <DashboardRail />
      <div className="dash-stage">
        <div className="trial-banner">
          Your free trial remains 14 days　•　<u>Upgrade plan</u>
        </div>
        <DashboardToolbar />
        <div className="dash-content">
          <div className="scope-switch">
            <button
              className={scope === "organization" ? "active" : ""}
              onClick={() => switchScope("organization")}
            >
              Organization
            </button>
            <button
              className={scope === "teams" ? "active" : ""}
              onClick={() => switchScope("teams")}
            >
              Teams
            </button>
          </div>
          <header className="strategy-heading">
            <div>
              <h1>
                {scope === "teams"
                  ? "Team Strategy & Planning"
                  : "Organization Strategy & Planning"}
              </h1>
              <p>
                {scope === "teams"
                  ? "Turn team mandate into strategic priorities aligned with organization strategy."
                  : "Turn organization DNA into strategic priorities for measurable execution"}
              </p>
            </div>
            <button className="learn-button">
              <img src="/assets/dashboard/book.svg" alt="" />
              Learn about strategy
            </button>
          </header>
          {scope === "teams" && (
            <div className="team-switcher">
              {["Engineering", "Product", "Sales"].map((name) => (
                <button
                  key={name}
                  className={team === name ? "active" : ""}
                  onClick={() => setTeam(name)}
                >
                  {name}
                </button>
              ))}
            </div>
          )}
          <ScoreCards populated={section === "priorities"} />
          {section === "priorities" && <StrategyWarning variant="review" />}
          <nav className="strategy-tabs">
            <button
              className={section === "priorities" ? "active" : ""}
              onClick={() => navigate("priorities")}
            >
              <img src="/assets/dashboard/target.svg" alt="" /> Priorities
            </button>
            <button
              className={section === "knowledge" ? "active" : ""}
              onClick={() => navigate("knowledge")}
            >
              <img src="/assets/dashboard/folder.svg" alt="" /> Knowledge base
            </button>
            <button
              className={
                section === "setup" || section === "entry" ? "active" : ""
              }
              onClick={() => navigate("setup")}
            >
              <img src="/assets/dashboard/layers.svg" alt="" /> Setup
            </button>
          </nav>
          {section === "entry" && (
            <EntryPanel
              teamMode={scope === "teams"}
              onAI={() => setModal("loading")}
              onManual={() => {
                setSetupSource("manual");
                setEditSetup(true);
                navigate("setup");
              }}
            />
          )}
          {section === "priorities" && (
            <Priorities
              empty={emptyPriorities}
              planner={planner}
              setPlanner={setPlanner}
              expanded={expanded}
              setExpanded={setExpanded}
              menu={menu}
              setMenu={setMenu}
              setModal={setModal}
              teamMode={scope === "teams"}
              timeframe={timeframe}
              timeframeOpen={timeframeOpen}
              setTimeframeOpen={setTimeframeOpen}
              setTimeframe={setTimeframe}
              openObjective={() => setObjectiveDrawer(true)}
              addObjective={() => setStrategyOkrBuilder(true)}
            />
          )}
          {section === "knowledge" && (
            <KnowledgeBase
              tab={knowledgeTab}
              setTab={setKnowledgeTab}
              addLink={addLink}
              setAddLink={setAddLink}
              links={links}
              setLinks={setLinks}
            />
          )}
          {section === "setup" && (
            <StrategySetup
              teamMode={scope === "teams"}
              tab={setupTab}
              setTab={setSetupTab}
              edit={editSetup}
              setEdit={setEditSetup}
              setModal={setModal}
              manual={setupSource === "manual"}
            />
          )}
        </div>
      </div>
      {modal && (
        <DashboardModal
          type={modal}
          close={() => setModal(null)}
          onComplete={() => {
            setModal(null);
            if (modal === "loading") navigate("setup");
          }}
        />
      )}
      {objectiveDrawer && (
        <ObjectiveDrawer
          tab={strategyDrawerTab}
          setTab={setStrategyDrawerTab}
          close={() => setObjectiveDrawer(false)}
          onAdd={() => setStrategyKrModal(true)}
          onProgress={() => setStrategyProgress(true)}
        />
      )}
      {strategyKrModal && (
        <KeyResultModal
          type={strategyKrType}
          setType={setStrategyKrType}
          suggestions={strategyKrSuggestions}
          setSuggestions={setStrategyKrSuggestions}
          close={() => setStrategyKrModal(false)}
        />
      )}
      {strategyProgress && (
        <ProgressModal close={() => setStrategyProgress(false)} />
      )}
      {strategyOkrBuilder && (
        <OkrBuilder
          close={() => setStrategyOkrBuilder(false)}
          onAdd={() => setStrategyKrModal(true)}
        />
      )}
    </main>
  );
}

export function DashboardRail({
  activeArea = "Strategy",
}: {
  activeArea?: "Strategy" | "Objectives";
}) {
  const items = [
    ["home.svg", "Home"],
    ["sidebar-icon-2.svg", "Strategy"],
    ["sidebar-icon-3.svg", "Objectives"],
    ["sidebar-icon-4.svg", "Performance"],
    ["sidebar-icon-5.svg", "Teams"],
    ["sidebar-icon-6.svg", "Insights"],
  ];
  return (
    <aside className="dash-rail">
      <div className="rail-mark">
        <img src="/assets/dashboard/logomark.svg" alt="Padiworks" />
      </div>
      <button className="workspace-mark">PW</button>
      <button className="rail-add">
        <img src={strategyAsset("plus.svg")} alt="Add workspace" />
      </button>
      <nav>
        {items.map(([icon, label]) => (
          <button
            key={label}
            className={label === activeArea ? "active" : ""}
            onClick={() => {
              if (label === "Strategy")
                window.location.href = "/dashboard/strategy";
              if (label === "Objectives")
                window.location.href = "/dashboard/objectives";
            }}
          >
            <img src={`/assets/dashboard/${icon}`} alt="" />
            <span>{label}</span>
          </button>
        ))}
      </nav>
      <button className="rail-settings">
        <img src="/assets/dashboard/sidebar-icon-7.svg" alt="" />
        <span>Settings</span>
      </button>
    </aside>
  );
}

export function DashboardToolbar() {
  return (
    <header className="dash-toolbar">
      <div>
        <button>
          <img src="/assets/dashboard/arrow-left.svg" alt="Back" />
        </button>
        <button disabled>
          <img src="/assets/dashboard/arrow-right.svg" alt="Forward" />
        </button>
        <span>
          All Workspaces　
          <img
            className="breadcrumb-icon"
            src="/assets/dashboard/breadcrumb.svg"
            alt=""
          />
          　<b>Epa&apos;s Workspace</b>
        </span>
      </div>
      <div>
        <span className="role-switch">
          Employee　 <b>Admin</b>
        </span>
        <button>
          <img src="/assets/dashboard/bell.svg" alt="Notifications" />
        </button>
        <button className="ai-orb">
          <img src="/assets/dashboard/ai-white.svg" alt="AI" />
        </button>
        <img
          className="toolbar-avatar"
          src="/assets/dashboard/avatar.png"
          alt="Patrick"
        />
        <button>
          <img
            src="/assets/dashboard/chevron-down.svg"
            alt="Open account menu"
          />
        </button>
      </div>
    </header>
  );
}

function ScoreCards({ populated }: { populated: boolean }) {
  return (
    <section className="score-grid">
      {[
        [
          "Strategy Health",
          populated ? 78 : 0,
          populated
            ? "+4 this week · Objectives are well-defined & owned"
            : "+0 this week",
        ],
        [
          "Strategy Execution Alignment",
          78,
          populated
            ? "-2 this week · Some teams drifting from priorities"
            : "+0 this week",
        ],
      ].map(([label, score, copy]) => (
        <article key={String(label)}>
          <div
            className={`score-ring ${populated ? "score-ring-78" : "score-ring-0"}`}
          >
            <b>{score}%</b>
          </div>
          <div>
            <span>
              <img src="/assets/dashboard/ai-purple.svg" alt="" /> AI score
            </span>
            <strong>{label}</strong>
            <small>{copy}</small>
          </div>
          <img
            className="score-chevron"
            src="/assets/dashboard/chevron-right.svg"
            alt=""
          />
        </article>
      ))}
    </section>
  );
}

export function StrategyWarning({
  variant,
}: {
  variant: "review" | "drift" | "disconnect";
}) {
  const copy = {
    review: [
      "STRATEGY REVIEW DUE",
      "It’s time to review your strategy",
      "Your strategy has reached its scheduled review period. Review it with Padi AI to confirm it still reflects your current priorities, market conditions, and long-term direction.",
    ],
    drift: [
      "OKR DRIFT",
      "Some objectives are drifting",
      "Review objectives that no longer align with the organization’s priorities.",
    ],
    disconnect: [
      "EXECUTION DISCONNECTION",
      "Strategy and execution need reconnecting",
      "Some team plans are disconnected from active strategic priorities.",
    ],
  }[variant];
  return (
    <aside className={`strategy-warning ${variant}`}>
      <b className="warning-mark">
        <img src="/assets/dashboard/logomark.svg" alt="" />
      </b>
      <div>
        <small>{copy[0]}</small>
        <strong>{copy[1]}</strong>
        <p>{copy[2]}</p>
      </div>
      <button>
        Review with Padi AI{" "}
        <img src="/assets/dashboard/arrow-right.svg" alt="" />
      </button>
    </aside>
  );
}

function EntryPanel({
  onAI,
  onManual,
  teamMode = false,
}: {
  onAI: () => void;
  onManual: () => void;
  teamMode?: boolean;
}) {
  return (
    <section className="entry-wrap">
      <article className="entry-card">
        <div className="bot-badge">
          <img src="/assets/dashboard/bot.svg" alt="Padi AI" />
        </div>
        <div>
          <h2>
            Use padiAI to quickly draft your{" "}
            {teamMode ? "team's" : "organization's"} strategy.
          </h2>
          <p>
            Save time with our Execution Intelligence AI, which drafts your{" "}
            {teamMode ? "team's" : "organization's"} strategy foundations,
            directions, and execution plans. You can easily make manual edits
            anytime.
          </p>
          <div className="entry-tags">
            {(teamMode
              ? [
                  "Mandate",
                  "OMTM (One Metric That Matters)",
                  "Team Capabilities",
                ]
              : [
                  "Vision",
                  "Purpose",
                  "NSM",
                  "Guardrails",
                  "Business model",
                  "Operating model",
                  "Value streams",
                  "Business capabilities",
                ]
            ).map((x) => (
              <span key={x}>{x}</span>
            ))}
          </div>
          <div>
            <button className="primary" onClick={onAI}>
              <img src="/assets/dashboard/ai-button.svg" alt="" /> Proceed with
              AI
            </button>
            <button className="secondary" onClick={onManual}>
              Setup Manually
            </button>
          </div>
        </div>
        <div className="entry-art">
          <img
            src={
              teamMode
                ? "/assets/dashboard/team/entry-illustration.png"
                : "/assets/dashboard/profile-source.png"
            }
            alt="Strategy setup illustration"
          />
        </div>
      </article>
    </section>
  );
}

function Priorities({
  empty,
  planner,
  setPlanner,
  expanded,
  setExpanded,
  menu,
  setMenu,
  setModal,
  teamMode,
  timeframe,
  timeframeOpen,
  setTimeframeOpen,
  setTimeframe,
  openObjective,
  addObjective,
}: any) {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(
    expanded ? new Set([0]) : new Set(),
  );
  const [hideCompleted, setHideCompleted] = useState(false);
  const [completedObjectives, setCompletedObjectives] = useState<Set<number>>(
    new Set(),
  );
  const displayedPriorities = teamMode ? teamPriorities : priorities;
  const togglePriority = (index: number) => {
    setExpandedRows((current) => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
    if (index === 0) setExpanded(!expandedRows.has(index));
  };
  return (
    <section className="priority-section">
      <div className="section-title">
        <div>
          <h2>Strategic priorities</h2>
          <button onClick={() => setModal("reorder")}>Reorder plan</button>
        </div>
        <div>
          <button
            className={
              hideCompleted ? "hide-completed checked" : "hide-completed"
            }
            onClick={() => setHideCompleted(!hideCompleted)}
          >
            <img
              className="checkbox-mark"
              src={strategyAsset("checkbox.svg")}
              alt=""
            />
            Hide completed
          </button>
          <div className="timeframe-control">
            <button onClick={() => setTimeframeOpen(!timeframeOpen)}>
              {timeframe} <img src={strategyAsset("chevron-down.svg")} alt="" />
            </button>
            {timeframeOpen && (
              <div className="timeframe-menu">
                {["In 3 years", "In 5 years", "In 10 years"].map((value) => (
                  <button
                    key={value}
                    onClick={() => {
                      setTimeframe(value);
                      setTimeframeOpen(false);
                    }}
                  >
                    {value}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button className="primary" onClick={() => setModal("add-priority")}>
            <img src={strategyAsset("plus-white.svg")} alt="" /> Add strategic
            priority
          </button>
        </div>
      </div>
      <div className="view-tabs">
        <button
          className={planner === "planner" ? "active" : ""}
          onClick={() => setPlanner("planner")}
        >
          <img src={strategyAsset("planner.svg")} alt="" /> Planner
        </button>
        <button
          className={planner === "timeline" ? "active" : ""}
          onClick={() => setPlanner("timeline")}
        >
          <img src={strategyAsset("gantt.svg")} alt="" /> Timeline
        </button>
      </div>
      {empty ? (
        <div className="priority-empty">
          <b>
            <img src={strategyAsset("priority-target.svg")} alt="" />
          </b>
          <h3>No strategic priorities created yet</h3>
          <p>
            We couldn&apos;t find any items for strategic priorities in
            <br /> your workspace. Start by creating one
          </p>
          <button onClick={() => setModal("add-priority")}>
            <img src={strategyAsset("plus.svg")} alt="" /> Create a strategic
            priority
          </button>
        </div>
      ) : planner === "timeline" ? (
        <Timeline />
      ) : (
        <div className="priority-list">
          {displayedPriorities
            .filter((item) => !(hideCompleted && item.status === "Completed"))
            .map((item, index) => (
              <div
                className="priority-item-wrap"
                key={`${item.title}-${index}`}
              >
                <b className="priority-number">#{index + 1}</b>
                <article
                  className="priority-row"
                  onClick={() => togglePriority(index)}
                >
                  <button
                    className="priority-target"
                    onClick={(event) => {
                      event.stopPropagation();
                      togglePriority(index);
                    }}
                  >
                    <img src={strategyAsset("priority-target-01.svg")} alt="" />
                  </button>
                  <button
                    className="row-chevron"
                    onClick={(event) => {
                      event.stopPropagation();
                      togglePriority(index);
                    }}
                  >
                    <img
                      src={
                        expandedRows.has(index)
                          ? strategyAsset("chevron-down.svg")
                          : strategyAsset("chevron-right.svg")
                      }
                      alt=""
                    />
                  </button>
                  <div className="priority-copy">
                    <strong>{item.title}</strong>
                    <span>
                      <i
                        className={item.color}
                        style={{ width: `${item.progress}%` }}
                      />{" "}
                      <b>{item.progress}%</b>
                    </span>
                  </div>
                  <button
                    className="small-plus"
                    onClick={(event) => {
                      event.stopPropagation();
                      addObjective();
                    }}
                  >
                    <img src={strategyAsset("plus.svg")} alt="Add" />
                  </button>
                  <span className="ai-score">
                    <img src="/assets/dashboard/ai-purple.svg" alt="AI score" />
                    60%
                  </span>
                  <em>{"past" in item && item.past ? "Past" : "Active"}</em>
                  <small>
                    <i className={item.color} /> {item.status}
                  </small>
                  <button
                    className="kebab"
                    onClick={(event) => {
                      event.stopPropagation();
                      setMenu(
                        menu === `priority-${index}`
                          ? null
                          : `priority-${index}`,
                      );
                    }}
                  >
                    <img
                      src={strategyAsset("dots-horizontal.svg")}
                      alt="More"
                    />
                  </button>
                  {menu === `priority-${index}` && (
                    <Menu
                      items={["Rename", "Duplicate", "Delete priority"]}
                      onLast={() => setModal("delete-priority")}
                    />
                  )}
                </article>
                {expandedRows.has(index) && (
                  <div className="objective-tree">
                    {objectives.map(
                      ([title, value, originalStatus], objectiveIndex) => {
                        const status = completedObjectives.has(objectiveIndex)
                          ? "Completed"
                          : originalStatus;
                        return (
                          <article
                            key={`${title}-${objectiveIndex}`}
                            onClick={openObjective}
                          >
                            <b>
                              <img
                                src={strategyAsset("objective-target-04.svg")}
                                alt="Objective"
                              />
                            </b>
                            <div>
                              <strong>
                                {index === 0
                                  ? title
                                  : index === 1
                                    ? [
                                        "Modernise the core platform for reliable scale",
                                        "Build an AI-ready data foundation",
                                        "Reduce release lead time across engineering",
                                        "Strengthen security and operational resilience",
                                      ][objectiveIndex]
                                    : [
                                        "Increase adoption of our priority workflows",
                                        "Improve customer time-to-value",
                                        "Expand evidence-led performance practices",
                                        "Raise cross-team execution predictability",
                                      ][objectiveIndex]}
                              </strong>
                              <small>
                                Top level OKR　
                                <img
                                  src={strategyAsset("objective-calendar.svg")}
                                  alt=""
                                />{" "}
                                Jul 01, 2026 – Dec 31, 2026
                              </small>
                            </div>
                            <span className={`pie p${value}`}>{value}%</span>
                            <small>
                              <i
                                className={`status-bullet ${status.toLowerCase().replace(" ", "-")}`}
                              />
                              {status}
                            </small>
                            <button
                              onClick={(event) => {
                                event.stopPropagation();
                                setMenu(
                                  menu === `objective-${objectiveIndex}`
                                    ? null
                                    : `objective-${objectiveIndex}`,
                                );
                              }}
                            >
                              <img
                                src={strategyAsset("objective-dots.svg")}
                                alt="More"
                              />
                            </button>
                            {menu === `objective-${objectiveIndex}` && (
                              <Menu
                                items={[
                                  "Open",
                                  "Edit",
                                  "Mark complete",
                                  "Move to",
                                  "Remove objective",
                                ]}
                                onSelect={(item) => {
                                  if (item === "Mark complete") {
                                    setCompletedObjectives((current) => {
                                      const next = new Set(current);
                                      next.add(objectiveIndex);
                                      return next;
                                    });
                                  }
                                  if (item === "Open") openObjective();
                                  setMenu(null);
                                }}
                              />
                            )}
                          </article>
                        );
                      },
                    )}
                  </div>
                )}
              </div>
            ))}
        </div>
      )}
    </section>
  );
}

function Menu({
  items,
  onLast,
  onSelect,
}: {
  items: string[];
  onLast?: () => void;
  onSelect?: (item: string) => void;
}) {
  const menuIcon = (item: string) =>
    item.includes("Duplicate")
      ? "menu-copy.svg"
      : item.includes("Delete") || item.includes("Remove")
        ? "menu-trash.svg"
        : item.includes("Mark")
          ? "menu-check-circle.svg"
          : item.includes("Open")
            ? "menu-open.svg"
            : item.includes("Move")
              ? "menu-arrow-right.svg"
              : "menu-edit-02.svg";
  return (
    <div className="dash-menu" onClick={(event) => event.stopPropagation()}>
      {items.map((item, index) => (
        <button
          key={item}
          className={index === items.length - 1 ? "danger" : ""}
          onClick={() => {
            if (index === items.length - 1 && onLast) onLast();
            onSelect?.(item);
          }}
        >
          <img src={strategyAsset(menuIcon(item))} alt="" />
          {item}
        </button>
      ))}
    </div>
  );
}

function Timeline() {
  return (
    <article className="timeline-card">
      <header>
        <div>
          <small>Q3–Q4 STRATEGY CYCLE</small>
          <h3>Execution timeline</h3>
          <p>See when priorities overlap and where delivery needs attention.</p>
        </div>
        <div>
          <span>
            <i className="status-bullet on-track" />
            On track　3
          </span>
          <span>
            <i className="status-bullet at-risk" />
            At risk　1
          </span>
          <span>
            <i className="status-bullet off-track" />
            Off track　1
          </span>
        </div>
      </header>
      <div className="timeline-grid">
        <div className="timeline-labels">
          <b>PRIORITY AND OBJECTIVE</b>
          {[
            ["Market Leadership", true],
            ["Continue top-line growt...", false],
            ["Lead the shift to sustain...", false],
            ["Become the top-of-min...", false],
            ["Tech Transformation", true],
            ["Modernise the core plat...", false],
            ["Build an AI-ready data...", false],
          ].map(([label, priority]) => (
            <span
              key={String(label)}
              className={priority ? "priority-label" : "objective-label"}
            >
              <img
                src={strategyAsset(
                  priority
                    ? "priority-target-01.svg"
                    : "objective-target-04.svg",
                )}
                alt=""
              />
              {label}
            </span>
          ))}
        </div>
        <div className="timeline-chart">
          <header>
            {[
              "JULY",
              "AUGUST",
              "SEPTEMBER",
              "OCTOBER",
              "NOVEMBER",
              "DECEMBER",
            ].map((x) => (
              <b key={x}>{x}</b>
            ))}
          </header>
          {[
            ["purple", 0, 100],
            ["green", 18, 66],
            ["green", 28, 25],
            ["red", 48, 36],
            ["purple", 0, 100],
            ["green", 18, 28],
            ["orange", 28, 48],
          ].map(([c, left, width], i) => (
            <div className="timeline-line" key={i}>
              <i
                className={String(c)}
                style={{ left: `${left}%`, width: `${width}%` }}
              >
                {i > 0 ? `${[20, 50, 60, 0, 0, 71, 42][i]}%` : ""}
              </i>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

function KnowledgeBase({
  tab,
  setTab,
  addLink,
  setAddLink,
  links,
  setLinks,
}: any) {
  return (
    <section className="subpage">
      <header>
        <h2>Knowledge base</h2>
        <Usage />
      </header>
      <article className="knowledge-card">
        <SubTabs
          tabs={["links", "documents", "context"]}
          current={tab}
          setCurrent={setTab}
          labels={["Links", "Documents", "Additional Context"]}
          icons={["link.svg", "file.svg", "edit.svg"]}
        />
        {tab === "links" && (
          <LinksPanel
            addLink={addLink}
            setAddLink={setAddLink}
            links={links}
            setLinks={setLinks}
          />
        )}{" "}
        {tab === "documents" && <DocumentsPanel />}
        {tab === "context" && <ContextPanel />}
      </article>
    </section>
  );
}

function LinksPanel({ addLink, setAddLink, links, setLinks }: any) {
  return (
    <div className="links-panel">
      <LinkInput icon="globe.svg" label="Website" value="" />
      <LinkInput icon="in" label="Linkedin" value="" />
      {links.map((link: string) => (
        <LinkInput key={link} icon="link.svg" label="Link title" value={link} />
      ))}
      {addLink && (
        <div className="add-link-box">
          <label>
            Link title
            <input placeholder="E.g. Strategic planning documentation" />
          </label>
          <label>
            Attach URL
            <span>
              <b>https://</b>
              <input placeholder="Enter a valid link" />
            </span>
          </label>
          <button
            className="primary"
            onClick={() => {
              setLinks([...links, "acme-corp.com"]);
              setAddLink(false);
            }}
          >
            Add link to knowledge base
          </button>
          <button className="trash">
            <img src={strategyAsset("trash.svg")} alt="Delete" />
          </button>
        </div>
      )}
      <button className="soft" onClick={() => setAddLink(true)}>
        <img src={strategyAsset("plus.svg")} alt="" /> Add new link
      </button>
    </div>
  );
}
function LinkInput({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <label className="kb-link">
      <span>
        <b>{icon === "in" ? "in" : <img src={strategyAsset(icon)} alt="" />}</b>
        {label}
      </span>
      <div>
        <b>https://</b>
        <input defaultValue={value} placeholder="Enter a valid link" />
      </div>
    </label>
  );
}
function DocumentsPanel() {
  return (
    <div className="documents-panel">
      <label className="upload-doc">
        <input type="file" />
        <b>
          <img src={strategyAsset("file.svg")} alt="" />
        </b>
        <span>
          Upload strategy / business plan, recent OKR document, company handbook
          <small>Supported Format: PDF, DOCX, TXT (10mb max each)</small>
        </span>
      </label>
      <div className="doc-list">
        {[1, 2].map((x) => (
          <div key={x}>
            <b>
              <img src={strategyAsset("file.svg")} alt="" />
            </b>
            <span>
              Title of document　<small>PDF　•　5MB</small>
            </span>
            <button>
              <img src={strategyAsset("trash.svg")} alt="Delete" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
function ContextPanel() {
  return (
    <div className="context-panel">
      <textarea placeholder="Anything else PadiworksAI should know — recent pivots, top constraints, upcoming initiatives..." />
      <button className="primary">Save changes</button>
    </div>
  );
}

function StrategySetup({
  tab,
  setTab,
  edit,
  setEdit,
  setModal,
  teamMode,
  manual,
}: any) {
  if (teamMode)
    return (
      <TeamStrategySetup
        tab={tab}
        setTab={setTab}
        edit={edit}
        setEdit={setEdit}
        manual={manual}
      />
    );
  return (
    <section className="subpage">
      <header>
        <h2>Strategy setup</h2>
        <Usage />
      </header>
      <article className="setup-card">
        <SubTabs
          tabs={["foundation", "direction", "execution"]}
          current={tab}
          setCurrent={(x: string) => {
            setTab(x);
            setEdit(false);
          }}
          labels={["Foundation", "Direction", "Execution"]}
        />
        <div className="setup-body">
          {tab === "foundation" && <Foundation edit={edit} setEdit={setEdit} manual={manual} />}{" "}
          {tab === "direction" && (
            <Direction edit={edit} setEdit={setEdit} setModal={setModal} manual={manual} />
          )}{" "}
          {tab === "execution" && <Execution manual={manual} />}
          <LearnCard tab={tab} />
        </div>
      </article>
    </section>
  );
}

function TeamStrategySetup({ tab, setTab, edit, setEdit, manual }: any) {
  const teamTabs = ["mandate", "omtm", "capabilities"];
  const current = teamTabs.includes(tab) ? tab : "mandate";
  return (
    <section className="subpage team-setup-page">
      <article className="setup-card">
        <SubTabs
          tabs={teamTabs}
          current={current}
          setCurrent={(x: string) => {
            setTab(x);
            setEdit(false);
          }}
          labels={["Mandate", "OMTM", "Capabilities"]}
        />
        <div className="setup-body">
          <div className="setup-fields">
            {current === "mandate" && (
              <label>
                <span>
                  Team mandate statement{" "}
                  <img src={strategyAsset("info.svg")} alt="Information" />{" "}
                  <button onClick={() => setEdit(!edit)}>
                    <img src={strategyAsset("edit.svg")} alt="" />
                    {edit ? "Refine with AI" : "Edit"}
                  </button>
                </span>
                {edit || manual ? (
                  <textarea placeholder="Enter team mandate" />
                ) : (
                  <p>
                    In a world where dreams intertwine with reality, the
                    possibilities are endless.
                  </p>
                )}
                {edit && !manual && (
                  <div>
                    <button className="primary" onClick={() => setEdit(false)}>
                      Save changes
                    </button>
                    <button className="soft" onClick={() => setEdit(false)}>
                      Cancel
                    </button>
                  </div>
                )}
              </label>
            )}
            {current === "omtm" && (
              <>
                <h3>OMTM (One Metric That Matters)</h3>
                {["This month", "This quarter", "This year"].map(
                  (period, index) => (
                    <label key={period}>
                      <span>
                        {period}{" "}
                        <img
                          src={strategyAsset("info.svg")}
                          alt="Information"
                        />{" "}
                        <button onClick={() => index === 0 && setEdit(!edit)}>
                          <img src={strategyAsset("edit.svg")} alt="" />
                          Edit
                        </button>
                      </span>
                      {(edit && index === 0) || manual ? (
                        <input placeholder="Enter an NSM" />
                      ) : (
                        <p>Filled</p>
                      )}
                    </label>
                  ),
                )}
              </>
            )}
            {current === "capabilities" && (
              <label>
                <span>
                  Capabilities{" "}
                  <img src={strategyAsset("info.svg")} alt="Information" />
                </span>
                {!manual && [1, 2, 3].map((x) => (
                  <div className="metric" key={x}>
                    E.g. Strategic planning documentation{" "}
                    <button>
                      <img src={strategyAsset("edit.svg")} alt="Edit" />
                    </button>
                    <button>
                      <img src={strategyAsset("trash.svg")} alt="Delete" />
                    </button>
                  </div>
                ))}
                {manual && <input placeholder="Enter a team capability" />}
                <button className="soft">
                  <img src={strategyAsset("plus.svg")} alt="" />
                  Add new capability
                </button>
              </label>
            )}
          </div>
          <LearnCard
            tab={
              current === "mandate"
                ? "foundation"
                : current === "omtm"
                  ? "direction"
                  : "execution"
            }
          />
        </div>
      </article>
    </section>
  );
}
function Foundation({ edit, setEdit, manual }: any) {
  return (
    <div className="setup-fields">
      {["Vision statement", "Purpose statement"].map((label, index) => (
        <label key={label}>
          <span>
            {label} <img src={strategyAsset("info.svg")} alt="Information" />{" "}
            <button onClick={() => setEdit(!edit)}>
              <img src={strategyAsset("edit.svg")} alt="" />
              {edit ? "Refine with AI" : "Edit"}
            </button>
          </span>
          {edit || manual ? (
            <textarea placeholder={`Enter ${label.toLowerCase()}`} />
          ) : (
            <p>
              In a world where dreams intertwine with reality, the possibilities
              are endless.
            </p>
          )}
          {edit && !manual && (
            <div>
              <button className="primary" onClick={() => setEdit(false)}>
                Save changes
              </button>
              <button className="soft" onClick={() => setEdit(false)}>
                Cancel
              </button>
            </div>
          )}
        </label>
      ))}
    </div>
  );
}
function Direction({ edit, setEdit, setModal, manual }: any) {
  return (
    <div className="setup-fields">
      <label>
        <span>
          NSM <img src={strategyAsset("info.svg")} alt="Information" />{" "}
          <button onClick={() => setEdit(!edit)}>
            <img src={strategyAsset("edit.svg")} alt="" />
            {edit ? "Refine with AI" : "Edit"}
          </button>
        </span>
        {edit || manual ? <input placeholder="Enter an NSM" /> : <p>Filled</p>}
        {edit && !manual && (
          <div>
            <button className="primary" onClick={() => setEdit(false)}>
              Save changes
            </button>
            <button className="soft" onClick={() => setEdit(false)}>
              Cancel
            </button>
          </div>
        )}
      </label>
      <label>
        <span>
          Guardrail metrics{" "}
          <img src={strategyAsset("info.svg")} alt="Information" />
        </span>
        {!manual && [1, 2, 3].map((x) => (
          <div className="metric" key={x}>
            E.g. Strategic planning documentation{" "}
            <button>
              <img src={strategyAsset("edit.svg")} alt="Edit" />
            </button>
            <button onClick={() => setModal("delete-guardrail")}>
              <img src={strategyAsset("trash.svg")} alt="Delete" />
            </button>
          </div>
        ))}
        {manual && <input placeholder="Enter a guardrail metric" />}
        <button className="soft">
          <img src={strategyAsset("plus.svg")} alt="" />
          Add new guardrail
        </button>
      </label>
    </div>
  );
}
function Execution({ manual }: { manual?: boolean }) {
  return (
    <div className="setup-fields">
      <label>
        <span>
          Business model{" "}
          <button>
            <img src={strategyAsset("edit.svg")} alt="" />
            Edit
          </button>
        </span>
        {manual ? <textarea placeholder="Describe your business model" /> : <p>
          We provide a subscription-based platform that connects freelance
          graphic designers with small businesses seeking affordable,
          high-quality design services.
        </p>}
      </label>
      <label>
        <span>
          Operating Model{" "}
          <button>
            <img src={strategyAsset("edit.svg")} alt="" />
            Edit
          </button>
        </span>
        {manual ? <textarea placeholder="Describe your operating model" /> : <p>
          Our platform uses AI-driven matching algorithms to pair clients with
          designers, supports project management tools for collaboration, and
          handles secure payments and feedback.
        </p>}
      </label>
      {["Capabilities", "Value Streams"].map((label) => (
        <label key={label}>
          <span>
            {label} <img src={strategyAsset("info.svg")} alt="Information" />
          </span>
          {!manual && [1, 2, 3].map((x) => (
            <div className="metric" key={x}>
              E.g. Strategic planning documentation{" "}
              <button>
                <img src={strategyAsset("edit.svg")} alt="Edit" />
              </button>
              <button>
                <img src={strategyAsset("trash.svg")} alt="Delete" />
              </button>
            </div>
          ))}
          {manual && <input placeholder={`Enter a ${label.toLowerCase().replace(/s$/, "")}`} />}
          <button className="soft">
            <img src={strategyAsset("plus.svg")} alt="" />
            Add new {label.toLowerCase().replace(/s$/, "")}
          </button>
        </label>
      ))}
    </div>
  );
}
function LearnCard({ tab }: { tab: string }) {
  const copy =
    tab === "foundation"
      ? [
          "What is vision & purpose statement.",
          "A vision statement defines what an organization wants to achieve, while a purpose statement explains why it exists.",
        ]
      : tab === "direction"
        ? [
            "What is NSM & guardrails metrics",
            "North Star Metric (NSM) is the single most important metric that drives a company’s growth and success.\n\nGuardrails are boundaries or guidelines that ensure decisions and actions stay aligned with a company’s goals and values.",
          ]
        : [
            "What are business execution elements",
            "Defines how your organization creates, delivers, and scales value. Configure your business model, operating model, core capabilities, and value streams to establish the operational foundation that powers strategy execution.",
          ];
  return (
    <aside className="learn-card">
      <div className="learn-video">
        <span>▶</span>
      </div>
      <h3>{copy[0]}</h3>
      <p>{copy[1]}</p>
      <button>
        <img src="/assets/dashboard/book.svg" alt="" />
        Learn more
      </button>
    </aside>
  );
}
function Usage() {
  return (
    <span className="usage">
      Space usage <img src={strategyAsset("info.svg")} alt="Information" />
      <i />
      <b>50%</b>
    </span>
  );
}
function SubTabs({ tabs, current, setCurrent, labels, icons }: any) {
  return (
    <nav className="sub-tabs">
      {tabs.map((tab: string, index: number) => (
        <button
          key={tab}
          className={current === tab ? "active" : ""}
          onClick={() => setCurrent(tab)}
        >
          {icons?.[index] && <img src={strategyAsset(icons[index])} alt="" />}
          {labels[index]}
        </button>
      ))}
    </nav>
  );
}

function DashboardModal({
  type,
  close,
  onComplete,
}: {
  type: Exclude<Modal, null>;
  close: () => void;
  onComplete: () => void;
}) {
  const [horizon, setHorizon] = useState("In 3 years");
  if (type === "loading")
    return (
      <div className="modal-layer">
        <div className="loading-modal">
          <i />
          <strong>Setting up your strategy...</strong>
          <button onClick={close}>Cancel</button>
        </div>
      </div>
    );
  if (type === "delete-priority" || type === "delete-guardrail")
    return (
      <div className="modal-layer">
        <div className="confirm-modal">
          <b>
            <img src={strategyAsset("alert.svg")} alt="Warning" />
          </b>
          <h2>
            Delete{" "}
            {type === "delete-priority"
              ? "strategic priority"
              : "guardrail metric"}
          </h2>
          <p>
            This will permanently delete the item and disconnect it from all
            item relationships it currently has. Are you sure you want to
            continue?
          </p>
          <footer>
            <button onClick={close}>Cancel</button>
            <button className="danger" onClick={onComplete}>
              Yes, delete
            </button>
          </footer>
        </div>
      </div>
    );
  if (type === "reorder")
    return (
      <div className="modal-layer">
        <div className="form-modal">
          <header>
            Reorder plan{" "}
            <button onClick={close}>
              <img src="/assets/dashboard/objectives/close.svg" alt="Close" />
            </button>
          </header>
          <div>
            <b className="modal-icon">
              <img
                src="/assets/onboarding-scales-02.svg"
                alt="Priority weights"
              />
            </b>
            <h2>Edit priority weights</h2>
            <p>
              This will help PadiworksAI prioritize your strategic priorities.
            </p>
            <div className="weight-total">
              Total weight score: <b>100%</b>
            </div>
            <small>STRATEGIC PRIORITY　　　　　　　　　WEIGHT</small>
            {[
              ["Market Leadership", 60],
              ["Tech Transformation", 40],
            ].map(([label, value]) => (
              <label key={String(label)}>
                {label}
                <input defaultValue={`${value}%`} />
              </label>
            ))}
          </div>
          <footer>
            <button onClick={close}>Cancel</button>
            <button className="primary" onClick={onComplete}>
              Save changes
            </button>
          </footer>
        </div>
      </div>
    );
  return (
    <div className="modal-layer">
      <div className="form-modal add-modal">
        <header>
          Organization strategy{" "}
          <button onClick={close}>
            <img src="/assets/dashboard/objectives/close.svg" alt="Close" />
          </button>
        </header>
        <div>
          <b className="modal-icon add-priority-icon">
            <span>
              <img src={strategyAsset("add-priority-user.svg")} alt="" />
            </span>
            <span>
              <img
                src={strategyAsset("add-priority-target.svg")}
                alt="Strategic priority"
              />
            </span>
          </b>
          <h2>Add strategic priority</h2>
          <p>
            Define a clear strategic direction that objectives and team plans
            can align to.
          </p>
          <label>
            Priority name
            <input placeholder="e.g. Expand market leadership" />
          </label>
          <fieldset>
            <legend>How soon do you plan to achieve this?</legend>
            {["In 3 years", "In 5 years", "In 10 years"].map((x) => (
              <button
                type="button"
                onClick={() => setHorizon(x)}
                className={horizon === x ? "active" : ""}
                key={x}
              >
                <i className="radio-mark" />
                {x}
              </button>
            ))}
          </fieldset>
          <div className="ai-suggest">
            AI Strategy Alignment score: <b>78%</b>
            <button>
              <img src="/assets/dashboard/ai-purple.svg" alt="" />
              Suggest with AI
            </button>
          </div>
        </div>
        <footer>
          <button onClick={close}>Cancel</button>
          <span>
            <button>
              <img src="/assets/dashboard/ai-purple.svg" alt="" />
              Brainstorm with AI
            </button>
            <button className="primary" onClick={onComplete}>
              Add priority
            </button>
          </span>
        </footer>
      </div>
    </div>
  );
}
