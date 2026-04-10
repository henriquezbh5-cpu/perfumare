import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Affiliate Disclosure",
  description: "Perfumare affiliate disclosure — how we earn commissions through product recommendations.",
};

export default function AffiliateDisclosurePage() {
  return (
    <div className="max-w-3xl mx-auto py-8 space-y-8">
      <div>
        <p className="section-title mb-2">Transparency</p>
        <h1 className="text-3xl font-serif text-bark-500 text-glow">Affiliate Disclosure</h1>
        <p className="text-sm text-cream-500 mt-2">Last updated: April 2026</p>
      </div>

      <div className="space-y-6 text-bark-300 leading-relaxed">
        <section className="rounded-xl border border-gold-500/20 bg-gold-500/5 p-6">
          <p className="text-bark-400 font-medium mb-2">Amazon Associates Disclosure</p>
          <p>
            Perfumare is a participant in the Amazon Services LLC Associates Program, an affiliate
            advertising program designed to provide a means for sites to earn advertising fees by
            advertising and linking to Amazon.com.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-lg text-bark-500 mb-3">How It Works</h2>
          <p>
            When you click on a product link on Perfumare and make a purchase on Amazon, we may earn
            a small commission at no additional cost to you. This commission helps us maintain and
            improve the platform, add new perfumes to our database, and create quality content.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-lg text-bark-500 mb-3">Our Commitment</h2>
          <ul className="space-y-2">
            <li className="flex gap-2"><span className="text-gold-500">-</span> <strong className="text-bark-400">Honest reviews:</strong> Our community reviews are written by real users. Affiliate relationships never influence ratings or reviews.</li>
            <li className="flex gap-2"><span className="text-gold-500">-</span> <strong className="text-bark-400">No pay-for-placement:</strong> Perfume rankings and recommendations are based on community data, not advertising payments.</li>
            <li className="flex gap-2"><span className="text-gold-500">-</span> <strong className="text-bark-400">Best price for you:</strong> We link to products at their standard retail price. You never pay more by clicking our links.</li>
            <li className="flex gap-2"><span className="text-gold-500">-</span> <strong className="text-bark-400">Transparency:</strong> All affiliate links are clearly identified with the retailer name and an external link icon.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-lg text-bark-500 mb-3">What Products We Link To</h2>
          <p>
            We provide links to perfumes, colognes, and fragrance-related products available on Amazon.
            We only link to products that are relevant to the perfumes in our database. We do not
            create fake product pages or recommend products we haven&apos;t verified exist on the retailer&apos;s
            platform.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-lg text-bark-500 mb-3">FTC Compliance</h2>
          <p>
            In accordance with FTC guidelines, we disclose that some links on this website are
            affiliate links. This means we receive a commission if you make a purchase through
            these links, at no extra cost to you. This disclosure applies to all pages on
            perfumare that contain affiliate links.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-lg text-bark-500 mb-3">Questions?</h2>
          <p>
            If you have questions about our affiliate relationships, please contact us at
            hello@perfumare.com.
          </p>
        </section>
      </div>
    </div>
  );
}
