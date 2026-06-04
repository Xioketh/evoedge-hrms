import * as React from "react";
import { FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Text } from "@/src/components/ui/text";
import { OfferFormSectionProps } from "@/src/types/offer.types";
import FieldError from "./FieldError";

export default function OfferContentSection({ state }: OfferFormSectionProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div className="flex flex-row items-center space-x-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <CardTitle className="text-text-2 font-semibold">Offer Content</CardTitle>
        </div>
        {/* Placeholder for rich text toolbar */}
        <div className="flex gap-2 text-muted-foreground cursor-not-allowed opacity-50">
           <Text size="1" className="font-bold font-serif">B</Text>
           <Text size="1" className="italic font-serif">I</Text>
           <Text size="1">≡</Text>
           <Text size="1">🔗</Text>
        </div>
      </CardHeader>
      <CardContent>
        <textarea 
          name="offerContent"
          className="w-full min-h-[200px] rounded-lg border border-input p-4 text-sm bg-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-y"
          placeholder="Write detailed offer terms, responsibilities, and specific conditions here..."
          defaultValue={state.inputs?.offerContent as string || ""}
        />
        <FieldError state={state} name="offerContent" />
      </CardContent>
    </Card>
  );
}