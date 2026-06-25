import { Card, CardContent } from "@/src/components/ui/card";
import { Text } from "@/src/components/ui/text";
import { Mail, User, Calendar, Network } from "lucide-react";

interface EmployeeMetaIndicatorsProps {
  employee: {
    employeeCode: string | null;
    joinedDate: Date | string;
    email: string;
    managerName: string | null;
  };
}

export function EmployeeMetaIndicators({ employee }: EmployeeMetaIndicatorsProps) {
  const metaIndicators = [
    {
      label: "Employee ID",
      icon: User,
      value: employee.employeeCode,
    },
    {
      label: "Joined",
      icon: Calendar,
      value: new Date(employee.joinedDate).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' }),
    },
    {
      label: "Email Address",
      icon: Mail,
      value: employee.email,
      truncate: true,
    },
    {
      label: "Reporting To",
      icon: Network,
      value: employee.managerName,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metaIndicators.map((indicator, index) => (
        <Card key={index} className="bg-dark">
          <CardContent className="pt-6">
            <Text className="tracking-wider uppercase" color="muted">
              {indicator.label}
            </Text>
            <div className={`flex items-center gap-2 mt-1 ${indicator.truncate ? 'truncate' : ''}`}>
              <indicator.icon className="size-4 text-muted-foreground shrink-0" />
              <Text size={'2'} className={indicator.truncate ? 'truncate' : undefined}>{indicator.value}</Text>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
