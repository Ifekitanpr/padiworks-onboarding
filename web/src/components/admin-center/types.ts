export type AdminCenterPage =
  | "Workspace"
  | "Strategy Setup"
  | "Behaviours"
  | "Competencies"
  | "Performance Cycle"
  | "User & Access"
  | "Account & Profile";

export type ToggleKey = "Email notifications" | "Weekly digest" | "Public objective visibility";

export type AdminSectionProps = {
  showToast: (message: string) => void;
};
