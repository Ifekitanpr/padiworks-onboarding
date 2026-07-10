"use client";

import { useRef } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type OtpInputProps = {
  length?: number;
  value: string[];
  onChange: (value: string[]) => void;
  className?: string;
};

export function OtpInput({
  length = 6,
  value,
  onChange,
  className,
}: OtpInputProps) {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  function setDigit(index: number, digit: string) {
    const next = [...value];
    next[index] = digit;
    onChange(next);
  }

  function handleChange(index: number, raw: string) {
    const digit = raw.replace(/\D/g, "").slice(-1);
    setDigit(index, digit);
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!pasted) return;
    e.preventDefault();
    const next = Array.from({ length }, (_, i) => pasted[i] ?? "");
    onChange(next);
    inputRefs.current[Math.min(pasted.length, length - 1)]?.focus();
  }

  const mid = Math.ceil(length / 2);

  return (
    <div className={cn("flex items-center justify-between gap-6", className)}>
      {[value.slice(0, mid), value.slice(mid)].map((group, groupIndex) => (
        <div key={groupIndex} className="flex flex-1 gap-2">
          {group.map((digit, i) => {
            const index = groupIndex === 0 ? i : mid + i;
            return (
              <Input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                inputMode="numeric"
                maxLength={1}
                value={digit ?? ""}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="h-[57px] flex-1 rounded-xl text-center text-xl font-semibold"
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
