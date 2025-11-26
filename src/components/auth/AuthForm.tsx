"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { signIn, signUp } from "@/utils/auth-client";
import { Role, ROLE_LABELS, SIGNUP_ROLE_VALUES, ADMIN_SECRET_CODE } from "@/utils/rbac";

type Props = { mode: "login" | "signup" };

export default function AuthForm({ mode }: Props) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("USER");
  const [adminCode, setAdminCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setIsSubmitting(true);

    try {
      if (mode === "login") {
        const result = await signIn.email(
          { email, password },
          {
            onSuccess: () => {
              setMessage("Signed in successfully. Redirecting you now...");
              router.push("/");
              router.refresh();
            },
            onError: (ctx) => {
              const errorMessage =
                ctx.error.message ||
                (ctx.error.status === 401
                  ? "Invalid email or password. Please check your credentials and try again."
                  : "Unable to sign in. Please try again.");
              setError(errorMessage);
            },
          }
        );
        // If onSuccess/onError didn't fire (shouldn't happen), handle error
        if (result.error) {
          const errorMessage =
            result.error.message ||
            (result.error.status === 401
              ? "Invalid email or password. Please check your credentials and try again."
              : "Unable to sign in. Please try again.");
          setError(errorMessage);
        }
      } else {
        // Validate admin code if ADMIN role is selected
        if (role === "ADMIN" && adminCode !== ADMIN_SECRET_CODE) {
          setError("Invalid admin code. Please enter the correct code to create an admin account.");
          setIsSubmitting(false);
          return;
        }
        
        const derivedName = email.split("@")[0] || "User";
        const result = await signUp.email(
          { email, password, name: derivedName, role } as any,
          {
            onSuccess: () => {
              setMessage("Account created. Please sign in to continue.");
              router.push("/login");
              router.refresh();
            },
            onError: (ctx) => {
              const errorMessage = ctx.error.message || "Unable to create account. Please try again.";
              setError(errorMessage);
            },
          }
        );
        // Fallback if onError didn't fire
        if (result.error) {
          const errorMessage = result.error.message || "Unable to create account. Please try again.";
          setError(errorMessage);
        }
      }
    } catch (err) {
      const fallback = mode === "login" ? "Unable to sign in." : "Unable to create account.";
      setError(err instanceof Error ? err.message : fallback);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
      <div className="space-y-1">
        <label htmlFor="email" className="text-sm font-medium text-slate-300">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-3 text-base text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none"
          placeholder="you@example.com"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="password" className="text-sm font-medium text-slate-300">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          required
          minLength={8}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-3 text-base text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none"
          placeholder="••••••••"
        />
      </div>

      {mode === "signup" && (
        <>
          <div className="space-y-1">
            <label htmlFor="role" className="text-sm font-medium text-slate-300">
              Role
            </label>
            <select
              id="role"
              name="role"
              className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-3 text-base text-white focus:border-sky-500 focus:outline-none"
              value={role}
              onChange={(event) => setRole(event.target.value as Role)}
            >
              {SIGNUP_ROLE_VALUES.map((value) => (
                <option key={value} value={value} className="bg-slate-900 text-white">
                  {ROLE_LABELS[value]}
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-400">
              Choose how much access this account should have inside the todo board.
            </p>
          </div>

          {role === "ADMIN" && (
            <div className="space-y-1">
              <label htmlFor="adminCode" className="text-sm font-medium text-slate-300">
                Admin Code
              </label>
              <input
                id="adminCode"
                name="adminCode"
                type="text"
                required
                value={adminCode}
                onChange={(event) => setAdminCode(event.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-3 text-base text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none"
                placeholder="Enter admin secret code"
              />
              <p className="text-xs text-amber-400">
                ⚠️ Admin code required to create an admin account
              </p>
            </div>
          )}
        </>
      )}

      {error && (
        <p className="rounded-lg border border-red-500/60 bg-red-500/10 px-4 py-2 text-sm text-red-200">
          {error}
        </p>
      )}

      {message && (
        <p className="rounded-lg border border-emerald-500/60 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-200">
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-sky-500 px-4 py-3 text-center text-base font-semibold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}
      </button>
    </form>
  );
}