import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { db } from "@/src/core/db/db.client";
import { SessionPayload } from "@/src/types/session.types";
import { SignupInput } from "../../types/schemas/auth.schema";

import { UserRepository } from "../repositories/user.repository";
import { CompanyRepository } from "../repositories/company.repository";
import { EmployeeRepository } from "../repositories/employee.repository";
import { Role } from "@prisma/client";
import { createEmployeeAccount } from "./user.service";

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback_secret_do_not_use_in_prod",
);

export async function createSession(payload: SessionPayload) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(SECRET_KEY);

  const cookieStore = await cookies();
  cookieStore.set("session_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload as SessionPayload;
  } catch (error) {
    return null;
  }
}

export async function verifyCredentials(email: string, password: string) {
  const user = await UserRepository.findByEmail(email);
  if (!user) return null;
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) return null;
  return {
    id: user.id,
    role: user.role,
    companyId: user.companyId,
    firstName: user.profile?.firstName || "",
    lastName: user.profile?.lastName || "",
  };
}

export const registerTenant = async (data: SignupInput) => {
  const existingUser = await UserRepository.findByEmail(data.email);
  if (existingUser) {
    throw new Error("A user with this email already exists.");
  }

  const existingCompany = await CompanyRepository.findByName(data.companyName);
  if (existingCompany) {
    throw new Error("A company with this name already exists.");
  }

  const hashedPassword = await bcrypt.hash(data.password, 12);
  const adminRole: Role = "HR_DIRECTOR";

  return await db.$transaction(async (tx) => {
    const company = await CompanyRepository.createCompanyWithDepartments(
      data.companyName,
      data.departments,
      tx,
    );

    const user = await createEmployeeAccount(tx, {
      email: data.email,
      hashedPassword: hashedPassword,
      companyId: company.id,
      companyName: data.companyName,
      firstName: data.firstName,
      lastName: data.lastName,
      employmentType: "FULL_TIME",
      role: adminRole,
    });

    return user;
  });
};
