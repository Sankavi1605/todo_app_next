import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getCurrentSession } from "@/utils/auth";

export const dynamic = "force-dynamic";

export default async function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getCurrentSession();
  if (session?.session) {
    redirect("/");
  }

  return <>{children}</>;
}
