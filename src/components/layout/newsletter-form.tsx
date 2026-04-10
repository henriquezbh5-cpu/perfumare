"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <p className="text-sm text-emerald-400">
        You&apos;re in! We&apos;ll send you weekly fragrance picks.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex gap-2">
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-1 rounded-md bg-bark-400 border border-bark-300 px-3 py-2 text-sm text-cream-200 placeholder:text-cream-600 focus:outline-none focus:ring-1 focus:ring-gold-400"
          aria-label="Email address for newsletter"
        />
        <Button size="sm" className="shrink-0" disabled={status === "loading"}>
          {status === "loading" ? "..." : "Subscribe"}
        </Button>
      </div>
      {status === "error" && (
        <p className="text-[10px] text-red-400 mt-1.5">Something went wrong. Try again.</p>
      )}
      {status === "idle" && (
        <p className="text-[10px] text-cream-600 mt-1.5">No spam. Unsubscribe anytime.</p>
      )}
    </form>
  );
}
