import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getCurrentSession } from "@/utils/auth";

export const dynamic = "force-dynamic";

export default async function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  try {
    const session = await getCurrentSession();
    if (session?.session) {
      redirect("/");
    }
  } catch (error) {
    // During build time or if auth fails, just render the page
    console.error("Auth check failed:", error);
  }

  return <>{children}</>;
}
