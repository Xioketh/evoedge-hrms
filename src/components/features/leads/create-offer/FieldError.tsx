import * as React from "react";
import { ActionState } from "@/src/types/action.types";

interface FieldErrorProps {
  state: ActionState;
  name: string;
}

export default function FieldError({ state, name }: FieldErrorProps) {
  if (!state.fieldErrors?.[name]) return null;
  
  return (
    <span className="text-destructive text-xs mt-1 block">
      {state.fieldErrors[name][0]}
    </span>
  );
}