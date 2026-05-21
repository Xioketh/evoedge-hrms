import * as React from "react";
import { Text } from "@/src/components/ui/text";
import { Logo } from "../../icons/logo";

export function AuthBranding() {
  return (
    <div className="relative hidden lg:flex flex-col items-center justify-center bg-login-gradient overflow-hidden min-h-screen">
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-90 -right-40 w-170 h-150 rounded-full bg-white opacity-2" />
        <div className="absolute -bottom-10 -left-10 w-72 h-40 bg-white opacity-3 rotate-12 transform" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-10 gap-2">
        <div className="mb-1">
          <Logo className="w-300 h-35" />
        </div>
        <Text color="white" size="1" className="opacity-80 max-w-xs">
          Welcome to the future of HR Management.
        </Text>
      </div>

      <div className="absolute bottom-8 left-8">
        <Text color="white" size="1" className="opacity-50 text-xs">
          Powered By EvoEdge Solution
        </Text>
      </div>
      
    </div>
  );
}