import * as React from "react";
import { Briefcase } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Text } from "@/src/components/ui/text";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { OfferFormSectionProps, Department, Manager } from "@/src/types/offer.types";
import { EMPLOYMENT_TYPES } from "@/src/constants/offer.constants";
import FieldError from "./FieldError";

interface EmploymentDetailsProps extends OfferFormSectionProps {
  departments: Department[];
  managers: Manager[];
}

export default function EmploymentDetailsSection({ state, departments, managers }: EmploymentDetailsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-x-3 pb-4">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Briefcase className="w-5 h-5 text-blue-600" />
        </div>
        <CardTitle className="text-text-2 font-semibold">Employment Details</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <Text size="1" className="text-muted-foreground font-medium">Job Position</Text>
          <Input 
            name="jobPosition" 
            placeholder="Senior Product Designer" 
            defaultValue={state.inputs?.jobPosition as string || ""}
          />
          <FieldError state={state} name="jobPosition" />
        </div>

        <div className="space-y-1.5">
          <Text size="1" className="text-muted-foreground font-medium">Department</Text>
          <Select 
            name="departmentId" 
            defaultValue={state.inputs?.departmentId as string || undefined}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select department..." />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={dept.id}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError state={state} name="departmentId" />
        </div>

        <div className="space-y-1.5">
          <Text size="1" className="text-muted-foreground font-medium">Employment Type</Text>
          <Select 
            name="employmentType" 
            defaultValue={state.inputs?.employmentType as string || "FULL_TIME"}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select employment type..." />
            </SelectTrigger>
            <SelectContent>
              {EMPLOYMENT_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError state={state} name="employmentType" />
        </div>

        <div className="space-y-1.5">
          <Text size="1" className="text-muted-foreground font-medium">Reporting Manager</Text>
          <Select 
            name="managerId" 
            defaultValue={state.inputs?.managerId as string || undefined}
          >
            <SelectTrigger>
              <SelectValue placeholder="Search supervisor..." />
            </SelectTrigger>
            <SelectContent>
              {managers.map((manager) => (
                <SelectItem key={manager.id} value={manager.id}>
                  {manager.firstName} {manager.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError state={state} name="managerId" />
        </div>
      </CardContent>
    </Card>
  );
}