// src/app/(auth)/login/page.tsx

import LoginForm from "@/src/components/features/auth/LoginForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-2 mt-2">
          <CardTitle className="text-3xl font-extrabold tracking-tight">
            EvoEdge HRMS
          </CardTitle>
          <CardDescription>
            Sign in to your account
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>

    </div>
  );
}