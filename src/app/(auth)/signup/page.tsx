import Link from "next/link";
import AuthForm from "@/components/auth/AuthForm";
import AuthRedirect from "@/components/auth/AuthRedirect";

export default function SignupPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-900 text-white px-4">
      <AuthRedirect />
      <div className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-800/80 p-8 shadow-2xl">
        <div className="space-y-2 text-center">
          <p className="text-sm uppercase tracking-wide text-slate-400">Start planning</p>
          <h1 className="text-3xl font-semibold">Create account</h1>
          <p className="text-sm text-slate-400">
            Sign up with your email and we will redirect you to sign in.
          </p>
        </div>
        <AuthForm mode="signup" />
        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account? {" "}
          <Link href="/login" className="text-sky-400 hover:text-sky-300">
            Sign in here
          </Link>
        </p>
      </div>
    </main>
  );
}