"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { AuthGuard } from "@/components/auth/auth-guard";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface ReplyFormProps {
  threadId: string;
}

export function ReplyForm({ threadId }: ReplyFormProps) {
  const { data: session } = useSession();
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!body.trim()) {
      setError("Reply cannot be empty");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/forums/${threadId}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: body.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Failed to post reply");
        setLoading(false);
        return;
      }

      setBody("");
      router.refresh();
    } catch {
      setError("Something went wrong");
    }

    setLoading(false);
  };

  if (!session?.user) {
    return (
      <AuthGuard>
        <div className="glass-card p-6 text-center">
          <p className="text-bark-300">Sign in to reply to this thread</p>
        </div>
      </AuthGuard>
    );
  }

  return (
    <div className="glass-card p-5">
      <h3 className="font-serif text-bark-400 mb-3">Post a Reply</h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <Textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Share your thoughts..."
          charCount={{ current: body.length, max: 5000 }}
        />

        {error && <p className="text-sm text-red-400">{error}</p>}

        <div className="flex justify-end">
          <Button type="submit" disabled={loading} className="gap-1.5">
            <Send size={14} />
            {loading ? "Posting..." : "Post Reply"}
          </Button>
        </div>
      </form>
    </div>
  );
}
