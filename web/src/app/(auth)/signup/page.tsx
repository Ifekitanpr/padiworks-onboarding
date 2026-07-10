"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, KeyRound, Mail, UserRound } from "lucide-react";

import { AuthShell } from "@/components/auth/auth-shell";
import { AuthFormHeader } from "@/components/auth/auth-form-header";
import { GoogleIcon } from "@/components/auth/google-icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import { PasswordChecklist, passwordRules } from "@/components/auth/password-checklist";

const signupSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().min(1, "Business email is required").email("Enter a valid email"),
  password: z.string().optional(),
});

type SignupValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [termsError, setTermsError] = useState(false);
  const [method, setMethod] = useState<"otp" | "password">("otp");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isValid },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
    defaultValues: { firstName: "", lastName: "", email: "", password: "" },
  });

  const password = useWatch({ control, name: "password" }) ?? "";
  const passwordValid = method === "otp" || passwordRules.every((rule) => rule.test(password));
  const canSubmit = isValid && agreeToTerms && passwordValid && !isSubmitting;

  async function onSubmit(values: SignupValues) {
    if (!agreeToTerms) {
      setTermsError(true);
      return;
    }
    if (method === "password" && !passwordValid) return;
    // Stubbed: no backend wired up yet.
    console.log("signup", values);
    router.push("/verify-email");
  }

  return (
    <AuthShell
      step={1}
      panelHeadline="AI-native Execution Intelligence Operating System for growing teams."
    >
      <div className="flex flex-col gap-10">
        <AuthFormHeader
          title="Create an account"
          description="Join us today to unlock exclusive features that enhance your team performance!"
        />

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
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

          <FieldGroup>
            <div className="grid grid-cols-2 gap-5">
              <Field data-invalid={!!errors.firstName}>
                <FieldLabel htmlFor="firstName">First name</FieldLabel>
                <div className="relative"><UserRound className="pointer-events-none absolute top-1/2 left-4 size-[18px] -translate-y-1/2 text-brand-grey-600"/><Input id="firstName" placeholder="e.g John" className="h-[52px] pl-12" {...register("firstName")} /></div>
                <FieldError errors={[errors.firstName]} />
              </Field>
              <Field data-invalid={!!errors.lastName}>
                <FieldLabel htmlFor="lastName">Last name</FieldLabel>
                <div className="relative"><UserRound className="pointer-events-none absolute top-1/2 left-4 size-[18px] -translate-y-1/2 text-brand-grey-600"/><Input id="lastName" placeholder="e.g. Doe" className="h-[52px] pl-12" {...register("lastName")} /></div>
                <FieldError errors={[errors.lastName]} />
              </Field>
            </div>

            <Field data-invalid={!!errors.email}>
              <FieldLabel htmlFor="email">Business email</FieldLabel>
              <div className="relative"><Mail className="pointer-events-none absolute top-1/2 left-4 size-[18px] -translate-y-1/2 text-brand-grey-600"/><Input id="email" type="email" placeholder="Enter your business email" className="h-[52px] pl-12" {...register("email")} /></div>
              <FieldError errors={[errors.email]} />
            </Field>

            <button type="button" onClick={() => setMethod(method === "otp" ? "password" : "otp")} className="flex w-fit items-center gap-2 text-sm text-brand-grey-500">
              {method === "otp" ? <KeyRound className="size-5"/> : <Mail className="size-5"/>}
              {method === "otp" ? <>Prefer a password? <span className="text-brand-purple-500 underline">Set up with email &amp; password</span></> : <>Prefer email only? <span className="text-brand-purple-500 underline">Set up with email and OTP instead</span></>}
            </button>

            {method === "password" && <>
              <Field data-invalid={!!errors.password || (password.length > 0 && !passwordValid)}>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <div className="relative"><KeyRound className="pointer-events-none absolute top-1/2 left-4 size-[18px] -translate-y-1/2 text-brand-grey-600"/><Input id="password" type={showPassword ? "text" : "password"} placeholder="Create a secure password" className="h-[52px] pr-12 pl-12" {...register("password")} /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute top-1/2 right-4 -translate-y-1/2 text-brand-grey-500" aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff className="size-[18px]"/> : <Eye className="size-[18px]"/>}</button></div>
              </Field>
              <PasswordChecklist password={password}/>
            </>}

            <Field orientation="horizontal" data-invalid={termsError}>
              <Checkbox
                id="agreeToTerms"
                checked={agreeToTerms}
                onCheckedChange={(checked) => {
                  setAgreeToTerms(checked === true);
                  setTermsError(false);
                }}
              />
              <FieldLabel htmlFor="agreeToTerms" className="text-sm font-normal text-brand-grey-500">
                I agree to the{" "}
                <Link href="#" className="text-brand-purple-500 underline">
                  Privacy policy
                </Link>{" "}
                and{" "}
                <Link href="#" className="text-brand-purple-500 underline">
                  terms of use
                </Link>{" "}
                by padiworks
              </FieldLabel>
            </Field>
            {termsError && (
              <FieldError>You must agree to the terms to continue</FieldError>
            )}
          </FieldGroup>

          <div className="flex flex-col items-center gap-2">
            <Button
              type="submit"
              disabled={!canSubmit}
              className="h-14 w-full text-base"
            >
              Sign up
            </Button>
            <p className="text-sm text-brand-grey-600">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-brand-purple-500">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </AuthShell>
  );
}
