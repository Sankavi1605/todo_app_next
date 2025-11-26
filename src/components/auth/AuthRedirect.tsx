"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/utils/auth-client";

export default function AuthRedirect() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    async function checkSession() {
      try {
        const session = await authClient.getSession();
        if (session?.data?.session) {
          router.push("/");
        }
      } catch (error) {
        // User is not logged in, stay on auth page
      } finally {
        setIsChecking(false);
      }
    }
    
    checkSession();
  }, [router]);

  return null;
}
