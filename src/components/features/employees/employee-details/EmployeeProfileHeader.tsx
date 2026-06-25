import { Card, CardContent } from "@/src/components/ui/card";
import { Text } from "@/src/components/ui/text";
import { EditEmployeeModal } from "./EditEmployeeModal";

interface EmployeeProfileHeaderProps {
  employee: {
    id: string;
    firstName: string;
    lastName: string;
    employmentType: string;
    jobTitle: string | null;
    departmentName: string | null;
    isActive: boolean;
    email: string;
    employeeCode: string | null;
  };
  canEdit: boolean;
}

export function EmployeeProfileHeader({ employee, canEdit }: EmployeeProfileHeaderProps) {
  return (
    <Card>
      <CardContent className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-6">
        <div className="flex items-center gap-4">
          <div className="size-16 rounded-full bg-primary/10 border flex items-center justify-center text-primary font-semibold text-xl">
            {employee.firstName[0]}{employee.lastName[0]}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Text size="3">
                {employee.firstName} {employee.lastName}
              </Text>
              <Text className="bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded-full border border-blue-200 uppercase tracking-wider">
                {employee.employmentType.replace("_", " ")}
              </Text>
            </div>
            <Text color="muted">{employee.jobTitle} • {employee.departmentName}</Text>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-600 font-medium">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {employee.isActive ? "Active Status" : "Inactive"}
            </div>
          </div>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          {canEdit && (
            <EditEmployeeModal
              userId={employee.id}
              email={employee.email}
              employeeCode={employee.employeeCode || ""}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
