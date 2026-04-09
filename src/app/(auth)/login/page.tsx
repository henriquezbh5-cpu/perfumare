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

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-bark-300 hover:text-gold-500">
            &larr; Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
