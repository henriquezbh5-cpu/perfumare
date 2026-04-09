"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Rating } from "@/components/ui/rating";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface UserReview {
  id: string;
  title: string;
  body: string;
  rating: number;
  createdAt: string;
  perfume: { slug: string; name: string };
}

export function ReviewsTab() {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = () => {
    if (!session?.user?.id) return;
    setLoading(true);
    fetch(`/api/reviews?userId=${session.user.id}`)
      .then((r) => r.json())
      .then((data) => setReviews(data.reviews ?? []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.id]);

  const handleDelete = async (reviewId: string) => {
    if (!confirm("Delete this review? This action cannot be undone.")) return;

    await fetch(`/api/reviews/${reviewId}`, { method: "DELETE" });
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
  };

  if (loading) {
    return <div className="text-center py-12 text-bark-200">Loading reviews...</div>;
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-bark-200 mb-2">You haven&apos;t written any reviews yet.</p>
        <Link href="/perfumes" className="text-sm text-gold-500 hover:text-gold-600">
          Explore perfumes to review &rarr;
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="bg-cream-200/30 backdrop-blur-sm border border-cream-300/20 rounded-lg p-5"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <Link
                href={`/perfumes/${review.perfume.slug}`}
                className="text-sm text-gold-500 hover:text-gold-600 font-medium"
              >
                {review.perfume.name}
              </Link>
              <div className="flex items-center gap-2 mt-1">
                <Rating value={review.rating} size="sm" />
                <span className="text-xs text-cream-600">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h4 className="font-medium text-bark-500 mt-2">{review.title}</h4>
              <p className="text-sm text-bark-300 mt-1 line-clamp-3">{review.body}</p>
            </div>
            <div className="flex gap-1 shrink-0">
              <Link href={`/perfumes/${review.perfume.slug}`}>
                <Button variant="ghost" size="sm" className="p-2">
                  <Pencil size={14} />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50"
                onClick={() => handleDelete(review.id)}
              >
                <Trash2 size={14} />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
