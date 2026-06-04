import * as React from "react";
import { User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Text } from "@/src/components/ui/text";
import { OfferFormSectionProps } from "@/src/types/offer.types";
import FieldError from "./FieldError";

export default function PersonalInfoSection({ state }: OfferFormSectionProps) {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center space-x-3 pb-4">
        <div className="p-2 bg-blue-50 rounded-lg">
          <User className="w-5 h-5 text-blue-600" />
        </div>
        <CardTitle className="text-text-2 font-semibold">Personal Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Text size="1" className="text-muted-foreground font-medium">First name</Text>
            <Input 
              name="firstName" 
              placeholder="Jonathan" 
              defaultValue={state.inputs?.firstName as string || ""}
            />
            <FieldError state={state} name="firstName" />
          </div>
          <div className="space-y-1.5">
            <Text size="1" className="text-muted-foreground font-medium">Last name</Text>
            <Input 
              name="lastName" 
              placeholder="Smith" 
              defaultValue={state.inputs?.lastName as string || ""}
            />
            <FieldError state={state} name="lastName" />
          </div>
        </div>

        <div className="space-y-1.5">
          <Text size="1" className="text-muted-foreground font-medium">NIC Number</Text>
          <Input 
            name="nicNumber" 
            placeholder="12345-6789012-3" 
            defaultValue={state.inputs?.nicNumber as string || ""}
          />
          <FieldError state={state} name="nicNumber" />
        </div>

        <div className="space-y-1.5">
          <Text size="1" className="text-muted-foreground font-medium">Email Address</Text>
          <Input 
            name="email" 
            type="email"
            placeholder="jonathan.smith@example.com" 
            defaultValue={state.inputs?.email as string || ""}
          />
          <FieldError state={state} name="email" />
        </div>
      </CardContent>
    </Card>
  );
}