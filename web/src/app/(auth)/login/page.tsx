"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, KeyRound, Mail } from "lucide-react";

import { AuthShell } from "@/components/auth/auth-shell";
import { AuthFormHeader } from "@/components/auth/auth-form-header";
import { GoogleIcon } from "@/components/auth/google-icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";

const emailSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
});

const passwordSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "password">("email");
  const [email, setEmail] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: "" },
  });

  function onSubmitEmail(values: z.infer<typeof emailSchema>) {
    setEmail(values.email);
    setStep("password");
  }

  function onSubmitPassword(values: z.infer<typeof passwordSchema>) {
    // Stubbed: no backend wired up yet.
    console.log("login", { email, password: values.password, rememberMe });
    router.push("/onboarding");
  }

  return (
    <AuthShell
      step={1}
      panelHeadline="AI-native Execution Intelligence Operating System for growing teams."
    >
      <div className="flex flex-col gap-10">
        {step === "email" ? (
          <AuthFormHeader
            title="Welcome back 👋"
            description="Please log in to your account to access all of your personalized features and settings."
          />
        ) : (
          <>
            <button
              type="button"
              onClick={() => setStep("email")}
              className="flex w-fit items-center gap-2 text-sm text-brand-grey-600"
            >
              <ArrowLeft className="size-4" />
              Back
            </button>
            <AuthFormHeader
              title="Enter your password"
              description={`Provide the password for ${email}`}
            />
          </>
        )}

        {step === "email" ? (
          <form
            onSubmit={emailForm.handleSubmit(onSubmitEmail)}
            className="flex flex-col gap-6"
          >
            <Button
              type="button"
              variant="outline"
              className="h-11 w-full gap-3 text-brand-grey-600"
            >
              <GoogleIcon className="size-5" />
              Continue with Google
            </Button>

            <div className="flex items-center gap-5 py-1">
              <div className="h-px flex-1 bg-brand-grey-200" />
              <span className="text-sm text-brand-grey-500">Or continue with</span>
              <div className="h-px flex-1 bg-brand-grey-200" />
            </div>

            <Field data-invalid={!!emailForm.formState.errors.email}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <div className="relative"><Mail className="pointer-events-none absolute top-1/2 left-4 size-[18px] -translate-y-1/2 text-brand-grey-600"/><Input id="email" type="email" placeholder="Enter your email" className="h-[52px] pl-12" {...emailForm.register("email")} /></div>
              <FieldError errors={[emailForm.formState.errors.email]} />
            </Field>

            <div className="flex flex-col items-center gap-2">
              <Button type="submit" className="h-14 w-full text-base">
                Continue
              </Button>
              <p className="text-sm text-brand-grey-600">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="font-medium text-brand-purple-500">
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        ) : (
          <form
            onSubmit={passwordForm.handleSubmit(onSubmitPassword)}
            className="flex flex-col gap-6"
          >
            <FieldGroup>
              <Field data-invalid={!!passwordForm.formState.errors.password}>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <div className="relative"><KeyRound className="pointer-events-none absolute top-1/2 left-4 size-[18px] -translate-y-1/2 text-brand-grey-600"/><Input id="password" type={showPassword ? "text" : "password"} placeholder="Enter your password" className="h-[52px] pr-12 pl-12" {...passwordForm.register("password")} /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute top-1/2 right-4 -translate-y-1/2 text-brand-grey-500" aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff className="size-[18px]"/> : <Eye className="size-[18px]"/>}</button></div>
                <FieldError errors={[passwordForm.formState.errors.password]} />
              </Field>
            </FieldGroup>

            <div className="flex items-center justify-between">
              <Field orientation="horizontal" className="w-fit">
                <Checkbox
                  id="rememberMe"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                />
                <FieldLabel htmlFor="rememberMe" className="text-sm font-normal text-brand-grey-600">
                  Remember me
                </FieldLabel>
              </Field>
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-brand-purple-500"
              >
                Forgot password?
              </Link>
            </div>

            <div className="flex flex-col items-center gap-2">
              <Button type="submit" className="h-14 w-full text-base">
                Sign in
              </Button>
              <p className="text-sm text-brand-grey-600">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="font-medium text-brand-purple-500">
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        )}
      </div>
    </AuthShell>
  );
}
