import type { Metadata } from "next";
import { ArabianDivider } from "@/components/ui/arabian-patterns";
import { Mail, MessageSquare, Clock } from "lucide-react";
import { Card, CardBody } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the Perfumare team. We'd love to hear from you — questions, feedback, partnerships, and more.",
};

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-12 py-8">
      <div className="text-center">
        <p className="section-title mb-2">Get in Touch</p>
        <h1 className="text-3xl md:text-4xl font-serif text-bark-500 text-glow">Contact Us</h1>
        <p className="text-bark-300 mt-4">
          We&apos;d love to hear from you
        </p>
      </div>

      <ArabianDivider />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardBody className="text-center space-y-3">
            <Mail size={28} className="text-gold-500 mx-auto" strokeWidth={1.5} />
            <h3 className="font-serif text-bark-500">Email</h3>
            <a href="mailto:hello@perfumare.com" className="text-sm text-gold-500 no-underline hover:text-gold-400">
              hello@perfumare.com
            </a>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center space-y-3">
            <MessageSquare size={28} className="text-gold-500 mx-auto" strokeWidth={1.5} />
            <h3 className="font-serif text-bark-500">Community</h3>
            <p className="text-sm text-bark-300">Join our forums to discuss fragrances</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center space-y-3">
            <Clock size={28} className="text-gold-500 mx-auto" strokeWidth={1.5} />
            <h3 className="font-serif text-bark-500">Response Time</h3>
            <p className="text-sm text-bark-300">We typically respond within 24-48 hours</p>
          </CardBody>
        </Card>
      </div>

      <section className="space-y-4">
        <h2 className="font-serif text-xl text-bark-500">Reach Out About</h2>
        <ul className="space-y-2 text-bark-300">
          <li className="flex gap-2"><span className="text-gold-500">-</span> <strong className="text-bark-400">General inquiries</strong> — Questions about Perfumare, our database, or features</li>
          <li className="flex gap-2"><span className="text-gold-500">-</span> <strong className="text-bark-400">Partnership opportunities</strong> — Brand collaborations, advertising, and sponsorships</li>
          <li className="flex gap-2"><span className="text-gold-500">-</span> <strong className="text-bark-400">Content contributions</strong> — Interested in writing for our magazine?</li>
          <li className="flex gap-2"><span className="text-gold-500">-</span> <strong className="text-bark-400">Bug reports</strong> — Found something broken? Let us know</li>
          <li className="flex gap-2"><span className="text-gold-500">-</span> <strong className="text-bark-400">Data corrections</strong> — Help us maintain accurate perfume data</li>
        </ul>
      </section>
    </div>
  );
}
