"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [remember, setRemember] = useState(false);
  const ready = /\S+@\S+\.\S+/.test(email);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (ready) router.push(`/login/password?email=${encodeURIComponent(email)}`);
  }

  return <form className="auth-form login-form" onSubmit={submit} noValidate>
    <div className="form-heading"><h1>Welcome back 👋</h1><p>Please log in to your account to access all of your personalized features and settings.</p></div>
    <div className="form-body">
      <div className="social-block"><button className="social-button" type="button"><img src="/assets/auth/google.svg" alt="" />Continue with Google</button><div className="labeled-divider"><span>Or continue with</span></div></div>
      <label className="field"><span>Business email</span><span className="field-control"><img src="/assets/auth/mail-03.svg" alt="" /><input type="email" placeholder="Enter your business email" value={email} onChange={(event) => setEmail(event.target.value)} /></span></label>
      <div className="login-action"><label className="remember"><input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} />Remember me</label><button className="primary-button" type="submit" disabled={!ready}>Continue</button><p className="form-footer">Don&apos;t have an account? <a href="/signup">Sign up</a></p></div>
    </div>
  </form>;
}
