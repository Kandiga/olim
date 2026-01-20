import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen px-4 py-16 preloader-gradient">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-serif text-4xl md:text-5xl text-midnight-blue mb-8">
          Privacy Policy
        </h1>

        <div className="prose max-w-none space-y-6 text-midnight-blue/80">
          <p>
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>

          <h2 className="text-2xl font-serif text-midnight-blue mt-8 mb-4">Information We Collect</h2>
          <p>
            When you sign up through our form, we collect your first name, last name,
            email address, and area of interest. This information helps us provide you
            with relevant information about our Aliyah program.
          </p>

          <h2 className="text-2xl font-serif text-midnight-blue mt-8 mb-4">How We Use Your Information</h2>
          <p>
            We use the information you provide to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Send you information about our guided Aliyah program</li>
            <li>Connect you with relevant resources and community members</li>
            <li>Improve our services based on your interests</li>
          </ul>

          <h2 className="text-2xl font-serif text-midnight-blue mt-8 mb-4">Cookies</h2>
          <p>
            We use cookies to enhance your browsing experience and remember your preferences.
            You can choose to accept or reject cookies through our cookie consent banner.
          </p>

          <h2 className="text-2xl font-serif text-midnight-blue mt-8 mb-4">Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us.
          </p>

          <div className="mt-12 pt-8 border-t border-midnight-blue/20">
            <Link
              href="/"
              className="border-2 border-soft-gold text-midnight-blue bg-soft-gold/10 hover:bg-soft-gold/20 px-8 py-4 font-serif text-lg tracking-wide transition-all duration-300 inline-block"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
