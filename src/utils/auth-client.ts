"use client";
import { createAuthClient } from "better-auth/client";

const baseURL = process.env.NEXT_PUBLIC_APP_URL?.trim() || undefined;

export const authClient = createAuthClient({
  // When NEXT_PUBLIC_APP_URL is not provided we fall back to relative paths
  baseURL,
});

export const { signIn, signUp, signOut, useSession } = authClient;