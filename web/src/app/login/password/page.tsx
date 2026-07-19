import { AuthShell } from "../../../components/auth/auth-shell";
import { LoginPasswordForm } from "../../../components/auth/login-password-form";

export default async function LoginPasswordPage({ searchParams }: { searchParams: Promise<{ email?: string }> }) {
  const { email } = await searchParams;
  return <AuthShell><LoginPasswordForm email={email || "adaninipatrick17@gmail.com"} /></AuthShell>;
}
