import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Perfumare terms of use — rules and guidelines for using our fragrance encyclopedia platform.",
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto py-8 space-y-8">
      <div>
        <p className="section-title mb-2">Legal</p>
        <h1 className="text-3xl font-serif text-bark-500 text-glow">Terms of Use</h1>
        <p className="text-sm text-cream-500 mt-2">Last updated: April 2026</p>
      </div>

      <div className="space-y-6 text-bark-300 leading-relaxed">
        <section>
          <h2 className="font-serif text-lg text-bark-500 mb-3">1. Acceptance of Terms</h2>
          <p>By accessing and using Perfumare, you agree to these Terms of Use. If you do not agree, please do not use the platform.</p>
        </section>

        <section>
          <h2 className="font-serif text-lg text-bark-500 mb-3">2. User Accounts</h2>
          <p>You are responsible for maintaining the security of your account. You must provide accurate information when creating an account. You may not create accounts for the purpose of spamming, manipulation, or impersonation.</p>
        </section>

        <section>
          <h2 className="font-serif text-lg text-bark-500 mb-3">3. User Content</h2>
          <p>When you post reviews, forum posts, or other content, you retain ownership but grant Perfumare a non-exclusive license to display and distribute that content on our platform. All reviews must be honest and based on genuine experience with the fragrance.</p>
        </section>

        <section>
          <h2 className="font-serif text-lg text-bark-500 mb-3">4. Prohibited Conduct</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Posting fake or misleading reviews</li>
            <li>Harassment or abuse of other users</li>
            <li>Spam, commercial solicitation, or self-promotion</li>
            <li>Scraping or automated data collection</li>
            <li>Attempting to compromise platform security</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-lg text-bark-500 mb-3">5. Affiliate Disclosure</h2>
          <p>Perfumare participates in affiliate programs including Amazon Associates. Links to retailers may contain affiliate tracking codes. We earn commissions on qualifying purchases at no extra cost to you.</p>
        </section>

        <section>
          <h2 className="font-serif text-lg text-bark-500 mb-3">6. Disclaimer</h2>
          <p>Perfume descriptions, notes, and performance data are provided for informational purposes. Fragrance perception is subjective and may vary between individuals. We do not guarantee the accuracy of user-submitted data.</p>
        </section>

        <section>
          <h2 className="font-serif text-lg text-bark-500 mb-3">7. Intellectual Property</h2>
          <p>Perfume names, brand names, and associated trademarks belong to their respective owners. Perfumare does not claim ownership of any fragrance brands or products listed on the platform.</p>
        </section>

        <section>
          <h2 className="font-serif text-lg text-bark-500 mb-3">8. Termination</h2>
          <p>We reserve the right to suspend or terminate accounts that violate these terms. Users may delete their accounts at any time through profile settings.</p>
        </section>

        <section>
          <h2 className="font-serif text-lg text-bark-500 mb-3">9. Contact</h2>
          <p>For questions about these terms, contact us at hello@perfumare.com.</p>
        </section>
      </div>
    </div>
  );
}
