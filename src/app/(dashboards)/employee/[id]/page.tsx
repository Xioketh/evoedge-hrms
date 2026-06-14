import { getSession } from "@/src/core/services/auth.service";
import { getEmployeeProfileByUserId } from "@/src/core/services/employee.service";
import { notFound, redirect } from "next/navigation";
import { Role } from "@prisma/client";
import { Mail, ShieldCheck, User, Calendar, Network, FileText, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface EmployeeDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function EmployeeDetailPage({ params }: EmployeeDetailPageProps) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { id: targetUserId } = await params;

  if (session.role === Role.EMPLOYEE && session.userId !== targetUserId) {
    redirect(`/employee/${session.userId}`); 
  }

  const employee = await getEmployeeProfileByUserId(targetUserId, session.companyId);
  if (!employee) notFound();

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
      {/* Back to Directory button for management */}
      {session.role !== Role.EMPLOYEE && (
        <Link href="/employee" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2">
          <ArrowLeft className="size-4" /> Back to Directory
        </Link>
      )}

      {/* Profile Header Block */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 bg-card border rounded-xl gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="size-16 rounded-full bg-primary/10 border flex items-center justify-center text-primary font-semibold text-xl">
            {employee.firstName[0]}{employee.lastName[0]}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold">{employee.firstName} {employee.lastName}</h1>
              <span className="text-xs font-semibold bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded-full border border-blue-200 uppercase tracking-wider">
                {employee.employmentType.replace("_", " ")}
              </span>
            </div>
            <p className="text-muted-foreground text-sm font-medium">{employee.jobTitle} • {employee.departmentName}</p>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-600 font-medium">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {employee.isActive ? "Active Status" : "Inactive"}
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 bg-secondary text-secondary-foreground border px-4 py-2 text-sm font-medium rounded-lg hover:bg-secondary/80 transition-all">
            <Mail className="size-4" /> Message
          </button>
          {session.role !== Role.EMPLOYEE && (
            <button className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2 text-sm font-medium rounded-lg hover:bg-primary/90 transition-all">
              Edit Details
            </button>
          )}
        </div>
      </div>

      {/* Meta Indicators Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-muted/40 border rounded-xl">
          <p className="text-xs font-bold text-muted-foreground tracking-wider uppercase">Employee ID</p>
          <div className="flex items-center gap-2 mt-1">
            <User className="size-4 text-muted-foreground" />
            <span className="text-sm font-semibold font-mono">{employee.employeeCode}</span>
          </div>
        </div>

        <div className="p-4 bg-muted/40 border rounded-xl">
          <p className="text-xs font-bold text-muted-foreground tracking-wider uppercase">Joined</p>
          <div className="flex items-center gap-2 mt-1">
            <Calendar className="size-4 text-muted-foreground" />
            <span className="text-sm font-semibold">
              {new Date(employee.joinedDate).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })}
            </span>
          </div>
        </div>

        <div className="p-4 bg-muted/40 border rounded-xl">
          <p className="text-xs font-bold text-muted-foreground tracking-wider uppercase">Email Address</p>
          <div className="flex items-center gap-2 mt-1 truncate">
            <Mail className="size-4 text-muted-foreground" />
            <span className="text-sm font-semibold truncate">{employee.email}</span>
          </div>
        </div>

        <div className="p-4 bg-muted/40 border rounded-xl">
          <p className="text-xs font-bold text-muted-foreground tracking-wider uppercase">Reporting To</p>
          <div className="flex items-center gap-2 mt-1">
            <Network className="size-4 text-muted-foreground" />
            <span className="text-sm font-semibold">{employee.managerName}</span>
          </div>
        </div>
      </div>

      {/* Section Tabs Interface */}
      <div className="border-b flex gap-6 text-sm font-medium text-muted-foreground px-2">
        <span className="border-b-2 border-primary text-primary pb-3 cursor-pointer">Overview</span>
        <span className="pb-3 hover:text-foreground cursor-pointer transition-colors">Payroll</span>
        <span className="pb-3 hover:text-foreground cursor-pointer transition-colors">Leaves</span>
        <span className="pb-3 hover:text-foreground cursor-pointer transition-colors">Attendance</span>
      </div>

      {/* Content Grid Layout matching provided UI design */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Monthly Attendance Card Component Placeholder */}
            <div className="p-5 border bg-card rounded-xl shadow-sm flex flex-col justify-between h-40">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-sm tracking-tight text-muted-foreground">Monthly Attendance</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Current billing cycle</p>
                </div>
                <span className="text-2xl font-bold text-primary">98%</span>
              </div>
              <div className="flex justify-between items-end text-xs">
                <div className="space-y-0.5">
                  <p className="text-emerald-600 font-medium">20 Present</p>
                  <p className="text-red-500 font-medium">0 Late</p>
                </div>
                <span className="text-primary font-medium cursor-pointer hover:underline">View Logs</span>
              </div>
            </div>

            {/* Last Salary Slip Card */}
            <div className="p-5 border bg-card rounded-xl shadow-sm flex flex-col justify-between h-40">
              <div>
                <h3 className="font-semibold text-sm tracking-tight text-muted-foreground">Last Salary Slip</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Processed: Oct 01, 2024</p>
              </div>
              <div className="space-y-3">
                <span className="text-2xl font-bold tracking-tight">$8,500.00</span>
                <button className="w-full inline-flex items-center justify-center gap-1.5 border py-1.5 text-xs font-medium rounded-lg hover:bg-muted transition-all">
                  <FileText className="size-3.5" /> Download PDF
                </button>
              </div>
            </div>
          </div>

          {/* Recent Activity Stream Container */}
          <div className="p-5 border bg-card rounded-xl shadow-sm space-y-4">
            <h3 className="font-semibold text-base tracking-tight">Recent Activities</h3>
            <div className="border-l-2 border-muted ml-3 pl-5 space-y-5 text-sm relative">
              <div className="relative">
                <span className="size-3 bg-primary rounded-full absolute -left-[26px] top-1 border-2 border-background"></span>
                <p className="font-medium text-foreground">Design System Update Uploaded</p>
                <p className="text-xs text-muted-foreground mt-0.5">Finalized the typography tokens for the Q4 dashboard overhaul.</p>
                <span className="text-[10px] text-muted-foreground absolute right-0 top-1">2h ago</span>
              </div>
              <div className="relative">
                <span className="size-3 bg-muted-foreground rounded-full absolute -left-[26px] top-1 border-2 border-background"></span>
                <p className="font-medium text-foreground">Clocked In</p>
                <p className="text-xs text-muted-foreground mt-0.5">Remote login recorded from San Francisco office.</p>
                <span className="text-[10px] text-muted-foreground absolute right-0 top-1">9:00 AM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Information Sidebar Col */}
        <div className="space-y-6">
          <div className="p-5 border bg-card rounded-xl shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-sm text-muted-foreground tracking-tight">Performance Review</h3>
              <span className="text-lg font-bold">4.8 <span className="text-xs text-muted-foreground font-normal">/5.0</span></span>
            </div>
            <blockquote className="text-xs italic bg-muted/30 border-l-2 border-primary/50 p-3 rounded-r-lg text-muted-foreground">
              "Alex consistently exceeds expectations, particularly in UI implementation velocity."
            </blockquote>
            <p className="text-xs font-semibold text-primary cursor-pointer hover:underline text-right">Read Full Review</p>
          </div>
        </div>
      </div>
    </div>
  );
}