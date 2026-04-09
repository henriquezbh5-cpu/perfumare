"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  perfumeId: string;
  perfumeName: string;
  existingReview?: {
    id: string;
    title: string;
    body: string;
    rating: number;
  } | null;
  onSuccess: () => void;
}

export function ReviewModal({
  isOpen,
  onClose,
  perfumeId,
  perfumeName,
  existingReview,
  onSuccess,
}: ReviewModalProps) {
  const [title, setTitle] = useState(existingReview?.title ?? "");
  const [body, setBody] = useState(existingReview?.body ?? "");
  const [rating, setRating] = useState(existingReview?.rating ?? 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isEdit = !!existingReview;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!rating) {
      setError("Please select a rating");
      return;
    }
    if (body.length < 20) {
      setError("Review must be at least 20 characters");
      return;
    }

    setLoading(true);

    try {
      const url = isEdit ? `/api/reviews/${existingReview.id}` : "/api/reviews";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ perfumeId, title, body, rating }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Something went wrong");
        setLoading(false);
        return;
      }

      onSuccess();
      onClose();
    } catch {
      setError("Failed to submit review");
    }

    setLoading(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? "Edit Review" : "Write a Review"} maxWidth="lg">
      <p className="text-sm text-bark-300 mb-4">
        {isEdit ? "Update your review for" : "Share your thoughts on"}{" "}
        <strong className="text-bark-500">{perfumeName}</strong>
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Star Rating */}
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-bark-400">Rating</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className="p-0.5"
              >
                <Star
                  size={28}
                  className={cn(
                    "transition-colors",
                    (hoverRating || rating) >= star
                      ? "text-gold-400 fill-gold-400"
                      : "text-cream-400"
                  )}
                />
              </button>
            ))}
            {rating > 0 && (
              <span className="ml-2 text-sm text-bark-300 self-center">
                {rating}/5
              </span>
            )}
          </div>
        </div>

        <Input
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Sum up your experience..."
          maxLength={100}
          required
        />

        <Textarea
          label="Review"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="What makes this fragrance special? How does it perform? When would you wear it?"
          charCount={{ current: body.length, max: 2000 }}
          required
        />

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Submitting..." : isEdit ? "Update Review" : "Submit Review"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
