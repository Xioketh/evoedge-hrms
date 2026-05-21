import { AuthBranding } from "@/src/components/features/auth/AuthBranding";
import { LoginForm } from "@/src/components/features/auth/LoginForm";
import * as React from "react";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full grid lg:grid-cols-2">
      <AuthBranding />
      <LoginForm />
    </div>
  );
}