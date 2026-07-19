"use client";

import { useState, type FormEvent } from "react";

export function LoginPasswordForm({ email }: { email: string }) {
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [visible, setVisible] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!password) return;
  }

  return <div className="login-password-wrap">
    <button className="back-button login-password-back" type="button" onClick={() => window.history.back()}><img src="/assets/auth/arrow-narrow-left.svg" alt="" />Back</button>
    <form className="auth-form login-password-form" onSubmit={submit} noValidate>
      <div className="form-heading">
        <h1>Enter your password</h1>
        <p>Provide the password for {email}</p>
      </div>
      <div className="form-body">
        <label className="field password-field"><span>Password</span><span className="field-control"><img src="/assets/auth/lock-01.svg" alt="" /><input type={visible ? "text" : "password"} placeholder="Enter your password" value={password} onChange={(event) => setPassword(event.target.value)} /><button type="button" aria-label={visible ? "Hide password" : "Show password"} onClick={() => setVisible((current) => !current)}><img src="/assets/auth/eye-off.svg" alt="" /></button></span></label>
        <div className="login-password-actions">
          <div className="login-password-options"><label className="remember"><input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} />Remember me</label><a className="forgot-password" href="/forgot-password">Forgot password?</a></div>
          <button className="primary-button" type="submit" disabled={!password}>Sign in</button>
          <p className="form-footer">Don&apos;t have an account? <a href="/signup">Sign up</a></p>
        </div>
      </div>
    </form>
  </div>;
}
