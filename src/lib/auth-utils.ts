import { auth } from "@/auth";
import { UserRole } from "@/generated/prisma";
import { redirect } from "next/navigation";

export async function getRequiredSession() {
  const session = await auth();
  if (!session?.user) {
    redirect("/signin");
  }
  return session;
}

export async function requireRole(role: UserRole) {
  const session = await getRequiredSession();
  if (session.user.role !== role && session.user.role !== "ADMIN") {
    redirect("/");
  }
  return session;
}

export async function requireAdmin() {
  return requireRole("ADMIN" as UserRole);
}

export async function requireSeller() {
  const session = await getRequiredSession();
  if (session.user.role !== "SELLER" && session.user.role !== "ADMIN") {
    redirect("/");
  }
  return session;
}
