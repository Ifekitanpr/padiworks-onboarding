"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export function ForgotPasswordForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const ready = /\S+@\S+\.\S+/.test(email);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (ready) router.push(`/forgot-password/verify?email=${encodeURIComponent(email)}`);
  }

  return <div className="forgot-password-wrap">
    <button className="back-button login-password-back" type="button" onClick={() => window.history.back()}><img src="/assets/auth/arrow-narrow-left.svg" alt="" />Back</button>
    <form className="auth-form forgot-password-form" onSubmit={submit} noValidate>
      <div className="form-heading"><h1>Forgot password</h1><p>Need help accessing your account? Provide a recovery mail below to get a reset code.</p></div>
      <div className="form-body"><label className="field recovery-email-field"><span>Recovery email</span><span className="field-control"><img src="/assets/auth/mail-03.svg" alt="" /><input type="email" placeholder="Enter your business email" value={email} onChange={(event) => setEmail(event.target.value)} /></span></label><button className="primary-button" type="submit" disabled={!ready}>Send code</button></div>
    </form>
  </div>;
}
