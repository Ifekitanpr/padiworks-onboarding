"use client";

import { useState } from "react";
import { UserPlus, Trash2, X, ShieldCheck, Lock } from "lucide-react";
import type { AdminSectionProps } from "./types";

type Role = "Super Admin" | "HR Admin" | "Director" | "Manager" | "Contributor" | "Finance Admin";
type SeatType = "Full Seat" | "View-Only Seat";

type Member = {
  id: string;
  name: string;
  email: string;
  role: Role;
  seat: SeatType;
  initials: string;
};

const roles: Role[] = ["Super Admin", "HR Admin", "Director", "Manager", "Contributor", "Finance Admin"];

const roleClass: Record<Role, string> = {
  "Super Admin": "super-admin",
  "HR Admin": "hr-admin",
  Director: "director",
  Manager: "manager",
  Contributor: "contributor",
  "Finance Admin": "finance-admin",
};

const roleDescriptions: { role: Role; description: string }[] = [
  { role: "Super Admin", description: "Full access to every module; the only role that can override the appraisal Bias Alert and always retains break-glass login." },
  { role: "HR Admin", description: "Manages people and performance configuration across the whole organisation." },
  { role: "Director", description: "Approves strategy and OKRs for orgs of 30+ people and oversees multiple teams." },
  { role: "Manager", description: "Manages their direct reports' check-ins, feedback, and appraisals." },
  { role: "Contributor", description: "Standard individual-contributor access: own work, own profile, give and receive feedback." },
  { role: "Finance Admin", description: "Sub-role of HR Admin scoped to budgeting and compensation data; cannot stand alone." },
];

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const seedMembers: Member[] = [
  { id: "m1", name: "Adaeze Okafor", email: "adaeze.okafor@padiworks.com", role: "Super Admin", seat: "Full Seat", initials: "AO" },
  { id: "m2", name: "Tunde Bakare", email: "tunde.bakare@padiworks.com", role: "HR Admin", seat: "Full Seat", initials: "TB" },
  { id: "m3", name: "Chiamaka Nwosu", email: "chiamaka.nwosu@padiworks.com", role: "Director", seat: "Full Seat", initials: "CN" },
  { id: "m4", name: "Femi Adeyemi", email: "femi.adeyemi@padiworks.com", role: "Manager", seat: "Full Seat", initials: "FA" },
  { id: "m5", name: "Ngozi Eze", email: "ngozi.eze@padiworks.com", role: "Contributor", seat: "Full Seat", initials: "NE" },
  { id: "m6", name: "Segun Olawale", email: "segun.olawale@padiworks.com", role: "Contributor", seat: "View-Only Seat", initials: "SO" },
  { id: "m7", name: "Bimpe Alabi", email: "bimpe.alabi@padiworks.com", role: "Finance Admin", seat: "Full Seat", initials: "BA" },
  { id: "m8", name: "Kelechi Umeh", email: "kelechi.umeh@padiworks.com", role: "Manager", seat: "View-Only Seat", initials: "KU" },
];

export function UserAccess({ showToast }: AdminSectionProps) {
  const [members, setMembers] = useState<Member[]>(seedMembers);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<Role>("Contributor");
  const [inviteSeat, setInviteSeat] = useState<SeatType>("Full Seat");
  const [removeTarget, setRemoveTarget] = useState<Member | null>(null);

  function updateRole(id: string, role: Role) {
    setMembers((current) => current.map((member) => (member.id === id ? { ...member, role } : member)));
    const member = members.find((item) => item.id === id);
    showToast(`${member ? member.name : "Member"}'s role changed to ${role}`);
  }

  function updateSeat(id: string, seat: SeatType) {
    setMembers((current) => current.map((member) => (member.id === id ? { ...member, seat } : member)));
    const member = members.find((item) => item.id === id);
    showToast(`${member ? member.name : "Member"}'s seat type changed to ${seat}`);
  }

  function submitInvite(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = inviteEmail.trim();
    if (!trimmed) return;
    const name = trimmed.split("@")[0].replace(/[._]/g, " ");
    const displayName = name.replace(/\b\w/g, (char) => char.toUpperCase());
    const newMember: Member = {
      id: `m${Date.now()}`,
      name: displayName,
      email: trimmed,
      role: inviteRole,
      seat: inviteSeat,
      initials: initialsOf(displayName),
    };
    setMembers((current) => [...current, newMember]);
    setInviteOpen(false);
    setInviteEmail("");
    setInviteRole("Contributor");
    setInviteSeat("Full Seat");
    showToast(`Invitation sent to ${trimmed}`);
  }

  function confirmRemove() {
    if (!removeTarget) return;
    setMembers((current) => current.filter((member) => member.id !== removeTarget.id));
    showToast(`${removeTarget.name} removed from workspace`);
    setRemoveTarget(null);
  }

  return (
    <>
      <div className="admin-header">
        <h2>User & Access Management</h2>
        <p>Control who has access to Padiworks and what each role can see and do.</p>
      </div>

      <div className="validation-banner info">
        <ShieldCheck size={16} />
        <span>
          Super Admin always retains break-glass login access to the workspace and is the only role that can override
          system integrity rules, such as the appraisal Bias Alert.
        </span>
      </div>

      <div className="plan-header" style={{ marginBottom: 14 }}>
        <div>
          <h2 style={{ fontSize: 14 }}>Members</h2>
        </div>
        <button className="soft-button" onClick={() => setInviteOpen(true)}>
          <UserPlus size={14} /> Invite member
        </button>
      </div>

      <div className="data-table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Seat type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                    <span
                      className="avatar"
                      style={{ background: "var(--padi-soft)", color: "var(--padi)" }}
                    >
                      {member.initials}
                    </span>
                    {member.name}
                  </div>
                </td>
                <td>{member.email}</td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span className={`role-pill ${roleClass[member.role]}`}>{member.role}</span>
                    <select
                      className="select-input"
                      style={{ height: 30, width: 140, fontSize: 10 }}
                      value={member.role}
                      onChange={(event) => updateRole(member.id, event.target.value as Role)}
                      aria-label={`Change role for ${member.name}`}
                    >
                      {roles.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </div>
                </td>
                <td>
                  <select
                    className="select-input"
                    style={{ height: 30, width: 130, fontSize: 10 }}
                    value={member.seat}
                    onChange={(event) => updateSeat(member.id, event.target.value as SeatType)}
                    aria-label={`Change seat type for ${member.name}`}
                  >
                    <option value="Full Seat">Full Seat</option>
                    <option value="View-Only Seat">View-Only Seat</option>
                  </select>
                </td>
                <td>
                  <button
                    className="plain-icon"
                    onClick={() => setRemoveTarget(member)}
                    aria-label={`Remove ${member.name}`}
                  >
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="settings-card" style={{ marginTop: 22 }}>
        <h3>Roles & permissions</h3>
        {roleDescriptions.map(({ role, description }) => (
          <div className="settings-row" key={role}>
            <span className={`role-pill ${roleClass[role]}`}>{role}</span>
            <span style={{ flex: 1, marginLeft: 12, color: "var(--muted)", fontSize: 11 }}>{description}</span>
          </div>
        ))}
        <div className="settings-row">
          <span className="role-pill contributor" style={{ opacity: 0.6 }}>
            <Lock size={10} style={{ marginRight: 4 }} /> Custom Role
          </span>
          <span style={{ flex: 1, marginLeft: 12, color: "var(--muted)", fontSize: 11 }}>
            Enterprise-tier organisations can define custom roles capped at the Manager or Contributor permission
            ceiling; a custom role can never exceed Super Admin&apos;s permissions.
          </span>
          <span className="priority-tag">Enterprise</span>
        </div>
      </div>

      {inviteOpen && (
        <div className="drawer-backdrop" onClick={() => setInviteOpen(false)}>
          <form className="create-modal" onClick={(event) => event.stopPropagation()} onSubmit={submitInvite}>
            <button type="button" className="modal-close" onClick={() => setInviteOpen(false)}>
              <X size={18} />
            </button>
            <span className="modal-icon">
              <UserPlus size={20} />
            </span>
            <h2>Invite member</h2>
            <p>Send a workspace invitation with a starting role and seat type.</p>

            <label className="prompt-modal-label" style={{ marginTop: 0 }}>
              Email address
              <input
                className="prompt-modal-input"
                type="email"
                autoFocus
                required
                placeholder="name@company.com"
                value={inviteEmail}
                onChange={(event) => setInviteEmail(event.target.value)}
              />
            </label>

            <label className="prompt-modal-label">
              Role
              <select
                className="select-input"
                style={{ marginTop: 7 }}
                value={inviteRole}
                onChange={(event) => setInviteRole(event.target.value as Role)}
              >
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </label>

            <label className="prompt-modal-label">
              Seat type
              <select
                className="select-input"
                style={{ marginTop: 7 }}
                value={inviteSeat}
                onChange={(event) => setInviteSeat(event.target.value as SeatType)}
              >
                <option value="Full Seat">Full Seat</option>
                <option value="View-Only Seat">View-Only Seat</option>
              </select>
            </label>

            <div className="modal-actions">
              <button type="button" className="btn-ghost" onClick={() => setInviteOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={!inviteEmail.trim()}>
                Send invite
              </button>
            </div>
          </form>
        </div>
      )}

      {removeTarget && (
        <div className="drawer-backdrop" onClick={() => setRemoveTarget(null)}>
          <div className="create-modal confirm-modal" onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={() => setRemoveTarget(null)}>
              <X size={18} />
            </button>
            <span className="modal-icon danger-icon">
              <Trash2 size={20} />
            </span>
            <h2>Remove member</h2>
            <p>
              {removeTarget.name} will lose access to this workspace immediately. This action can be reversed by
              re-inviting them.
            </p>
            <div className="modal-actions">
              <button className="btn-ghost" onClick={() => setRemoveTarget(null)}>
                Cancel
              </button>
              <button className="btn-danger" onClick={confirmRemove}>
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
