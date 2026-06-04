import * as React from "react";
import { Banknote, CalendarDays } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Text } from "@/src/components/ui/text";
import { OfferFormSectionProps } from "@/src/types/offer.types";
import FieldError from "./FieldError";

export default function CompensationSection({ state }: OfferFormSectionProps) {
  return (
    <>
      <Card className="flex-1">
        <CardHeader className="flex flex-row items-center space-x-3 pb-4">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Banknote className="w-5 h-5 text-blue-600" />
          </div>
          <CardTitle className="text-text-2 font-semibold">Compensation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1.5">
            <Text size="1" className="text-muted-foreground font-medium">Base Salary (Annual)</Text>
            <Input 
              name="baseSalary" 
              type="number"
              step="0.01"
              placeholder="0.00" 
              defaultValue={state.inputs?.baseSalary as string || ""}
            />
            <FieldError state={state} name="baseSalary" />
          </div>
        </CardContent>
      </Card>

      <Card className="flex-1 mt-6">
        <CardHeader className="flex flex-row items-center space-x-3 pb-4">
          <div className="p-2 bg-blue-50 rounded-lg">
            <CalendarDays className="w-5 h-5 text-blue-600" />
          </div>
          <CardTitle className="text-text-2 font-semibold">Dates & Validity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1.5">
            <Text size="1" className="text-muted-foreground font-medium">Target Start Date</Text>
            <Input 
              name="targetStartDate" 
              type="date"
              defaultValue={state.inputs?.targetStartDate as string || ""}
            />
            <FieldError state={state} name="targetStartDate" />
          </div>
        </CardContent>
      </Card>
    </>
  );
}