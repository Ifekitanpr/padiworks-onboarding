"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, CheckCircle2, Eye, EyeOff, KeyRound, Mail } from "lucide-react";
import { useRouter } from "next/navigation";

import { AuthShell } from "@/components/auth/auth-shell";
import { AuthFormHeader } from "@/components/auth/auth-form-header";
import { OtpInput } from "@/components/auth/otp-input";
import { PasswordChecklist, passwordRules } from "@/components/auth/password-checklist";
import { NotificationCollage, PasswordMockupCollage } from "@/components/auth/collages";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";

const emailSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
});

const passwordSchema = z
  .object({
    password: z.string().refine((p) => passwordRules.every((r) => r.test(p)), {
      error: "Password doesn't meet all requirements",
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Passwords do not match",
    path: ["confirmPassword"],
  });

type Step = "email" | "otp" | "new-password" | "success";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [seconds, setSeconds] = useState(59);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const otpCode = otp.join("");

  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const password = useWatch({ control: passwordForm.control, name: "password" });

  useEffect(() => {
    if (step !== "otp" || seconds <= 0) return;
    const timer = window.setTimeout(() => setSeconds((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [seconds, step]);

  function onSubmitEmail(values: z.infer<typeof emailSchema>) {
    setEmail(values.email);
    setStep("otp");
  }

  function onSubmitOtp() {
    setStep("new-password");
  }

  function onSubmitPassword(values: z.infer<typeof passwordSchema>) {
    // Stubbed: no backend wired up yet.
    console.log("reset-password", { email, password: values.password });
    setStep("success");
  }

  const panelCopy: Record<
    Step,
    { headline: string; description?: string; collage: React.ReactNode }
  > = {
    email: {
      headline: "You don't remember 🤔",
      description: "We've got you! Let's reset it together.",
      collage: <PasswordMockupCollage />,
    },
    otp: {
      headline: "Hi Patrick 👋",
      description: "Almost there! Just check for the reset instructions in your inbox.",
      collage: <NotificationCollage />,
    },
    "new-password": {
      headline: "One last step 😀",
      description: "Now let's create a strong and memorable new password",
      collage: <PasswordMockupCollage />,
    },
    success: {
      headline: "One last step 😀",
      description: "Now let's create a strong and memorable new password",
      collage: <PasswordMockupCollage />,
    },
  };

  return (
    <AuthShell
      panelHeadline={panelCopy[step].headline}
      panelDescription={panelCopy[step].description}
      panelCallout={null}
      panelCollage={panelCopy[step].collage}
    >
      <div className="flex flex-col gap-10">
        {step === "email" && (
          <>
            <Link
              href="/login"
              className="flex w-fit items-center gap-2 text-sm text-brand-grey-600"
            >
              <ArrowLeft className="size-4" />
              Back
            </Link>
            <AuthFormHeader
              title="Forgot password"
              description="Need help accessing your account? Provide a recovery mail below to get a reset code."
            />
            <form onSubmit={emailForm.handleSubmit(onSubmitEmail)} className="flex flex-col gap-6">
              <FieldGroup>
                <Field data-invalid={!!emailForm.formState.errors.email}>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <div className="relative"><Mail className="pointer-events-none absolute top-1/2 left-4 size-[18px] -translate-y-1/2 text-brand-grey-600"/><Input id="email" type="email" placeholder="Enter your recovery email" className="h-[52px] pl-12" {...emailForm.register("email")} /></div>
                  <FieldError errors={[emailForm.formState.errors.email]} />
                </Field>
              </FieldGroup>
              <Button type="submit" className="h-14 w-full text-base">
                Send reset code
              </Button>
            </form>
          </>
        )}

        {step === "otp" && (
          <>
            <button
              type="button"
              onClick={() => setStep("email")}
              className="flex w-fit items-center gap-2 rounded-lg bg-brand-grey-100 px-4 py-2.5 text-sm text-brand-grey-600"
            >
              <ArrowLeft className="size-4" />
              Back
            </button>
            <AuthFormHeader
              title="Check your email to get the reset code!"
              description={`Check inbox for ${email}. Don't forget to look in your spam folder if you don't see it in your inbox right away!`}
            />
            <div className="flex flex-col gap-6">
              <OtpInput value={otp} onChange={setOtp} />
              <div className="flex flex-col items-center gap-2">
                <Button
                  type="button"
                  disabled={otpCode.length !== 6}
                  onClick={onSubmitOtp}
                  className="h-14 w-full text-base"
                >
                  Verify code
                </Button>
                <p className="text-sm text-brand-grey-600">
                  Didn&apos;t get a code?{" "}
                  <button type="button" disabled={seconds > 0} className="font-medium text-brand-purple-500 disabled:text-brand-grey-600" onClick={() => { setSeconds(59); setOtp(Array(6).fill("")); }}>
                    {seconds > 0 ? `Resend in 00:${String(seconds).padStart(2,"0")}` : "Resend code"}
                  </button>
                </p>
              </div>
            </div>
          </>
        )}

        {step === "new-password" && (
          <>
            <AuthFormHeader
              title="Reset your password."
              description="Choose a strong password to keep your account secure."
            />
            <form
              onSubmit={passwordForm.handleSubmit(onSubmitPassword)}
              className="flex flex-col gap-6"
            >
              <FieldGroup>
                <Field data-invalid={!!passwordForm.formState.errors.password}>
                  <FieldLabel htmlFor="password">New password</FieldLabel>
                  <div className="relative"><KeyRound className="pointer-events-none absolute top-1/2 left-4 size-[18px] -translate-y-1/2 text-brand-grey-600"/><Input id="password" type={showPassword ? "text" : "password"} placeholder="Enter your new password" className="h-[52px] pr-12 pl-12" {...passwordForm.register("password")} /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute top-1/2 right-4 -translate-y-1/2 text-brand-grey-500">{showPassword ? <EyeOff className="size-[18px]"/> : <Eye className="size-[18px]"/>}</button></div>
                </Field>
                <PasswordChecklist password={password} />
                <Field data-invalid={!!passwordForm.formState.errors.confirmPassword}>
                  <FieldLabel htmlFor="confirmPassword">Confirm password</FieldLabel>
                  <div className="relative"><KeyRound className="pointer-events-none absolute top-1/2 left-4 size-[18px] -translate-y-1/2 text-brand-grey-600"/><Input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} placeholder="Re-enter your new password" className="h-[52px] pr-12 pl-12" {...passwordForm.register("confirmPassword")} /><button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute top-1/2 right-4 -translate-y-1/2 text-brand-grey-500">{showConfirmPassword ? <EyeOff className="size-[18px]"/> : <Eye className="size-[18px]"/>}</button></div>
                  <FieldError errors={[passwordForm.formState.errors.confirmPassword]} />
                </Field>
              </FieldGroup>
              <Button type="submit" className="h-14 w-full text-base">
                Reset password
              </Button>
            </form>
          </>
        )}

        {step === "success" && (
          <div className="flex flex-col items-center gap-6 text-center">
            <CheckCircle2 className="size-14 text-emerald-500" />
            <AuthFormHeader
              title="Password Reset Successfully!"
              description="Your password has been successfully reset. You can now use your new password to log in to your account."
            />
            <Button
              type="button"
              onClick={() => router.push("/login")}
              className="h-14 w-full text-base"
            >
              Back to login
            </Button>
          </div>
        )}
      </div>
    </AuthShell>
  );
}
