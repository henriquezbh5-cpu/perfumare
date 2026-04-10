import type { Metadata } from "next";
import { ArabianDivider } from "@/components/ui/arabian-patterns";
import { Droplets, Users, BookOpen, Heart } from "lucide-react";
import { Card, CardBody } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "About",
  description: "Perfumare is the ultimate fragrance encyclopedia — discover, compare, and review thousands of perfumes from around the world.",
};

export default function AboutPage() {
  const values = [
    { icon: Droplets, title: "Comprehensive Database", desc: "Thousands of perfumes catalogued with detailed notes, accords, and performance data." },
    { icon: Users, title: "Community Driven", desc: "Real reviews and ratings from fragrance enthusiasts, not paid promotions." },
    { icon: BookOpen, title: "Expert Content", desc: "In-depth guides, articles, and editorial content to deepen your fragrance knowledge." },
    { icon: Heart, title: "Passion for Perfumery", desc: "Built by fragrance lovers who believe everyone deserves to find their signature scent." },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-12 py-8">
      <div className="text-center">
        <p className="section-title mb-2">About</p>
        <h1 className="text-3xl md:text-4xl font-serif text-bark-500 text-glow">Perfumare</h1>
        <p className="text-bark-300 mt-4 leading-relaxed">
          Where ancient traditions meet modern luxury
        </p>
      </div>

      <ArabianDivider />

      <section className="space-y-4">
        <h2 className="font-serif text-xl text-bark-500">Our Mission</h2>
        <p className="text-bark-300 leading-relaxed">
          Perfumare was born from a passion for Arabian perfumery and a desire to make the world of fragrances
          accessible to everyone. We believe that perfume is an art form — one that connects cultures,
          evokes memories, and expresses identity.
        </p>
        <p className="text-bark-300 leading-relaxed">
          Our platform brings together a comprehensive database of fragrances, honest community reviews,
          and expert editorial content. Whether you&apos;re a seasoned collector or just discovering your
          first signature scent, Perfumare is your guide.
        </p>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {values.map((v) => {
          const Icon = v.icon;
          return (
            <Card key={v.title}>
              <CardBody className="space-y-3">
                <Icon size={28} className="text-gold-500" strokeWidth={1.5} />
                <h3 className="font-serif text-bark-500">{v.title}</h3>
                <p className="text-sm text-bark-300">{v.desc}</p>
              </CardBody>
            </Card>
          );
        })}
      </div>

      <ArabianDivider />

      <section className="space-y-4">
        <h2 className="font-serif text-xl text-bark-500">What We Offer</h2>
        <ul className="space-y-2 text-bark-300">
          <li className="flex gap-2"><span className="text-gold-500">-</span> Detailed perfume profiles with notes pyramid, accords, and performance data</li>
          <li className="flex gap-2"><span className="text-gold-500">-</span> Community reviews and ratings from real fragrance enthusiasts</li>
          <li className="flex gap-2"><span className="text-gold-500">-</span> Fragrance finder quiz to match your preferences</li>
          <li className="flex gap-2"><span className="text-gold-500">-</span> Side-by-side perfume comparison tool</li>
          <li className="flex gap-2"><span className="text-gold-500">-</span> Expert magazine articles, guides, and fragrance education</li>
          <li className="flex gap-2"><span className="text-gold-500">-</span> Personal wardrobe management to track your collection</li>
        </ul>
      </section>
    </div>
  );
}
