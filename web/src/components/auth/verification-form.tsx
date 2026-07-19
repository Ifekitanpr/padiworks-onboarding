"use client";

import { useRef, useState, type ClipboardEvent, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";

const OTP_LENGTH = 6;

export function VerificationForm({ email, recovery = false }: { email: string; recovery?: boolean }) {
  const router = useRouter();
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [status, setStatus] = useState<"idle" | "checking" | "verified">("idle");
  const [resent, setResent] = useState(false);
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const complete = digits.every(Boolean);

  function setDigit(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...digits]; next[index] = digit; setDigits(next);
    if (digit && index < OTP_LENGTH - 1) refs.current[index + 1]?.focus();
  }
  function keyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !digits[index] && index > 0) refs.current[index - 1]?.focus();
  }
  function paste(event: ClipboardEvent<HTMLInputElement>) {
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    event.preventDefault();
    const next = Array(OTP_LENGTH).fill(""); pasted.split("").forEach((digit, index) => { next[index] = digit; }); setDigits(next);
    refs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  }
  function verify() {
    if (!complete) return;
    setStatus("checking"); window.setTimeout(() => { setStatus("verified"); window.setTimeout(() => router.push(recovery ? "/reset-password" : "/onboarding"), 700); }, 650);
  }

  return (
    <div className="verification-wrap">
      {status === "verified" && <aside className="success-toast success-toast--compact" role="status"><div><img src="/assets/auth/check-circle-broken.svg" alt="" /><strong>OTP Verification successful</strong></div><button type="button" onClick={() => setStatus("idle")} aria-label="Dismiss notification"><img src="/assets/auth/x-close.svg" alt="" /></button></aside>}
      <button className="back-button" type="button" onClick={() => history.back()}><img src="/assets/auth/arrow-narrow-left.svg" alt="" />Back</button>
      <div className="verification-form">
        <div className="form-heading verification-heading"><h1>Check your email to get the {recovery ? "reset" : "verification"} code!</h1><p>Check inbox for <strong>{email}</strong>. Don&apos;t forget to look in your spam folder if you don&apos;t see is in your inbox right away!</p></div>
        <div className="otp-section">
          <div className="otp-row" onPaste={paste}>{[0, 3].map((start) => <div className="otp-group" key={start}>{digits.slice(start, start + 3).map((digit, offset) => { const index = start + offset; return <input key={index} ref={(element) => { refs.current[index] = element; }} aria-label={`Verification digit ${index + 1}`} inputMode="numeric" maxLength={1} value={digit} onChange={(event) => setDigit(index, event.target.value)} onKeyDown={(event) => keyDown(index, event)} />; })}</div>)}</div>
          <button className="primary-button" type="button" disabled={!complete || status === "checking" || status === "verified"} onClick={verify}>{status === "checking" ? "Verifying…" : status === "verified" ? "Email verified" : "Verify code"}</button>
          <p className="form-footer">Didn&apos;t get a code? <button className="inline-button" type="button" onClick={() => setResent(true)}>{resent ? "Code resent" : "Resend code"}</button></p>
        </div>
      </div>
    </div>
  );
}
