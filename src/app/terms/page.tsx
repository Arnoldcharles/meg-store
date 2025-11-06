import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white py-16">
      <div className="max-w-5xl mx-auto px-6">
        <h1 className="text-4xl font-extrabold mb-4 text-gray-900">
          Terms & Conditions
        </h1>
        <p className="text-gray-600 mb-8">
          Last updated: November 6, 2025 — Please read these terms and
          conditions carefully before using the Meg Store website.
        </p>

        {/* Linked table of contents for quick navigation */}
        <nav className="mb-6 bg-gray-50 p-4 rounded-lg border">
          <strong className="block mb-2">On this page</strong>
          <ul className="grid grid-cols-2 gap-2 text-sm">
            <li>
              <a
                href="#introduction"
                className="text-indigo-600 hover:underline"
              >
                1. Introduction
              </a>
            </li>
            <li>
              <a
                href="#using-website"
                className="text-indigo-600 hover:underline"
              >
                2. Using our website
              </a>
            </li>
            <li>
              <a
                href="#products-pricing"
                className="text-indigo-600 hover:underline"
              >
                3. Products & Orders
              </a>
            </li>
            <li>
              <a href="#payment" className="text-indigo-600 hover:underline">
                4. Payment
              </a>
            </li>
            <li>
              <a
                href="#shipping-delivery"
                className="text-indigo-600 hover:underline"
              >
                5. Shipping
              </a>
            </li>
            <li>
              <a
                href="#returns-refunds"
                className="text-indigo-600 hover:underline"
              >
                6. Returns
              </a>
            </li>
            <li>
              <a
                href="#intellectual-property"
                className="text-indigo-600 hover:underline"
              >
                7. IP
              </a>
            </li>
            <li>
              <a
                href="#user-accounts"
                className="text-indigo-600 hover:underline"
              >
                8. Accounts
              </a>
            </li>
            <li>
              <a href="#liability" className="text-indigo-600 hover:underline">
                9. Liability
              </a>
            </li>
            <li>
              <a
                href="#governing-law"
                className="text-indigo-600 hover:underline"
              >
                10. Governing law
              </a>
            </li>
            <li>
              <a
                href="#changes-to-terms"
                className="text-indigo-600 hover:underline"
              >
                11. Changes
              </a>
            </li>
            <li>
              <a href="#contact-us" className="text-indigo-600 hover:underline">
                12. Contact
              </a>
            </li>
          </ul>
        </nav>

        <section className="prose prose-lg mb-8">
          <h2 id="introduction">1. Introduction</h2>
          <p>
            These Terms & Conditions (&ldquo;Terms&rdquo;) govern your access to
            and use of the Meg Store website and services (the
            &ldquo;Service&rdquo;) provided by Meg Store. By accessing or using
            the Service you agree to be bound by these Terms. If you do not
            agree with any part of the Terms, you must not use the Service.
          </p>

          <h2 id="using-website">2. Using our website</h2>
          <p>
            You must be at least 18 years old or have legal parental/guardian
            permission to use this site. You agree not to misuse the Service.
            Prohibited actions include, without limitation, attempting to
            reverse-engineer, hack, or otherwise interfere with the operation of
            the Service.
          </p>

          <h2 id="products-pricing">3. Products, pricing & orders</h2>
          <p>
            Product descriptions and pricing are provided for informational
            purposes and we strive for accuracy. We reserve the right to correct
            pricing or typographical errors, and to refuse or cancel orders if
            information provided is inaccurate or fraudulent.
          </p>

          <h2 id="payment">4. Payment</h2>
          <p>
            Payments are processed by our third-party payment providers. By
            placing an order you authorize the use of the payment method you
            provide. Taxes, duties, and additional shipping fees may apply
            depending on your location and will be displayed at checkout.
          </p>

          <h2 id="shipping-delivery">5. Shipping & delivery</h2>
          <p>
            Shipping times are estimates and depend on carrier availability and
            your shipping address. Meg Store is not responsible for carrier
            delays. Please review our shipping policy for details on carriers,
            tracking, and shipping options.
          </p>

          <h2 id="returns-refunds">6. Returns & refunds</h2>
          <p>
            We offer a 30-day return window from the date of delivery for most
            items. Returned products must be in original condition. Refunds are
            processed to the original payment method and may take several
            business days to appear on your statement.
          </p>

          <h2 id="intellectual-property">7. Intellectual property</h2>
          <p>
            All content on the Service (including text, images, logos, and
            designs) is the property of Meg Store or its licensors and is
            protected by copyright, trademark, and other intellectual property
            laws. You may not reuse or redistribute content without prior
            written permission.
          </p>

          <h2 id="user-accounts">8. User accounts</h2>
          <p>
            When you create an account you are responsible for maintaining the
            confidentiality of your account credentials and for any activity
            that occurs under your account. Notify us immediately if you suspect
            unauthorized use.
          </p>

          <h2 id="liability">9. Limitation of liability</h2>
          <p>
            To the fullest extent permitted by law, Meg Store and its affiliates
            are not liable for indirect, incidental, special, punitive, or
            consequential damages arising from your use of the Service. Our
            aggregate liability for direct damages is limited to the purchase
            price of the product that gave rise to the claim.
          </p>

          <h2 id="governing-law">10. Governing law</h2>
          <p>
            These Terms are governed by and construed in accordance with the
            laws of the country where Meg Store operates, without regard to
            conflict of law principles. Any disputes will be resolved in the
            courts of that jurisdiction unless otherwise agreed in writing.
          </p>

          <h2 id="changes-to-terms">11. Changes to these terms</h2>
          <p>
            We may update these Terms occasionally. If we make material changes
            we will provide prominent notice (for example by email or a banner
            on the site) before the change becomes effective. Your continued use
            of the Service after the effective date constitutes acceptance of
            the updated Terms.
          </p>

          <h2 id="contact-us">12. Contact us</h2>
          <p>
            If you have questions about these Terms, please contact our support
            team at{" "}
            <a
              href="mailto:arnoldcharles028@gmail.com"
              className="text-indigo-600"
            >
              arnoldcharles028@gmail.com
            </a>
            or visit our{" "}
            <Link href="/contact" className="text-indigo-600">
              Contact page
            </Link>
            .
          </p>
        </section>

        <div className="mt-8 border-t pt-6 text-sm text-gray-600">
          <p>
            Meg Store &copy; {new Date().getFullYear()}. All rights reserved.
          </p>
        </div>
      </div>
    </main>
  );
}
