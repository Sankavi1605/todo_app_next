import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies, toNextJsHandler } from "better-auth/next-js";
import { cookies, headers } from "next/headers";
import { prisma } from "@/utils/prisma";
import { ROLE_VALUES } from "@/utils/rbac";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "mongodb" }),
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "USER",
        input: true,
      },
    },
  },
  callbacks: {
    async session({ session, user }: { session: any; user: any }) {
      if (session?.user && user?.role) {
        (session.user as typeof user).role = user.role;
      }
      return session;
    },
    async user({ user }: { user: any }) {
      // Ensure role is set during user creation
      if (!user.role) {
        user.role = "USER";
      }
      return user;
    },
  },
  plugins: [nextCookies()],
});

export const authHandler = toNextJsHandler(auth.handler);

export async function getCurrentSession() {
  const headerList = headers();
  const cookieStore = cookies();
  const combinedHeaders = new Headers();
  headerList.forEach((value, key) => {
    combinedHeaders.append(key, value);
  });

  if (!combinedHeaders.has("cookie")) {
    const serializedCookies = cookieStore
      .getAll()
      .map(({ name, value }) => `${name}=${value}`)
      .join("; ");

    if (serializedCookies) {
      combinedHeaders.set("cookie", serializedCookies);
    }
  }

  return auth.api.getSession({ headers: combinedHeaders });
}