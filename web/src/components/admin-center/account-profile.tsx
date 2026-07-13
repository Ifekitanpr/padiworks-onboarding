"use client";

import { useState } from "react";
import { Camera, Check, LogOut, Monitor, Shield, ShieldCheck, Smartphone } from "lucide-react";
import type { AdminSectionProps } from "./types";

type Tab = "Profile" | "Security" | "Notification preferences";

type Session = {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  current: boolean;
};

const seedSessions: Session[] = [
  { id: "s1", device: "Chrome on macOS", location: "Lagos, Nigeria", lastActive: "Active now", current: true },
  { id: "s2", device: "Padiworks mobile app · iPhone", location: "Lagos, Nigeria", lastActive: "3h ago", current: false },
  { id: "s3", device: "Edge on Windows", location: "Abuja, Nigeria", lastActive: "2 days ago", current: false },
];

type NotificationPrefs = {
  mentions: boolean;
  feedback: boolean;
  checkIns: boolean;
  digest: boolean;
};

export function AccountProfile({ showToast }: AdminSectionProps) {
  const [tab, setTab] = useState<Tab>("Profile");

  // Profile fields
  const [fullName, setFullName] = useState("Alex Adeyemi");
  const [jobTitle, setJobTitle] = useState("Head of Strategy");
  const email = "alex@padiworks.ai";

  // Security fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [sessions, setSessions] = useState<Session[]>(seedSessions);

  // Notification preferences
  const [prefs, setPrefs] = useState<NotificationPrefs>({
    mentions: true,
    feedback: true,
    checkIns: true,
    digest: false,
  });

  function saveProfile() {
    showToast("Profile updated");
  }

  function changePassword() {
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast("Fill in all password fields");
      return;
    }
    if (newPassword.length < 10) {
      showToast("New password must be at least 10 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast("New password and confirmation don't match");
      return;
    }
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    showToast("Password changed");
  }

  function toggleTwoFactor() {
    setTwoFactorEnabled((current) => !current);
    showToast(!twoFactorEnabled ? "Two-factor authentication enabled" : "Two-factor authentication disabled");
  }

  function logOutSession(session: Session) {
    setSessions((current) => current.filter((item) => item.id !== session.id));
    showToast(`Logged out of ${session.device}`);
  }

  function logOutAllOtherSessions() {
    setSessions((current) => current.filter((item) => item.current));
    showToast("Logged out of all other devices");
  }

  function togglePref(key: keyof NotificationPrefs) {
    setPrefs((current) => ({ ...current, [key]: !current[key] }));
  }

  function savePrefs() {
    showToast("Notification preferences saved");
  }

  return (
    <>
      <div className="admin-header">
        <h2>Account &amp; Profile</h2>
        <p>Your personal profile, security, and notification preferences — separate from workspace-wide Admin Center configuration.</p>
      </div>

      <div className="view-tabs">
        {(["Profile", "Security", "Notification preferences"] as Tab[]).map((item) => (
          <button key={item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}>
            {item}
          </button>
        ))}
      </div>

      {tab === "Profile" && (
        <div className="settings-card">
          <h3>Profile</h3>

          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 22 }}>
            <div style={{ position: "relative" }}>
              <span
                className="avatar"
                style={{ width: 64, height: 64, fontSize: 20, backgroundColor: "#e9e2f8" }}
              >
                AL
              </span>
              <button
                className="plain-icon"
                style={{
                  position: "absolute",
                  right: -4,
                  bottom: -4,
                  border: "2px solid #fff",
                  background: "var(--padi)",
                  color: "#fff",
                }}
                onClick={() => showToast("Photo upload coming soon")}
                aria-label="Change avatar"
              >
                <Camera size={13} />
              </button>
            </div>
            <div>
              <strong style={{ display: "block", fontSize: 14 }}>{fullName}</strong>
              <span style={{ display: "block", marginTop: 3, color: "var(--muted)", fontSize: 11 }}>{jobTitle}</span>
            </div>
          </div>

          <div className="field-group">
            <div className="field-label-row">
              <span className="field-label">Full name</span>
            </div>
            <input className="text-input" value={fullName} onChange={(event) => setFullName(event.target.value)} />
          </div>

          <div className="field-group">
            <div className="field-label-row">
              <span className="field-label">Email address</span>
            </div>
            <input className="text-input" value={email} disabled readOnly style={{ opacity: 0.65, cursor: "not-allowed" }} />
            <p className="field-hint">Contact your admin to change your email.</p>
          </div>

          <div className="field-group">
            <div className="field-label-row">
              <span className="field-label">Job title</span>
            </div>
            <input className="text-input" value={jobTitle} onChange={(event) => setJobTitle(event.target.value)} />
          </div>

          <div className="field-group" style={{ marginBottom: 4 }}>
            <div className="field-label-row">
              <span className="field-label">Role</span>
            </div>
            <span className="role-pill super-admin">Super Admin</span>
            <p className="field-hint">Your role is managed by your workspace admin under User &amp; Access.</p>
          </div>

          <button className="btn-primary" style={{ marginTop: 8 }} onClick={saveProfile}>
            Save changes
          </button>
        </div>
      )}

      {tab === "Security" && (
        <>
          <div className="settings-card">
            <h3>Change password</h3>

            <div className="field-group">
              <div className="field-label-row">
                <span className="field-label">Current password</span>
              </div>
              <input
                className="text-input"
                type="password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                autoComplete="current-password"
              />
            </div>

            <div className="field-group">
              <div className="field-label-row">
                <span className="field-label">New password</span>
              </div>
              <input
                className="text-input"
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                autoComplete="new-password"
              />
            </div>

            <div className="field-group" style={{ marginBottom: 6 }}>
              <div className="field-label-row">
                <span className="field-label">Confirm new password</span>
              </div>
              <input
                className="text-input"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                autoComplete="new-password"
              />
              <p className="field-hint">Password must be at least 10 characters and should mix letters, numbers, and symbols.</p>
            </div>

            <button className="btn-primary" style={{ marginTop: 8 }} onClick={changePassword}>
              Save password
            </button>
          </div>

          <div className="settings-card">
            <h3>Two-factor authentication</h3>
            <div className="settings-row">
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {twoFactorEnabled ? <ShieldCheck size={15} style={{ color: "var(--padi)" }} /> : <Shield size={15} style={{ color: "var(--muted)" }} />}
                Two-factor authentication
              </span>
              <label className="toggle-switch">
                <input type="checkbox" checked={twoFactorEnabled} onChange={toggleTwoFactor} />
                <span className="toggle-track" />
              </label>
            </div>
            <p className="field-hint">Required by default for Admin roles. Disabling it may be reset by your workspace admin.</p>
          </div>

          <div className="settings-card">
            <h3>Active sessions</h3>
            {sessions.map((session) => (
              <div className="settings-row" key={session.id}>
                <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {session.device.toLowerCase().includes("iphone") || session.device.toLowerCase().includes("mobile") ? (
                    <Smartphone size={15} style={{ color: "var(--muted)" }} />
                  ) : (
                    <Monitor size={15} style={{ color: "var(--muted)" }} />
                  )}
                  <span>
                    <span style={{ display: "block", fontWeight: 600, color: "#344054" }}>{session.device}</span>
                    <span style={{ display: "block", marginTop: 2, color: "var(--muted)", fontSize: 10 }}>
                      {session.location} · {session.lastActive}
                    </span>
                  </span>
                  {session.current && <span className="priority-tag">This device</span>}
                </span>
                {!session.current && (
                  <button className="plain-icon" onClick={() => logOutSession(session)} aria-label={`Log out of ${session.device}`}>
                    <LogOut size={15} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="settings-card danger-zone">
            <h3>Danger zone</h3>
            <div className="settings-row">
              <span>Log out of all other devices</span>
              <button
                className="btn-danger"
                onClick={logOutAllOtherSessions}
                disabled={sessions.every((session) => session.current)}
              >
                Log out everywhere
              </button>
            </div>
          </div>
        </>
      )}

      {tab === "Notification preferences" && (
        <div className="settings-card">
          <h3>Notification preferences</h3>
          <p className="field-hint" style={{ marginTop: -8, marginBottom: 12 }}>
            These are your personal notification preferences and apply only to you — distinct from the workspace-wide
            defaults configured in Admin Center &gt; Workspace.
          </p>

          <div className="settings-row">
            <span>Mentions &amp; comments</span>
            <label className="toggle-switch">
              <input type="checkbox" checked={prefs.mentions} onChange={() => togglePref("mentions")} />
              <span className="toggle-track" />
            </label>
          </div>

          <div className="settings-row">
            <span>Feedback received</span>
            <label className="toggle-switch">
              <input type="checkbox" checked={prefs.feedback} onChange={() => togglePref("feedback")} />
              <span className="toggle-track" />
            </label>
          </div>

          <div className="settings-row">
            <span>Check-in reminders</span>
            <label className="toggle-switch">
              <input type="checkbox" checked={prefs.checkIns} onChange={() => togglePref("checkIns")} />
              <span className="toggle-track" />
            </label>
          </div>

          <div className="settings-row">
            <span>Weekly performance digest</span>
            <label className="toggle-switch">
              <input type="checkbox" checked={prefs.digest} onChange={() => togglePref("digest")} />
              <span className="toggle-track" />
            </label>
          </div>

          <button className="btn-primary" style={{ marginTop: 14 }} onClick={savePrefs}>
            <Check size={13} style={{ marginRight: 6, verticalAlign: -2 }} />
            Save preferences
          </button>
        </div>
      )}
    </>
  );
}
