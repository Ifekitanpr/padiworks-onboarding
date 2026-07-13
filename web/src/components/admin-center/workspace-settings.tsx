"use client";

import { useState } from "react";
import { Trash2, X } from "lucide-react";
import type { AdminSectionProps, ToggleKey } from "./types";

const toggleKeys: ToggleKey[] = ["Email notifications", "Weekly digest", "Public objective visibility"];

export function WorkspaceSettings({ showToast }: AdminSectionProps) {
  const [workspaceName, setWorkspaceName] = useState("Padiworks");
  const [toggles, setToggles] = useState<Record<ToggleKey, boolean>>({
    "Email notifications": true,
    "Weekly digest": true,
    "Public objective visibility": false,
  });
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <>
      <div className="admin-header">
        <h2>Workspace</h2>
        <p>General workspace identity and notification defaults.</p>
      </div>
      <div className="settings-card">
        <h3>Workspace</h3>
        <label className="prompt-modal-label" style={{ marginTop: 0 }}>
          Workspace name
          <input className="prompt-modal-input" value={workspaceName} onChange={(event) => setWorkspaceName(event.target.value)} />
        </label>
      </div>
      <div className="settings-card">
        <h3>Notifications</h3>
        {toggleKeys.map((label) => (
          <div className="settings-row" key={label}>
            <span>{label}</span>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={toggles[label]}
                onChange={() => setToggles((current) => ({ ...current, [label]: !current[label] }))}
              />
              <span className="toggle-track" />
            </label>
          </div>
        ))}
      </div>
      <div className="settings-card danger-zone">
        <h3>Danger zone</h3>
        <div className="settings-row">
          <span>Archive this workspace</span>
          <button className="btn-danger" onClick={() => setConfirmOpen(true)}>Archive workspace</button>
        </div>
      </div>

      {confirmOpen && (
        <div className="drawer-backdrop" onClick={() => setConfirmOpen(false)}>
          <div className="create-modal confirm-modal" onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={() => setConfirmOpen(false)}><X size={18} /></button>
            <span className="modal-icon danger-icon"><Trash2 size={20} /></span>
            <h2>Archive workspace</h2>
            <p>This will archive the entire Padiworks workspace for all members. You can restore it within 30 days.</p>
            <div className="modal-actions">
              <button className="btn-ghost" onClick={() => setConfirmOpen(false)}>Cancel</button>
              <button
                className="btn-danger"
                onClick={() => {
                  setConfirmOpen(false);
                  showToast("Workspace archived");
                }}
              >
                Archive
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
