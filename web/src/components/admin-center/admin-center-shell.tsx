"use client";

import { useState } from "react";
import { Building2, Compass, ListChecks, Puzzle, ShieldCheck, Target, UserCircle2 } from "lucide-react";
import type { AdminCenterPage } from "./types";
import { WorkspaceSettings } from "./workspace-settings";
import { StrategySetup } from "./strategy-setup";
import { Behaviours } from "./behaviours";
import { Competencies } from "./competencies";
import { PerformanceCycle } from "./performance-cycle";
import { UserAccess } from "./user-access";
import { AccountProfile } from "./account-profile";

const navGroups: { label: string; items: { page: AdminCenterPage; icon: typeof Building2 }[] }[] = [
  {
    label: "Configuration",
    items: [
      { page: "Strategy Setup", icon: Compass },
      { page: "Behaviours", icon: Target },
      { page: "Competencies", icon: Puzzle },
      { page: "Performance Cycle", icon: ListChecks },
    ],
  },
  {
    label: "Workspace",
    items: [
      { page: "User & Access", icon: ShieldCheck },
      { page: "Workspace", icon: Building2 },
      { page: "Account & Profile", icon: UserCircle2 },
    ],
  },
];

export function AdminCenterShell({
  showToast,
  initialPage = "Strategy Setup",
}: {
  showToast: (message: string) => void;
  initialPage?: AdminCenterPage;
}) {
  const [page, setPage] = useState<AdminCenterPage>(initialPage);

  return (
    <div className="admin-shell">
      <nav className="admin-subnav">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="admin-subnav-label">{group.label}</p>
            {group.items.map(({ page: itemPage, icon: Icon }) => (
              <button key={itemPage} className={page === itemPage ? "active" : ""} onClick={() => setPage(itemPage)}>
                <Icon size={16} /> {itemPage}
              </button>
            ))}
          </div>
        ))}
      </nav>
      <div className="admin-main">
        <div className="admin-context-bar">
          <div><span>Admin Center</span><strong>{page}</strong></div>
          <div className="admin-save-state"><i /> Changes save automatically</div>
        </div>
        {page === "Strategy Setup" && <StrategySetup showToast={showToast} />}
        {page === "Behaviours" && <Behaviours showToast={showToast} />}
        {page === "Competencies" && <Competencies showToast={showToast} />}
        {page === "Performance Cycle" && <PerformanceCycle showToast={showToast} />}
        {page === "User & Access" && <UserAccess showToast={showToast} />}
        {page === "Workspace" && <WorkspaceSettings showToast={showToast} />}
        {page === "Account & Profile" && <AccountProfile showToast={showToast} />}
      </div>
    </div>
  );
}
