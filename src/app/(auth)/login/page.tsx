import Link from "next/link";
import { SignInButtons } from "@/components/auth/sign-in-buttons";

export default function LoginPage() {
  return (
    <div className="w-full max-w-sm">
      <div className="glass-card p-8">
        <div className="text-center mb-6">
          <h1 className="font-serif text-2xl text-bark-500 mb-1">Welcome Back</h1>
          <p className="text-sm text-bark-300">Sign in to 1000PerfumesNight</p>
        </div>

        <SignInButtons />

        <div className="mt-6 text-center space-y-2">
          <Link
            href="/forgot-password"
            className="block text-sm text-cream-500 hover:text-gold-500 no-underline"
          >
            Forgot your password?
          </Link>
          <Link href="/" className="block text-sm text-bark-300 hover:text-gold-500 no-underline">
            &larr; Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
