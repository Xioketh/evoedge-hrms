// src/app/(auth)/signup/page.tsx

import SignupForm from "@/src/components/features/auth/SignupForm";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg border border-gray-100">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            EvoEdge HRMS
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign up to your account
          </p>
        </div>

        {/* Render the separated form component here */}
        <SignupForm />
      </div>
    </div>
  );
}
