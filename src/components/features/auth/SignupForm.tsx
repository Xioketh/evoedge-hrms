"use client";

import { useEffect, Fragment } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signupAction } from "@/src/actions/auth.actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Text } from "../../ui/text";
import { SIGNUP_FORM_FIELDS } from "@/src/constants/auth.constants";
import { toast } from "sonner";
import { initialState } from "@/src/types/auth.types";

export default function SignupForm() {
  const router = useRouter();
  const [state, action, isPending] = useActionState(signupAction, initialState);

  useEffect(() => {
    if (state.success) {
      toast.success("Welcome to HR Workspace 🎉", {
        description: "Your company account has been created successfully. You can now sign in and start managing your team.",
      });
      router.push("/login");
    } else if (state.message) {
      toast.error("Registration Failed", {
        description: state.message,
      });
    }
  }, [state, router]);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-background w-full h-full">
      <Card className="w-full max-w-[520px] border-none">
        <CardHeader className="space-y-2 pb-8">
          <CardTitle>Create Your Account</CardTitle>
          <CardDescription>
            Set up your HR workspace and manage your organization easily.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={action}>
            <div className="grid grid-cols-2 gap-4">
              {SIGNUP_FORM_FIELDS.map((field) => (
                <Fragment key={field.name}>
                  {field.dividerBefore && (
                    <div className="col-span-2 my-2">
                      <hr />
                    </div>
                  )}
                  <div
                    className={field.halfWidth ? "col-span-1" : "col-span-2"}
                  >
                    <Text size={"1"}>{field.label}</Text>
                    <Input
                      id={field.name}
                      name={field.name}
                      type={field.type}
                      placeholder={field.placeholder}
                      required={field.required}
                      minLength={field.minLength}
                      className="mt-1"
                      defaultValue={state.inputs?.[field.name] as string || ""}
                    />
                    
                    {/* Zod Field-Level Error Display */}
                    {state.fieldErrors?.[field.name] ? (
                      <p className="mt-1 text-xs text-red-500">
                        {state.fieldErrors[field.name][0]}
                      </p>
                    ) : field.hint ? (
                      <p className="mt-1 text-xs text-gray-500">{field.hint}</p>
                    ) : null}

                  </div>
                </Fragment>
              ))}
            </div>

            <Button
              type="submit"
              variant={"default"}
              size={"default"}
              className="w-full mt-6"
              disabled={isPending}
            >
              {isPending ? "Creating Workspace..." : "Create Account"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center justify-center space-y-2 pt-6 border-t border-border/50">
          <div className="flex items-center text-xs text-muted-foreground">
            <Text size={"1"}>
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Sign In
              </Link>
            </Text>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}