// src/app/page.tsx
import { redirect } from "next/navigation";
import { getSession } from "../core/services/auth.service";

export default async function HomePage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  } else {
    redirect("/dashboard");
  }
}
