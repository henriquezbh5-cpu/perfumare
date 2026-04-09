"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SignInButtonsProps {
  callbackUrl?: string;
}

export function SignInButtons({ callbackUrl = "/" }: SignInButtonsProps) {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGoogle = () => {
    signIn("google", { callbackUrl });
  };

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await signIn("email", { email, callbackUrl, redirect: false });
    setEmailSent(true);
    setLoading(false);
  };

  if (emailSent) {
    return (
      <div className="text-center py-4">
        <div className="text-2xl mb-2">&#9993;</div>
        <h4 className="font-serif text-bark-500 mb-1">Check your email</h4>
        <p className="text-sm text-bark-300">
          We sent a magic link to <strong>{email}</strong>
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Button
        variant="outline"
        size="lg"
        onClick={handleGoogle}
        className="w-full gap-2"
      >
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Continue with Google
      </Button>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-cream-300" />
        <span className="text-xs text-cream-600 uppercase tracking-wider">or</span>
        <div className="flex-1 h-px bg-cream-300" />
      </div>

      <form onSubmit={handleEmail} className="flex flex-col gap-3">
        <Input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? "Sending..." : "Send magic link"}
        </Button>
      </form>
    </div>
  );
}
