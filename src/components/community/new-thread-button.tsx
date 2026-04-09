"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthGuard } from "@/components/auth/auth-guard";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface NewThreadButtonProps {
  categoryId: string;
}

export function NewThreadButton({ categoryId }: NewThreadButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !body.trim()) {
      setError("Title and body are required");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/forums", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryId, title: title.trim(), body: body.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Failed to create thread");
        setLoading(false);
        return;
      }

      setIsOpen(false);
      setTitle("");
      setBody("");
      router.refresh();
    } catch {
      setError("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <AuthGuard>
      <>
        <Button size="md" className="gap-1.5" onClick={() => setIsOpen(true)}>
          <Plus size={16} />
          New Thread
        </Button>

        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Start a New Thread" maxWidth="lg">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What do you want to discuss?"
              required
            />

            <Textarea
              label="Your message"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Share your thoughts..."
              charCount={{ current: body.length, max: 5000 }}
              required
            />

            {error && <p className="text-sm text-red-400">{error}</p>}

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Thread"}
              </Button>
            </div>
          </form>
        </Modal>
      </>
    </AuthGuard>
  );
}
