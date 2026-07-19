import { AuthShell } from "../../components/auth/auth-shell";
import { VerificationForm } from "../../components/auth/verification-form";

export default async function VerifyEmailPage({ searchParams }: { searchParams: Promise<{ email?: string }> }) {
  const { email } = await searchParams;
  return <AuthShell verification><VerificationForm email={email || "adaninipatrick17@gmail.com"} /></AuthShell>;
}
