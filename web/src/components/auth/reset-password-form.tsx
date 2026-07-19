"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [visible, setVisible] = useState(false);
  const [success, setSuccess] = useState(false);
  const rules = [["Minimum of 6 characters", password.length >= 6], ["At least one uppercase letter", /[A-Z]/.test(password)], ["At least one lowercase letter", /[a-z]/.test(password)], ["At least one number", /\d/.test(password)]];
  const ready = rules.every(([, met]) => met) && password === confirm;
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); if (ready) setSuccess(true); }
  return <div className="reset-password-wrap"><button className="back-button login-password-back" type="button" onClick={() => window.history.back()}><img src="/assets/auth/arrow-narrow-left.svg" alt="" />Back</button><form className="auth-form reset-password-form" onSubmit={submit} noValidate><div className="form-heading"><h1>Reset your password.</h1><p>Choose a strong password to keep your account secure.</p></div><div className="form-body"><div className="reset-new-password"><PasswordInput label="New Password" placeholder="Enter a new password" value={password} onChange={setPassword} visible={visible} toggle={() => setVisible(!visible)} /><ul className="password-rules">{rules.map(([label, met]) => <li key={String(label)}><img src={met ? "/assets/auth/check-circle.svg" : "/assets/auth/check-circle-empty.svg"} alt="" />{label}</li>)}</ul></div><div className="confirm-password"><PasswordInput label="Confirm password" placeholder="Re-enter new password" value={confirm} onChange={setConfirm} visible={visible} toggle={() => setVisible(!visible)} />{confirm && confirm !== password && <small>Passwords do not match</small>}</div><button className="primary-button" type="submit" disabled={!ready}>Set new password</button></div></form>{success && <ResetSuccessModal onBackToLogin={() => router.push("/login")} />}</div>;
}

function ResetSuccessModal({ onBackToLogin }: { onBackToLogin: () => void }) {
  return <div className="reset-success-overlay" role="dialog" aria-modal="true" aria-labelledby="reset-success-title"><section className="reset-success-card"><div className="reset-success-hero"><img src="/assets/auth/reset-success-illustration.png" alt="" /></div><div className="reset-success-content"><div><h2 id="reset-success-title">Password Reset Successfully!</h2><p>Your password has been successfully reset. You can now use your new password to log in to your account.</p></div><button className="reset-success-button" type="button" onClick={onBackToLogin}>Back to Login</button></div></section></div>;
}

function PasswordInput({ label, placeholder, value, onChange, visible, toggle }: { label:string; placeholder:string; value:string; onChange:(value:string)=>void; visible:boolean; toggle:()=>void }) { return <label className="field password-field"><span>{label}</span><span className="field-control"><img src="/assets/auth/lock-01.svg" alt="" /><input type={visible ? "text" : "password"} placeholder={placeholder} value={value} onChange={(event) => onChange(event.target.value)} /><button type="button" aria-label="Toggle password visibility" onClick={toggle}><img src="/assets/auth/eye-off.svg" alt="" /></button></span></label>; }
