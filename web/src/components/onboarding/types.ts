export type Scope = "enterprise" | "team";

export type OnboardingData = {
  goal: string;
  otherGoal: string;
  scope: Scope | null;
  companyName: string;
  industry: string;
  companySize: string;
  role: string;
  website: string;
  businessUrl: string;
  businessContext: string;
  objectiveAnswers: string[];
  alignmentCycle: string;
  invites: { email: string; role: string }[];
};

export const initialOnboardingData: OnboardingData = {
  goal: "",
  otherGoal: "",
  scope: null,
  companyName: "",
  industry: "",
  companySize: "",
  role: "",
  website: "",
  businessUrl: "",
  businessContext: "",
  objectiveAnswers: ["", ""],
  alignmentCycle: "Every year",
  invites: [{ email: "", role: "" }],
};

export type StepProps = {
  data: OnboardingData;
  update: (patch: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
};
