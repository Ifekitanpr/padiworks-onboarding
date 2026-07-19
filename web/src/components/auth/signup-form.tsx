"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

type FormValues = { firstName: string; lastName: string; email: string; password: string; accepted: boolean };

export function SignupForm({ passwordMode = false }: { passwordMode?: boolean }) {
  const router = useRouter();
  const [values, setValues] = useState<FormValues>({ firstName: "", lastName: "", email: "", password: "", accepted: false });
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const passwordReady = values.password.length >= 6 && /[A-Z]/.test(values.password) && /[a-z]/.test(values.password) && /\d/.test(values.password);
  const ready = values.firstName.trim() && values.lastName.trim() && /\S+@\S+\.\S+/.test(values.email) && (!passwordMode || passwordReady) && values.accepted;

  function update(name: keyof FormValues, value: string | boolean) {
    setValues((current) => ({ ...current, [name]: value }));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!ready) return;
    setSubmitting(true);
    window.setTimeout(() => {
      setShowSuccess(true);
      window.setTimeout(() => router.push(`/verify-email?email=${encodeURIComponent(values.email)}`), 900);
    }, 550);
  }

  return (
    <form className="auth-form signup-form" onSubmit={submit} noValidate>
      {showSuccess && <SuccessToast onDismiss={() => setShowSuccess(false)} />}
      <div className="form-heading">
        <h1>Create an account</h1>
        <p>Join us today to unlock exclusive features that enhance your team performance!</p>
      </div>
      <div className="form-body">
        <div className="social-block">
          <button className="social-button" type="button"><img src="/assets/auth/google.svg" alt="" />Continue with Google</button>
          <div className="labeled-divider"><span>Or continue with</span></div>
        </div>
        <div className="fields">
          <div className="field-row">
            <Field label="First name" value={values.firstName} onChange={(value) => update("firstName", value)} />
            <Field label="Last name" value={values.lastName} onChange={(value) => update("lastName", value)} />
          </div>
          <Field label="Business email" type="email" value={values.email} onChange={(value) => update("email", value)} />
          {passwordMode ? <><a className="password-link" href="/signup"><img src="/assets/auth/mail-01.svg" alt="" /><span>Prefer a email only? </span><u>Set up with email and OTP instead</u></a><PasswordField value={values.password} onChange={(value) => update("password", value)} /></> : <a className="password-link" href="/signup/password"><img src="/assets/auth/key-02.svg" alt="" /><span>Prefer a password? </span><u>Set up with email &amp; password</u></a>}
        </div>
        <div className="consent-and-action">
          <label className="consent"><input type="checkbox" checked={values.accepted} onChange={(event) => update("accepted", event.target.checked)} /><span>I agree to the <a href="#privacy">Privacy policy</a> and <a href="#terms">terms of use</a> by padiworks</span></label>
          <button className="primary-button" type="submit" disabled={!ready || submitting}>{submitting ? <><span>Creating your account</span><img className="button-spinner" src="/assets/auth/loading-01.svg" alt="" /></> : "Sign up"}</button>
          <p className="form-footer">Already have an account? <a href="/login">Sign in</a></p>
        </div>
      </div>
    </form>
  );
}

function PasswordField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [visible, setVisible] = useState(false);
  const rules = [["Minimum of 6 characters", value.length >= 6], ["At least one uppercase letter", /[A-Z]/.test(value)], ["At least one lowercase letter", /[a-z]/.test(value)], ["At least one number", /\d/.test(value)]];
  return <div className="password-block"><label className="field password-field"><span>Password</span><span className="field-control"><img src="/assets/auth/lock-01.svg" alt="" /><input type={visible ? "text" : "password"} placeholder="Enter a new password" value={value} onChange={(event) => onChange(event.target.value)} /><button type="button" aria-label={visible ? "Hide password" : "Show password"} onClick={() => setVisible((current) => !current)}><img src="/assets/auth/eye-off.svg" alt="" /></button></span></label><ul className="password-rules">{rules.map(([label, met]) => <li key={String(label)}><img src={met ? "/assets/auth/check-circle.svg" : "/assets/auth/check-circle-empty.svg"} alt="" />{label}</li>)}</ul></div>;
}

function SuccessToast({ onDismiss }: { onDismiss: () => void }) {
  return <aside className="success-toast" role="status">
    <div className="success-toast__copy"><div><img src="/assets/auth/check-circle-broken.svg" alt="" /><strong>Registration successful</strong></div><p>Your account has been created.</p></div>
    <button type="button" onClick={onDismiss} aria-label="Dismiss notification"><img src="/assets/auth/x-close.svg" alt="" /></button>
  </aside>;
}

function Field({ label, type = "text", value, onChange }: { label: string; type?: string; value: string; onChange: (value: string) => void }) {
  const icon = type === "email" ? "/assets/auth/mail-03.svg" : "/assets/auth/user-03.svg";
  const placeholder = type === "email" ? "Enter your business email" : label === "First name" ? "e.g John" : "e.g. Doe";
  return <label className="field"><span>{label}</span><span className="field-control"><img src={icon} alt="" /><input type={type} placeholder={placeholder} value={value} onChange={(event) => onChange(event.target.value)} /></span></label>;
}
