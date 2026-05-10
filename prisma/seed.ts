// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

// 3. Pass the adapter to the constructor
const prisma = new PrismaClient({ adapter });
async function main() {
  const hashedPassword = await bcrypt.hash("Owner@123", 10);

  // 1. Create the Tenant and Departments first
  const company = await prisma.company.create({
    data: { name: "EvoEdge Solutions", domain: "evoedge.com" },
  });

  const hrDept = await prisma.department.create({
    data: { name: "Human Resources", companyId: company.id },
  });

  const engineeringDept = await prisma.department.create({
    data: { name: "Engineering", companyId: company.id },
  });

  // 2. Create Top-Level Roles (No managers)
  const hrDirector = await prisma.user.create({
    data: {
      email: "sarah.director@evoedge.com",
      password: hashedPassword,
      role: "HR_DIRECTOR",
      companyId: company.id,
      profile: {
        create: {
          firstName: "Sarah",
          lastName: "Jenkins",
          employeeCode: "EVO-HR-001",
          departmentId: hrDept.id,
        },
      },
    },
    include: { profile: true }, // Required to get the profile ID for subordinates
  });

  const hodEngineering = await prisma.user.create({
    data: {
      email: "kethaka.lead@evoedge.com",
      password: hashedPassword,
      role: "HOD",
      companyId: company.id,
      profile: {
        create: {
          firstName: "Kethaka",
          lastName: "Ranasinghe",
          employeeCode: "EVO-ENG-001",
          departmentId: engineeringDept.id,
        },
      },
    },
    include: { profile: true },
  });

  // 3. Create Mid-Level Roles (Reporting to Top-Level)
  const hrManager = await prisma.user.create({
    data: {
      email: "mike.hrmanager@evoedge.com",
      password: hashedPassword,
      role: "HR_MANAGER",
      companyId: company.id,
      profile: {
        create: {
          firstName: "Mike",
          lastName: "Ross",
          employeeCode: "EVO-HR-002",
          departmentId: hrDept.id,
          managerId: hrDirector.profile?.id, // Assigned to HR Director
        },
      },
    },
    include: { profile: true },
  });

  // 4. Create Base-Level Roles (Reporting to Mid/Top-Level)
  const hrExecutive = await prisma.user.create({
    data: {
      email: "rachel.hrexec@evoedge.com",
      password: hashedPassword,
      role: "HR_EXECUTIVE",
      companyId: company.id,
      profile: {
        create: {
          firstName: "Rachel",
          lastName: "Zane",
          employeeCode: "EVO-HR-003",
          departmentId: hrDept.id,
          managerId: hrManager.profile?.id, // Assigned to HR Manager
        },
      },
    },
  });

  const juniorEmployee = await prisma.user.create({
    data: {
      email: "donna.dev@evoedge.com",
      password: hashedPassword,
      role: "EMPLOYEE",
      companyId: company.id,
      profile: {
        create: {
          firstName: "Donna",
          lastName: "Paulsen",
          employeeCode: "EVO-ENG-002",
          departmentId: engineeringDept.id,
          managerId: hodEngineering.profile?.id, // Assigned to Engineering HOD
        },
      },
    },
  });
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
