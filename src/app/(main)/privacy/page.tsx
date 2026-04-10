import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Perfumare privacy policy — how we collect, use, and protect your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto py-8 space-y-8">
      <div>
        <p className="section-title mb-2">Legal</p>
        <h1 className="text-3xl font-serif text-bark-500 text-glow">Privacy Policy</h1>
        <p className="text-sm text-cream-500 mt-2">Last updated: April 2026</p>
      </div>

      <div className="space-y-6 text-bark-300 leading-relaxed">
        <section>
          <h2 className="font-serif text-lg text-bark-500 mb-3">1. Information We Collect</h2>
          <p>When you create an account, we collect your name, email address, and profile information provided through Google OAuth. When you interact with the site, we collect your reviews, ratings, wardrobe selections, and forum posts.</p>
        </section>

        <section>
          <h2 className="font-serif text-lg text-bark-500 mb-3">2. How We Use Your Information</h2>
          <p>We use your information to provide and improve our services, personalize your experience, display your reviews and contributions to the community, and communicate with you about your account.</p>
        </section>

        <section>
          <h2 className="font-serif text-lg text-bark-500 mb-3">3. Information Sharing</h2>
          <p>We do not sell your personal information. Your public profile, reviews, and forum posts are visible to other users. We may share anonymized, aggregated data for analytics purposes.</p>
        </section>

        <section>
          <h2 className="font-serif text-lg text-bark-500 mb-3">4. Affiliate Links</h2>
          <p>Perfumare contains affiliate links to third-party retailers such as Amazon. When you click these links and make a purchase, we may earn a commission at no additional cost to you. These links do not affect our editorial content or reviews.</p>
        </section>

        <section>
          <h2 className="font-serif text-lg text-bark-500 mb-3">5. Cookies</h2>
          <p>We use essential cookies for authentication and session management. We do not use tracking cookies for advertising purposes.</p>
        </section>

        <section>
          <h2 className="font-serif text-lg text-bark-500 mb-3">6. Data Security</h2>
          <p>We implement industry-standard security measures to protect your data. Passwords are hashed, and all data transmission is encrypted via HTTPS.</p>
        </section>

        <section>
          <h2 className="font-serif text-lg text-bark-500 mb-3">7. Your Rights</h2>
          <p>You may request to view, update, or delete your personal data at any time by contacting us at hello@perfumare.com. You can also delete your account through your profile settings.</p>
        </section>

        <section>
          <h2 className="font-serif text-lg text-bark-500 mb-3">8. Changes to This Policy</h2>
          <p>We may update this privacy policy from time to time. We will notify registered users of significant changes via email.</p>
        </section>

        <section>
          <h2 className="font-serif text-lg text-bark-500 mb-3">9. Contact</h2>
          <p>For privacy-related inquiries, please contact us at hello@perfumare.com.</p>
        </section>
      </div>
    </div>
  );
}
