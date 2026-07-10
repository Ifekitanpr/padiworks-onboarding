import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

export type PasswordRule = {
  label: string;
  test: (password: string) => boolean;
};

export const passwordRules: PasswordRule[] = [
  { label: "Minimum of 6 characters", test: (p) => p.length >= 6 },
  { label: "At least one uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { label: "At least one lowercase letter", test: (p) => /[a-z]/.test(p) },
  { label: "At least one number", test: (p) => /[0-9]/.test(p) },
];

export function PasswordChecklist({ password }: { password: string }) {
  return (
    <div className="grid grid-cols-1 gap-3 rounded-xl bg-brand-grey-100 p-3 sm:grid-cols-2">
      {passwordRules.map((rule) => {
        const met = rule.test(password);
        return (
          <div key={rule.label} className="flex items-center gap-2">
            {met ? (
              <CheckCircle2 className="size-5 shrink-0 text-emerald-500" />
            ) : (
              <Circle className="size-5 shrink-0 text-brand-grey-300" />
            )}
            <span
              className={cn(
                "text-sm",
                met ? "text-brand-grey-700" : "text-brand-grey-500"
              )}
            >
              {rule.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
