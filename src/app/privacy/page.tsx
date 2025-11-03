import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white py-16">
      <div className="max-w-5xl mx-auto px-6">
        <h1 className="text-4xl font-extrabold mb-4 text-gray-900">Privacy Policy</h1>
        <p className="text-gray-600 mb-8">Last updated: November 2, 2025 — Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.</p>

        <section className="prose prose-lg mb-8">
          <h2>1. Information we collect</h2>
          <p>We collect information you provide directly (such as account details and order information) and information collected automatically (such as usage data and cookies).</p>

          <h2>2. How we use your information</h2>
          <p>We use your information to process orders, communicate important updates, improve our services, and personalize your shopping experience. We do not sell your personal information to third parties.</p>

          <h2>3. Cookies and tracking</h2>
          <p>We use cookies and similar technologies to operate the website, analyze trends, and deliver relevant advertising. You can control cookie preferences through your browser.</p>

          <h2>4. Third-party services</h2>
          <p>We use third-party providers for payments, email delivery, analytics, and hosting. These providers have access only to the data necessary to perform their functions and are bound by contract to protect your information.</p>

          <h2>5. Data retention</h2>
          <p>We retain personal information only as long as necessary to provide the Service, comply with legal obligations, resolve disputes, and enforce our agreements.</p>

          <h2>6. Your rights</h2>
          <p>You may access, correct, or delete your personal information. Contact us for assistance using the contact details below.</p>

          <h2>7. Security</h2>
          <p>We implement reasonable measures to protect your data, but no system is completely secure. If you suspect a security breach, contact us immediately.</p>

          <h2>8. Changes to this policy</h2>
          <p>We may update this policy. When we do, we will update the effective date and provide notice when changes are material.</p>

          <h2>9. Contact</h2>
          <p>For privacy requests or questions, contact us at <a href="mailto:arnoldcharles028@gmail.com" className="text-indigo-600">arnoldcharles028@gmail.com</a> or visit our <Link href="/contact" className="text-indigo-600">Contact page</Link>.</p>
        </section>

        <div className="mt-8 border-t pt-6 text-sm text-gray-600">
          <p>Meg Store &copy; {new Date().getFullYear()}. All rights reserved.</p>
        </div>
      </div>
    </main>
  );
}
