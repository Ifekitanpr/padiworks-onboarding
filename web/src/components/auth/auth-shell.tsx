import type { ReactNode } from "react";

type AuthShellProps = {
  children: ReactNode;
  verification?: boolean;
  recovery?: boolean;
  recoveryCode?: boolean;
  reset?: boolean;
};

export function AuthShell({ children, verification = false, recovery = false, recoveryCode = false, reset = false }: AuthShellProps) {
  return (
    <main className={`auth-shell${verification ? " auth-shell--verification" : ""}`}>
      <aside className="auth-rail" aria-label="Padiworks introduction">
        <div className="auth-art">
          <div className="auth-art__glow" />
          <div className="auth-art__vector"><img src="/assets/auth/panel-vector.svg" alt="" aria-hidden="true" /></div>
          <header className="auth-art__header">
            <img className="auth-art__logo" src="/assets/auth/logo-white.svg" alt="Padiworks" />
            <button className="help-link" type="button"><img src="/assets/auth/help-circle.svg" alt="" />Use help</button>
          </header>
          {reset ? <ResetArtwork /> : recoveryCode ? <RecoveryCodeArtwork /> : recovery ? <RecoveryArtwork /> : verification ? <VerificationArtwork /> : <SignupArtwork />}
        </div>
      </aside>
      <section className="auth-content">{children}</section>
    </main>
  );
}

function ResetArtwork() {
  return <div className="verification-art reset-art"><h2>One last step <span aria-hidden>😀</span></h2><p>Now let&apos;s create a strong and memorable new password</p><div className="collage reset-collage" aria-hidden><img className="verification-collage__image" src="/assets/auth/reset-password-collage-exact.png" alt="" /></div></div>;
}

function RecoveryCodeArtwork() {
  return <div className="verification-art recovery-code-art"><h2>Hi Patrick <span aria-hidden>👋</span></h2><p>Almost there! Just check for the reset instructions in your inbox.</p><div className="collage recovery-code-collage" aria-hidden><img className="verification-collage__image" src="/assets/auth/recovery-code-collage-exact.png" alt="" /></div></div>;
}

function RecoveryArtwork() {
  return (
    <div className="verification-art recovery-art">
      <h2>You don&apos;t remember <span aria-hidden>🤔</span></h2>
      <p>We&apos;ve got you! Let&apos;s reset it together.</p>
      <div className="recovery-collage" aria-hidden>
        <div className="recovery-card recovery-card--back"><span><img src="/assets/auth/recovery-card-strips.png" alt="" /></span></div>
        <div className="recovery-card recovery-card--mid"><span><img src="/assets/auth/recovery-card-strips.png" alt="" /></span></div>
        <div className="recovery-card recovery-card--main"><span><img src="/assets/auth/recovery-card-main.png" alt="" /></span></div>
        <i className="recovery-avatar"><img className="recovery-avatar__lower" src="/assets/auth/recovery-avatar-lower.svg" alt="" /><img className="recovery-avatar__upper" src="/assets/auth/recovery-avatar-upper.svg" alt="" /><img className="recovery-avatar__mid" src="/assets/auth/recovery-avatar-mid.svg" alt="" /></i>
      </div>
    </div>
  );
}

function SignupArtwork() {
  return (
    <div className="signup-art">
      <div className="signup-art__title">
        <span className="step-mark"><img src="/assets/auth/step-decoration.svg" alt="" /><b>1</b></span>
        <h2>AI-native Execution Intelligence Operating System for growing teams.</h2>
      </div>
      <p className="signup-art__description"><span><img src="/assets/auth/bot-sparkle.svg" alt="" /></span> Enabling performance evidence through execution of strategy, powered by artificial intelligence, designed for growth companies.</p>
      <div className="collage collage--signup" aria-hidden>
        <div className="collage-card collage-card--a"><span className="collage-card__crop"><img src="/assets/auth/board-collage.png" alt="" /></span></div>
        <div className="collage-card collage-card--b"><span className="collage-card__crop"><img src="/assets/auth/board-collage.png" alt="" /></span></div>
        <div className="collage-card collage-card--c"><span className="collage-card__crop"><img src="/assets/auth/board-feature.png" alt="" /></span></div>
        <span className="collage-arrow collage-arrow--a"><img src="/assets/auth/arrow-a.svg" alt="" /></span>
        <span className="collage-arrow collage-arrow--b"><img src="/assets/auth/arrow-b.svg" alt="" /></span>
        <span className="collage-arrow collage-arrow--c"><img src="/assets/auth/arrow-c.svg" alt="" /></span>
        <i className="avatar avatar--a"><img src="/assets/auth/avatar-a.png" alt="" /></i><i className="avatar avatar--b"><img src="/assets/auth/avatar-b.png" alt="" /></i><i className="avatar avatar--c"><img src="/assets/auth/avatar-c.png" alt="" /></i>
      </div>
    </div>
  );
}

function VerificationArtwork() {
  return (
    <div className="verification-art">
      <h2>Hi Patrick <span aria-hidden>👋</span></h2>
      <p>Almost there! Just verify your mail.</p>
      <div className="collage collage--verification" aria-hidden>
        <img className="verification-collage__image" src="/assets/auth/verification-collage-exact.png" alt="" />
      </div>
    </div>
  );
}
