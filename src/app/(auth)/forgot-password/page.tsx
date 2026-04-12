"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    await signIn("email", { email, redirect: false, callbackUrl: "/" });
    setSent(true);
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="glass-card p-8 w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-serif text-bark-500 text-glow">
            Reset Access
          </h1>
          <p className="text-sm text-bark-200 mt-2">
            Enter your email and we&apos;ll send you a magic link to sign in
            instantly. No password needed.
          </p>
        </div>

        {sent ? (
          <div className="text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
              <span className="text-green-400 text-xl">&#10003;</span>
            </div>
            <p className="text-sm text-bark-300">
              Check your email for the magic link! It should arrive within a few
              minutes.
            </p>
            <Link
              href="/login"
              className="text-sm text-gold-500 hover:text-gold-400 no-underline"
            >
              Back to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-cream-600 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                className="w-full px-3 py-2 rounded-lg bg-cream-100/20 border border-cream-300/20 text-bark-400 text-sm focus:outline-none focus:border-gold-500/50 placeholder:text-cream-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-gold-500 text-cream-50 text-sm font-medium hover:bg-gold-600 transition-colors disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Magic Link"}
            </button>
          </form>
        )}

        <div className="text-center">
          <Link
            href="/login"
            className="text-xs text-cream-500 hover:text-gold-500 no-underline"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
