"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DashboardRail, DashboardToolbar } from "./strategy-workspace";
import "./objectives-workspace.css";

type DrawerTab =
  "Overview" | "Key Results" | "Updates" | "Relationships" | "Comments";
export type KrType = "Metric" | "Baseline" | "Milestone";
const objectiveAsset = (name: string) => `/assets/dashboard/objectives/${name}`;

export function ObjectivesWorkspace() {
  const [drawer, setDrawer] = useState(false);
  const [drawerTab, setDrawerTab] = useState<DrawerTab>("Overview");
  const [builder, setBuilder] = useState(false);
  const [krModal, setKrModal] = useState(false);
  const [krType, setKrType] = useState<KrType>("Metric");
  const [suggestions, setSuggestions] = useState(false);
  const [progress, setProgress] = useState(false);
  const [owner, setOwner] = useState("All");
  const [risk, setRisk] = useState("On track");
  const [filterOpen, setFilterOpen] = useState<"owner" | "risk" | null>(null);

  return (
    <main className="dash-shell objective-shell">
      <DashboardRail activeArea="Objectives" />
      <div className="dash-stage">
        <div className="trial-banner">
          Your free trial <b>remains 14 days</b>　•　<u>Upgrade plan</u>
        </div>
        <DashboardToolbar />
        <div className="objective-content">
          <header className="objective-heading">
            <div>
              <h1>Objectives</h1>
              <p>
                Translate strategy into measurable outcomes. Objectives guide
                key goals for this cycle.
              </p>
            </div>
            <button className="learn-button">
              <img src="/assets/dashboard/book.svg" alt="" />
              Learn about objectives
            </button>
          </header>
          <div className="objective-scope">
            <button className="active">Organization</button>
            <button>Teams</button>
          </div>
          <div className="objective-tabs">
            <button className="active">OKRs</button>
            <button>Operational Objectives</button>
          </div>
          <div className="objective-tools">
            <label>
              <img src={objectiveAsset("search-lg-exact.svg")} alt="" />
              <input placeholder="Search Objectives" />
            </label>
            <div className="objective-filter">
              <button
                onClick={() =>
                  setFilterOpen(filterOpen === "owner" ? null : "owner")
                }
                aria-expanded={filterOpen === "owner"}
              >
                <span>Owners:</span>
                <b>{owner}</b>
                <img src={objectiveAsset("filter-chevron.svg")} alt="" />
              </button>
              <AnimatePresence>
                {filterOpen === "owner" && (
                  <motion.div
                    className="objective-filter-menu"
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -5, scale: 0.98 }}
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {["All", "Priya Wong", "Ada Maria", "Elmer Laverty"].map(
                      (value) => (
                        <button
                          key={value}
                          className={owner === value ? "active" : ""}
                          onClick={() => {
                            setOwner(value);
                            setFilterOpen(null);
                          }}
                        >
                          {value}
                        </button>
                      ),
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="objective-filter">
              <button
                onClick={() =>
                  setFilterOpen(filterOpen === "risk" ? null : "risk")
                }
                aria-expanded={filterOpen === "risk"}
              >
                <span>Risk:</span>
                <b>{risk}</b>
                <img src={objectiveAsset("filter-chevron.svg")} alt="" />
              </button>
              <AnimatePresence>
                {filterOpen === "risk" && (
                  <motion.div
                    className="objective-filter-menu"
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -5, scale: 0.98 }}
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {[
                      "All",
                      "On track",
                      "At risk",
                      "Off track",
                      "Not started",
                    ].map((value) => (
                      <button
                        key={value}
                        className={risk === value ? "active" : ""}
                        onClick={() => {
                          setRisk(value);
                          setFilterOpen(null);
                        }}
                      >
                        {value}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button className="new-okr" onClick={() => setBuilder(true)}>
              <img src={objectiveAsset("plus-white-exact.svg")} alt="" />
              New OKR
            </button>
          </div>
          {[true, false, false].map((expanded, i) => (
            <ObjectiveCard
              key={i}
              expanded={expanded}
              onOpen={() => setDrawer(true)}
              onProgress={() => setProgress(true)}
            />
          ))}
        </div>
      </div>
      {drawer && (
        <ObjectiveDrawer
          tab={drawerTab}
          setTab={setDrawerTab}
          close={() => setDrawer(false)}
          onAdd={() => setKrModal(true)}
          onProgress={() => setProgress(true)}
        />
      )}
      {builder && (
        <OkrBuilder
          close={() => setBuilder(false)}
          onAdd={() => setKrModal(true)}
        />
      )}
      {krModal && (
        <KeyResultModal
          type={krType}
          setType={setKrType}
          suggestions={suggestions}
          setSuggestions={setSuggestions}
          close={() => setKrModal(false)}
        />
      )}
      {progress && <ProgressModal close={() => setProgress(false)} />}
    </main>
  );
}

function ObjectiveCard({
  expanded: initiallyExpanded,
  onOpen,
  onProgress,
}: {
  expanded: boolean;
  onOpen: () => void;
  onProgress: () => void;
}) {
  const [expanded, setExpanded] = useState(initiallyExpanded);
  return (
    <article className="objective-card">
      <div className="objective-card-main" onClick={onOpen}>
        <div className="objective-labels">
          <b>
            <img src={objectiveAsset("on-track-chart.svg")} alt="" /> ON TRACK
          </b>
          <span>
            <img src={objectiveAsset("card-calendar.svg")} alt="" /> MAR 17 -
            JUL 28
          </span>
          <button onClick={(event) => event.stopPropagation()}>
            <img src={objectiveAsset("card-more.svg")} alt="More" />
          </button>
        </div>
        <div className="objective-card-copy">
          <div>
            <h2>Boost qualified leads from our website for Q4 sales.</h2>
            <p>
              Our objective is to boost the volume of high-quality leads coming
              from our website, which will play a crucial role in achieving our
              sales goals for the fourth quarter.
            </p>
            <div className="avatar-stack">
              {[1, 2, 3, 4, 5, 6].map((x) => (
                <img
                  key={x}
                  src={objectiveAsset(`avatar-${x}.png`)}
                  alt="Contributor"
                />
              ))}
              <i>+3</i>
            </div>
          </div>
          <button
            className="objective-progress"
            onClick={(e) => {
              e.stopPropagation();
              onProgress();
            }}
          >
            0%
          </button>
        </div>
      </div>
      <footer onClick={() => setExpanded(!expanded)}>
        <img
          src={objectiveAsset(expanded ? "eye-off.svg" : "branch.svg")}
          alt=""
        />
        {expanded
          ? "Hide your contributing key results"
          : "Show your contributing key results"}
        <small>Jul 29 at 9:11am</small>
      </footer>
      {expanded && (
        <div className="kr-list">
          <div>
            └　<em>50</em> Increase sales in ADC by 10%{" "}
            <span>
              Engineering　 <i className="status-dot" />
              70%　 ON TRACK{" "}
              <img src={objectiveAsset("dots-vertical-exact.svg")} alt="More" />
            </span>
          </div>
          <div>
            └　<em>50</em> Increase sales in ADC by 10%{" "}
            <span>
              Engineering　 <i className="status-dot" />
              70%　 ON TRACK{" "}
              <img src={objectiveAsset("dots-vertical-exact.svg")} alt="More" />
            </span>
          </div>
        </div>
      )}
    </article>
  );
}

export function ObjectiveDrawer({
  tab,
  setTab,
  close,
  onAdd,
  onProgress,
}: {
  tab: DrawerTab;
  setTab: (t: DrawerTab) => void;
  close: () => void;
  onAdd: () => void;
  onProgress: () => void;
}) {
  return (
    <div className="drawer-layer" onClick={close}>
      <aside className="objective-drawer" onClick={(e) => e.stopPropagation()}>
        <header>
          <small>
            Market Leadership{" "}
            <img src={objectiveAsset("drawer-arrow-right.svg")} alt="" />
          </small>
          <button onClick={close}>
            <img src={objectiveAsset("drawer-close.svg")} alt="Close" />
          </button>
          <h2>
            <img src={objectiveAsset("drawer-target.svg")} alt="" />
            Continue top-line growth that outpaces the industry
          </h2>
          <div className="drawer-meta">
            Top level OKR　{" "}
            <img src={objectiveAsset("drawer-calendar.svg")} alt="" /> Jul 17,
            2024 - Dec 31, 2025
          </div>
          <p>
            Our objective is to boost the volume of high-quality leads coming
            from our website, which will play a crucial role in achieving our
            sales goals for the fourth quarter.
          </p>
          <div className="drawer-actions">
            <b>
              <i className="status-dot" />
              70%　• On track
            </b>
            <button>
              <img src={objectiveAsset("drawer-ai.svg")} alt="" />
              Get AI Summary
            </button>
            <button onClick={onProgress}>Update Progress</button>
          </div>
        </header>
        <nav>
          {(
            [
              "Overview",
              "Key Results",
              "Updates",
              "Relationships",
              "Comments",
            ] as DrawerTab[]
          ).map((x) => (
            <button
              className={tab === x ? "active" : ""}
              onClick={() => setTab(x)}
              key={x}
            >
              {x}
            </button>
          ))}
        </nav>
        <DrawerBody tab={tab} onAdd={onAdd} />
      </aside>
    </div>
  );
}

function DrawerBody({ tab, onAdd }: { tab: DrawerTab; onAdd: () => void }) {
  const [period, setPeriod] = useState("Monthly");
  const [periodOpen, setPeriodOpen] = useState(false);
  const [updatesFilter, setUpdatesFilter] = useState("All updates");
  const [updatesOpen, setUpdatesOpen] = useState(false);
  const [relationships, setRelationships] = useState(1);
  const [risks, setRisks] = useState(2);
  const [editingDetails, setEditingDetails] = useState(false);
  if (tab === "Key Results")
    return (
      <section className="drawer-body">
        <div className="drawer-section-title">
          <b>Key Results (4)</b>
          <button onClick={onAdd}>
            <img src={objectiveAsset("plus-white.svg")} alt="" />
            Add key result
          </button>
        </div>
        {[70, 12, 41, 70].map((x, i) => (
          <div className="drawer-kr" key={i}>
            <div className="kr-progress-ring">{x}%</div>
            <div className="kr-copy">
              <b>
                {
                  [
                    "Increase sales in ADC by 10%",
                    "Grow qualified website leads by 30%",
                    "Improve lead-to-opportunity conversion",
                    "Launch two high-intent campaigns",
                  ][i]
                }
              </b>
              <small>Metric　•　Engineering</small>
            </div>
            <span>
              <i className="status-dot" /> ON TRACK
              <button>
                <img src={objectiveAsset("drawer-dots.svg")} alt="More" />
              </button>
            </span>
          </div>
        ))}
      </section>
    );
  if (tab === "Updates")
    return (
      <section className="drawer-body">
        <div className="drawer-section-title">
          <b>Progress updates</b>
          <div className="drawer-dropdown">
            <button onClick={() => setUpdatesOpen(!updatesOpen)}>
              {updatesFilter}{" "}
              <img src={objectiveAsset("chevron-down-exact.svg")} alt="" />
            </button>
            {updatesOpen && (
              <div>
                {["All updates", "Objective updates", "Key result updates"].map(
                  (value) => (
                    <button
                      key={value}
                      onClick={() => {
                        setUpdatesFilter(value);
                        setUpdatesOpen(false);
                      }}
                    >
                      {value}
                    </button>
                  ),
                )}
              </div>
            )}
          </div>
        </div>
        {[
          ["3", "6", "Increase sales in ADC by 10%"],
          ["1", "3", "Grow qualified website leads by 30%"],
        ].map(([from, to, title]) => (
          <div className="update-item" key={title}>
            <i className="timeline-dot" />
            <div className="update-head">
              <img src={objectiveAsset("avatar-1.png")} alt="" />
              <span>
                <b>Ada Maria</b> updated key result progress
                <small>12/12/2025 at 4:00PM</small>
              </span>
            </div>
            <p>{title}</p>
            <div className="update-change">
              <span>
                From <b>{from}</b>
              </span>
              <img src={objectiveAsset("drawer-arrow-right.svg")} alt="" />
              <span>
                To <b>{to}</b>
              </span>
            </div>
          </div>
        ))}
      </section>
    );
  if (tab === "Relationships")
    return (
      <section className="drawer-body">
        <div className="drawer-section-title">
          <b>Relationships</b>
          <button onClick={() => setRelationships(relationships + 1)}>
            <img src={objectiveAsset("plus-white.svg")} alt="" />
            Add Relationship
          </button>
        </div>
        {Array.from({ length: relationships }).map((_, index) => (
          <div className="relationship-card" key={index}>
            <small>ALIGNED TO</small>
            <div>
              <span className="relationship-icon">
                <img src={objectiveAsset("drawer-target.svg")} alt="" />
              </span>
              <div>
                <b>{index ? "Customer expansion" : "Market Leadership"}</b>
                <small>Strategic priority</small>
              </div>
              <img
                className="relationship-arrow"
                src={objectiveAsset("drawer-arrow-right.svg")}
                alt=""
              />
              <span className="relationship-owner">
                <i className="status-dot" />
                ON TRACK
                <img src={objectiveAsset("avatar-1.png")} alt="Owner" />
              </span>
            </div>
          </div>
        ))}
      </section>
    );
  if (tab === "Comments") return <CommentsPanel />;
  return (
    <section className="drawer-body">
      <div className="drawer-section-title">
        <b>Objective details</b>
        <button
          className="edit-detail"
          onClick={() => setEditingDetails(!editingDetails)}
        >
          <img src={objectiveAsset("edit-03.svg")} alt="" />
          Edit
        </button>
      </div>
      {editingDetails && (
        <form
          className="objective-details-editor"
          onSubmit={(event) => {
            event.preventDefault();
            setEditingDetails(false);
          }}
        >
          <label>
            Objective title
            <input defaultValue="Increase sales in ADC by 10%" />
          </label>
          <div>
            <label>
              Start date
              <input type="date" defaultValue="2025-02-09" />
            </label>
            <label>
              End date
              <input type="date" defaultValue="2025-03-12" />
            </label>
          </div>
          <label>
            Visibility
            <select defaultValue="Public">
              <option>Public</option>
              <option>Private</option>
            </select>
          </label>
          <footer>
            <button type="button" onClick={() => setEditingDetails(false)}>
              Cancel
            </button>
            <button className="primary" type="submit">
              Save changes
            </button>
          </footer>
        </form>
      )}
      <div className="detail-row owner-row">
        <span>
          <img src={objectiveAsset("avatar-1.png")} alt="" />
          <span>
            Owner<small>Priya Wong</small>
          </span>
        </span>
        <button>
          <img src={objectiveAsset("drawer-message.svg")} alt="Message owner" />
        </button>
      </div>
      {[
        ["Date created", "Feb 9, 2025"],
        ["Start date", "Feb 9, 2025"],
        ["End date", "Mar 12, 2025"],
        ["Last updated", "Mar 12, 2025"],
      ].map(([label, value]) => (
        <div className="detail-row" key={label}>
          <img src={objectiveAsset("drawer-calendar.svg")} alt="" />
          <span>{label}</span>
          <b>{value}</b>
        </div>
      ))}
      <div className="detail-row">
        <img src={objectiveAsset("drawer-eye.svg")} alt="" />
        <span>Visibility</span>
        <b>Public</b>
      </div>
      <div className="detail-row">
        <img src={objectiveAsset("drawer-users.svg")} alt="" />
        <span>Contributors</span>
        <div className="drawer-avatars">
          {[1, 2, 3, 4].map((x) => (
            <img key={x} src={objectiveAsset(`avatar-${x}.png`)} alt="" />
          ))}
          <b>+3</b>
        </div>
      </div>
      <div className="trend">
        <div className="trend-title">
          <b>Progress trend</b>
          <div className="drawer-dropdown">
            <button onClick={() => setPeriodOpen(!periodOpen)}>
              {period}{" "}
              <img src={objectiveAsset("chevron-down-exact.svg")} alt="" />
            </button>
            {periodOpen && (
              <div>
                {["Weekly", "Monthly", "Quarterly"].map((value) => (
                  <button
                    key={value}
                    onClick={() => {
                      setPeriod(value);
                      setPeriodOpen(false);
                    }}
                  >
                    {value}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="trend-chart">
          <div className="trend-y">
            <span>100%</span>
            <span>75%</span>
            <span>50%</span>
            <span>25%</span>
            <span>0%</span>
          </div>
          <img
            src={objectiveAsset("progress-trend.svg")}
            alt="Progress from July to October"
          />
          <div className="trend-x">
            <span>Jul 1</span>
            <span>Jul 15</span>
            <span>Aug 1</span>
            <span>Aug 15</span>
            <span>Sep 1</span>
            <span>Sep 15</span>
            <span>Oct 1</span>
            <span>Oct 15</span>
          </div>
        </div>
      </div>
      <div className="risks">
        <div className="risk-title">
          <b>Risks & blockers</b>
          <button onClick={() => setRisks(risks + 1)}>
            <img src={objectiveAsset("plus.svg")} alt="" /> Add risk
          </button>
        </div>
        <div className="risk-card">
          <p>
            <img src={objectiveAsset("drawer-alert.svg")} alt="" />
            Low website conversion rate may limit lead volume
            <img
              className="risk-more"
              src={objectiveAsset("dots-vertical-exact.svg")}
              alt="More"
            />
          </p>
          <footer>
            <span>
              <i className="high" />
              High
            </span>
            <em>Open</em>
          </footer>
        </div>
        <div className="risk-card medium">
          <p>
            <img src={objectiveAsset("drawer-alert.svg")} alt="" />
            Paid campaigns underperforming
            <img
              className="risk-more"
              src={objectiveAsset("dots-vertical-exact.svg")}
              alt="More"
            />
          </p>
          <footer>
            <span>
              <i />
              Medium
            </span>
            <em>Mitigating</em>
          </footer>
        </div>
        {risks > 2 && (
          <div className="risk-card">
            <p>
              <img src={objectiveAsset("drawer-alert.svg")} alt="" />
              New execution risk
              <img
                className="risk-more"
                src={objectiveAsset("dots-vertical-exact.svg")}
                alt="More"
              />
            </p>
            <footer>
              <span>
                <i className="high" />
                High
              </span>
              <em>Open</em>
            </footer>
          </div>
        )}
      </div>
    </section>
  );
}

function CommentsPanel() {
  const [adding, setAdding] = useState(false);
  const [comment, setComment] = useState("");
  const [savedComments, setSavedComments] = useState(2);
  return (
    <section className="drawer-body">
      <div className="drawer-section-title">
        <b>Comments</b>
      </div>
      {adding ? (
        <div className="comment-editor">
          <div className="comment-author">
            <img src={objectiveAsset("avatar-1.png")} alt="Elmer Laverty" />
            <span>
              <b>Elmer Laverty</b>
              <small>Add a new comment</small>
            </span>
          </div>
          <textarea
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Enter a comment"
          />
          <div className="comment-actions">
            <button
              onClick={() => {
                setAdding(false);
                setComment("");
              }}
            >
              Discard
            </button>
            <button
              className="primary"
              onClick={() => {
                if (comment.trim()) setSavedComments(savedComments + 1);
                setAdding(false);
                setComment("");
              }}
            >
              Save comment
            </button>
          </div>
        </div>
      ) : (
        <button className="add-comment" onClick={() => setAdding(true)}>
          <img src={objectiveAsset("plus.svg")} alt="" />
          Add a comment
        </button>
      )}
      {Array.from({ length: savedComments }).map((_, x) => (
        <div className="comment" key={x}>
          <div className="comment-author">
            <img
              src={objectiveAsset("avatar-" + ((x % 2) + 1) + ".png")}
              alt=""
            />
            <span>
              <b>Elmer Laverty</b>
              <small>dropped a comment</small>
            </span>
            <img
              className="comment-more"
              src={objectiveAsset("drawer-dots.svg")}
              alt="More"
            />
          </div>
          <p>
            {x >= 2
              ? "Progress is moving in the right direction."
              : "Needs improvement in clarity and responsiveness. Messages often lack detail, requiring clarification. More consistent communication would enhance team collaboration."}
          </p>
          <small>12/12/2025 at 4:00PM</small>
        </div>
      ))}
    </section>
  );
}

export function OkrBuilder({
  close,
  onAdd,
}: {
  close: () => void;
  onAdd: () => void;
}) {
  const [ownership, setOwnership] = useState<"organization" | "team">(
    "organization",
  );
  const [cycle, setCycle] = useState("");
  const [action, setAction] = useState("");
  const [outcome, setOutcome] = useState("");
  const [impact, setImpact] = useState("");
  const refine = () => {
    setAction("Increase");
    setOutcome("qualified website leads by 30%");
    setImpact("accelerate Q4 pipeline growth");
  };
  return (
    <div className="modal-layer okr-modal-layer">
      <section className="fullscreen-layer okr-modal-experience">
        <header>
          <img src={objectiveAsset("quill.svg")} alt="" /> OKR management{" "}
          <button onClick={close}>
            <img src={objectiveAsset("close.svg")} alt="Close" />
          </button>
        </header>
        <div className="okr-builder">
          <img
            className="okr-hero"
            src={objectiveAsset("okr-illustration.svg")}
            alt="OKR target"
          />
          <h1>Create new OKR</h1>
          <p>
            Objectives must be specific, measurable, achievable and time bound
          </p>
          <BuilderRow
            title="Objective details"
            copy="Fill basic details about this Objective"
          >
            <div className="sentence-input">
              <label>
                Objective title　{" "}
                <button type="button" onClick={refine}>
                  <img src={objectiveAsset("quill.svg")} alt="" /> Refine with
                  AI
                </button>
              </label>
              <span>
                Action:　
                <input
                  value={action}
                  onChange={(event) => setAction(event.target.value)}
                  placeholder="E.g Reduce, Increase, Grow, etc.."
                />
              </span>
              <span>
                What you want to do:　
                <input
                  value={outcome}
                  onChange={(event) => setOutcome(event.target.value)}
                  placeholder="E.g mobile app crashes."
                />
              </span>
              <i>· In order to/so that</i>
              <span>
                Business impact:　
                <input
                  value={impact}
                  onChange={(event) => setImpact(event.target.value)}
                  placeholder="E.g increase user satisfaction"
                />
              </span>
            </div>
          </BuilderRow>
          <BuilderRow
            title="Key Results"
            copy="Add points that fulfill this objective"
          >
            <button onClick={onAdd}>
              <img src={objectiveAsset("plus.svg")} alt="" /> Add a key result
            </button>
          </BuilderRow>
          <BuilderRow
            title="Ownership"
            copy="Dictate who is responsible for this objective"
          >
            <button
              type="button"
              className={ownership === "organization" ? "active" : ""}
              onClick={() => setOwnership("organization")}
            >
              <img src={objectiveAsset("building.svg")} alt="" />{" "}
              Organization-wide
            </button>
            　
            <button
              type="button"
              className={ownership === "team" ? "active" : ""}
              onClick={() => setOwnership("team")}
            >
              <img src={objectiveAsset("team.svg")} alt="" /> Team-wide
            </button>
            {ownership === "team" && (
              <select
                className="team-owner-select"
                aria-label="Select team"
                defaultValue=""
              >
                <option value="" disabled>
                  Select a team
                </option>
                <option>Engineering</option>
                <option>Product</option>
                <option>Sales</option>
              </select>
            )}
          </BuilderRow>
          <BuilderRow
            title="Additional details"
            copy="Define timelines, visibility, cycle, etc"
          >
            <select
              value={cycle}
              onChange={(event) => setCycle(event.target.value)}
              aria-label="Select a cycle"
            >
              <option value="" disabled>
                Select a cycle
              </option>
              <option>Q3–Q4 Strategy Cycle</option>
              <option>Q1 2027 Planning Cycle</option>
              <option>Annual 2027 Cycle</option>
            </select>
          </BuilderRow>
        </div>
        <footer>
          <button onClick={close}>Cancel</button>
          <button className="primary">Create OKR</button>
        </footer>
      </section>
    </div>
  );
}

function BuilderRow({
  title,
  copy,
  children,
}: {
  title: string;
  copy: string;
  children: React.ReactNode;
}) {
  return (
    <section className="builder-row">
      <div>
        <b>{title}</b>
        <small>{copy}</small>
      </div>
      <div>{children}</div>
    </section>
  );
}

export function KeyResultModal({
  type,
  setType,
  suggestions,
  setSuggestions,
  close,
}: {
  type: KrType;
  setType: (x: KrType) => void;
  suggestions: boolean;
  setSuggestions: (x: boolean) => void;
  close: () => void;
}) {
  const [addedSuggestion, setAddedSuggestion] = useState<number | null>(null);
  return (
    <div className="modal-layer">
      <section className="kr-modal">
        <header>
          Add key result{" "}
          <button onClick={close}>
            <img src={objectiveAsset("close.svg")} alt="Close" />
          </button>
        </header>
        <div className="kr-modal-body">
          <b className="kr-icon">
            <img src={objectiveAsset("target.svg")} alt="" />
          </b>
          <h2>Create a new key result</h2>
          {suggestions ? (
            <div className="ai-suggestions">
              <b>
                <img src={objectiveAsset("ai.svg")} alt="" /> AI Suggestions
              </b>
              {[1, 2, 3].map((x) => (
                <p key={x}>
                  Get 1500+ customer onboard{" "}
                  <button onClick={() => setAddedSuggestion(x)}>
                    <img src={objectiveAsset("plus.svg")} alt="" />
                    {addedSuggestion === x ? "Added" : "Add"}
                  </button>
                </p>
              ))}
            </div>
          ) : (
            <button
              className="ai-suggestion-button"
              onClick={() => setSuggestions(true)}
            >
              <img src={objectiveAsset("ai.svg")} alt="" /> Get AI Suggestions
            </button>
          )}
          <label>What type of key result is this</label>
          <div className="kr-types">
            {(["Metric", "Baseline", "Milestone"] as KrType[]).map((x) => (
              <button
                className={type === x ? "active" : ""}
                onClick={() => setType(x)}
                key={x}
              >
                {x}
                {type === x && (
                  <img src={objectiveAsset("check.svg")} alt="Selected" />
                )}
              </button>
            ))}
          </div>
          <p className="type-help">
            {type} KR:{" "}
            {type === "Metric"
              ? "Track progress by measuring a specific number that increases or decreases over time."
              : type === "Baseline"
                ? "Set a target to achieve or maintain a specific threshold or standard by a deadline."
                : "Complete a series of discrete tasks or deliverables, marking each as done when finished."}
          </p>
          <label>Set KR title</label>
          <div className="kr-title">
            <span>Action:　 E.g Develop, Increase, Grow, Monitor, etc..</span>
            <span>
              What you’ll measure:　 E.g daily signups, app store rating...
            </span>
          </div>
          <label>How to measure</label>
          <div className="measure-row">
            <select>
              <option>Percentage (%)</option>
              <option>Numeric (#)</option>
              <option>Currency ($)</option>
            </select>
            <input placeholder="Enter a start/current" />
            <input placeholder="Enter a target" />
          </div>
          {type === "Milestone" && (
            <>
              <label>Target date</label>
              <input
                className="full-input"
                placeholder="Select a date to accomplish this key result"
              />
            </>
          )}
          <label>Weight</label>
          <input className="full-input" placeholder="E.g. 50%" />
          <small>
            This is how much this key result will contribute to the progress of
            the objective
          </small>
        </div>
        <footer>
          <button onClick={close}>Cancel</button>
          <button className="primary" onClick={close}>
            Create key result
          </button>
        </footer>
      </section>
    </div>
  );
}

export function ProgressModal({ close }: { close: () => void }) {
  const [value, setValue] = useState("1500");
  const percent = Math.min(100, Math.round(Number(value || 0) / 50));
  return (
    <div className="modal-layer">
      <section className="progress-modal">
        <header>
          Update progress{" "}
          <button onClick={close}>
            <img src={objectiveAsset("progress-close.svg")} alt="Close" />
          </button>
        </header>
        <div>
          <h2>Update Key Result Progress</h2>
          <p>Badges have points and contribute to the leaderboard.</p>
          <div className="progress-values">
            <span>
              Current<b>1500</b>
            </span>
            <span>
              Target<b>5000</b>
            </span>
          </div>
          <label>New current value</label>
          <div className="number-input">
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <img src={objectiveAsset("stepper.svg")} alt="" />
          </div>
          <small>
            Progress: {percent}% of target.{" "}
            {percent === 100 && "🎉 Target achieved"}
          </small>
          <label>
            Update note <i>(Optional)</i>
          </label>
          <textarea placeholder="Add a note about this progress update." />
        </div>
        <footer>
          <button className="primary" onClick={close}>
            Update progress
          </button>
        </footer>
      </section>
    </div>
  );
}
