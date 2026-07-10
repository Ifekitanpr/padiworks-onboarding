"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { AuthShell } from "@/components/auth/auth-shell";
import { AuthFormHeader } from "@/components/auth/auth-form-header";
import { OtpInput } from "@/components/auth/otp-input";
import { NotificationCollage } from "@/components/auth/collages";
import { Button } from "@/components/ui/button";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [seconds, setSeconds] = useState(59);
  const code = otp.join("");

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = window.setTimeout(() => setSeconds((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [seconds]);

  function onSubmit() {
    // Stubbed: no backend wired up yet.
    console.log("verify-email otp", code);
    router.push("/onboarding");
  }

  return (
    <AuthShell
      panelHeadline="Hi Patrick 👋"
      panelDescription="Almost there! Just verify your mail."
      panelCallout={null}
      panelCollage={<NotificationCollage />}
    >
      <div className="flex flex-col gap-10">
        <Link
          href="/signup"
          className="flex w-fit items-center gap-2 rounded-lg bg-brand-grey-100 px-4 py-2.5 text-sm text-brand-grey-600"
        >
          <ArrowLeft className="size-4" />
          Back
        </Link>

        <AuthFormHeader
          title="Check your email to get the verification code!"
          description="Check inbox for your email address. Don't forget to look in your spam folder if you don't see it in your inbox right away!"
        />

        <div className="flex flex-col gap-6">
          <OtpInput value={otp} onChange={setOtp} />

          <div className="flex flex-col items-center gap-2">
            <Button
              type="button"
              disabled={code.length !== 6}
              onClick={onSubmit}
              className="h-14 w-full text-base"
            >
              Verify email
            </Button>
            <p className="text-sm text-brand-grey-600">
              Didn&apos;t get a code?{" "}
              <button
                type="button"
                disabled={seconds > 0}
                className="font-medium text-brand-purple-500 disabled:text-brand-grey-600"
                onClick={() => { setSeconds(59); setOtp(Array(6).fill("")); }}
              >
                {seconds > 0 ? `Resend in 00:${String(seconds).padStart(2,"0")}` : "Resend code"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </AuthShell>
  );
}
