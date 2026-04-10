import Link from "next/link";
import { Droplets } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <Droplets size={48} className="text-gold-500 mb-6" strokeWidth={1.2} />
      <h1 className="text-4xl font-serif text-bark-500 mb-3">Page Not Found</h1>
      <p className="text-bark-300 mb-8 max-w-md">
        The fragrance you&apos;re looking for seems to have evaporated.
        Let us help you find what you need.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/"
          className="no-underline inline-flex items-center justify-center gap-2 bg-gold-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-gold-600 transition-colors"
        >
          Go Home
        </Link>
        <Link
          href="/perfumes"
          className="no-underline inline-flex items-center justify-center gap-2 border border-gold-400/50 text-gold-400 px-6 py-3 rounded-lg font-medium hover:bg-cream-100/10 transition-colors"
        >
          Browse Perfumes
        </Link>
      </div>
    </div>
  );
}
