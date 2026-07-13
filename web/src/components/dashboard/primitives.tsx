"use client";

import { type ReactNode } from "react";

export function Avatar({ initials, color }: { initials: string; color: string }) {
  return <span className="avatar" style={{ backgroundColor: color }}>{initials}</span>;
}

export function DropdownMenu({
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
      <div onClick={() => onToggle(id)}>{trigger}</div>
      {openMenu === id && <div className={`menu-panel menu-${align} ${className}`.trim()}>{children}</div>}
    </div>
  );
}
