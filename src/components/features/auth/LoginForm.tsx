"use client";

import * as React from "react";
import { useEffect, useActionState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, LucideIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Text } from "@/src/components/ui/text";
import { loginAction } from "@/src/actions/auth.actions";
import { LOGIN_FORM_FIELDS } from "@/src/constants/auth.constants";
import { toast } from "sonner";
import { initialState } from "@/src/types/auth.types";

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [state, action, isPending] = useActionState(loginAction, initialState);

  useEffect(() => {
    if (state.success) {
      router.push("/dashboard");
      toast.success("Welcome Back 👋");
    } else if (state.message) {
      toast.error("Login Failed", {
        description: state.message,
      });
    }
  }, [state]);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-background w-full h-full">
      <Card className="w-full max-w-[520px] border-none">
        <CardHeader className="space-y-2 pb-8">
          <CardTitle>Welcome Back</CardTitle>
          <CardDescription>
            Sign in to continue to your HR workspace
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form action={action} className="space-y-6">
            {LOGIN_FORM_FIELDS.map((field) => (
              <div key={field.name} className="space-y-2">
                <Text size={"1"}>{field.label}</Text>
                <div className="relative">
                  {field.Icon && (
                    <field.Icon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  )}
                  <Input
                    name={field.name}
                    type={
                      field.isPassword
                        ? showPassword
                          ? "text"
                          : "password"
                        : field.type
                    }
                    placeholder={field.placeholder}
                    className={`pl-12 ${field.isPassword ? "pr-12" : ""}`}
                    required={field.required}
                    defaultValue={state.inputs?.[field.name] as string || ""}
                  />
                  {field.isPassword && (
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}

            <div className="flex items-center justify-between mt-2">
              <Link
                href="/forgot-password"
                className="text-sm text-primary font-medium hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <Button
              type="submit"
              variant={"default"}
              size={"default"}
              className="w-full mt-4"
              disabled={isPending}
            >
              {isPending ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col items-center justify-center space-y-2 pt-6 border-t border-border/50">
          <div className="flex items-center text-xs text-muted-foreground">
            <Text size={"1"}>
              Don't have an account?{" "}
              <Link href="/signup" className="text-primary hover:underline">
                Sign Up
              </Link>
            </Text>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
