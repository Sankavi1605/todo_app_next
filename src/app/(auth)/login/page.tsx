import Link from "next/link";
import AuthForm from "@/components/auth/AuthForm";
import AuthRedirect from "@/components/auth/AuthRedirect";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-900 text-white px-4">
      <AuthRedirect />
      <div className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-800/80 p-8 shadow-2xl">
        <div className="space-y-2 text-center">
          <p className="text-sm uppercase tracking-wide text-slate-400">Welcome back</p>
          <h1 className="text-3xl font-semibold">Sign in</h1>
          <p className="text-sm text-slate-400">
            Use the same email/password you created during signup.
          </p>
        </div>
        <AuthForm mode="login" />
        <p className="mt-6 text-center text-sm text-slate-400">
          Need an account? {" "}
          <Link href="/signup" className="text-sky-400 hover:text-sky-300">
            Create one here
          </Link>
        </p>
      </div>
    </main>
  );
}