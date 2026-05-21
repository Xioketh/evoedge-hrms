// src/app/(auth)/signup/page.tsx

import { AuthBranding } from "@/src/components/features/auth/AuthBranding";
import SignupForm from "@/src/components/features/auth/SignupForm";

export default function SignupPage() {
  return (
    <div className="min-h-screen w-full grid lg:grid-cols-2">
      <AuthBranding />
      <SignupForm />
    </div>
  );
}
