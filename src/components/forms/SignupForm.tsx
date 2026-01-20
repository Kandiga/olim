'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CONTENT, INTEREST_OPTIONS } from '@/lib/constants';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  interest: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  interest?: string;
}

export default function SignupForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    interest: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.interest) {
      newErrors.interest = 'Please select your primary interest';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Netlify form submission
      const formBody = new URLSearchParams({
        'form-name': 'signup',
        ...formData,
      });

      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formBody.toString(),
      });

      if (response.ok) {
        router.push('/thank-you');
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitError('Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-16 bg-canvas-bg">
      <motion.div
        className="w-full max-w-md glass-card rounded-2xl p-8 md:p-10"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <h2 className="font-serif text-3xl md:text-4xl text-warm-sand text-center mb-2">
          Begin Your Journey
        </h2>
        <p className="text-warm-sand/60 text-center mb-8">
          Take the first step towards your new home
        </p>

        {/* Hidden form for Netlify detection */}
        <form name="signup" data-netlify="true" netlify-honeypot="bot-field" hidden>
          <input type="text" name="firstName" />
          <input type="text" name="lastName" />
          <input type="email" name="email" />
          <select name="interest"></select>
        </form>

        <form onSubmit={handleSubmit} noValidate>
          {/* Honeypot field for spam protection */}
          <p className="hidden">
            <label>
              Don&apos;t fill this out: <input name="bot-field" />
            </label>
          </p>

          <div className="space-y-5">
            {/* First Name */}
            <div>
              <label htmlFor="firstName" className="form-label">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`form-input ${errors.firstName ? 'border-red-500' : ''}`}
                placeholder="Your first name"
                disabled={isSubmitting}
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-400">{errors.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="lastName" className="form-label">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`form-input ${errors.lastName ? 'border-red-500' : ''}`}
                placeholder="Your last name"
                disabled={isSubmitting}
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-400">{errors.lastName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-input ${errors.email ? 'border-red-500' : ''}`}
                placeholder="your@email.com"
                disabled={isSubmitting}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email}</p>
              )}
            </div>

            {/* Interest Dropdown */}
            <div>
              <label htmlFor="interest" className="form-label">
                Primary Interest
              </label>
              <select
                id="interest"
                name="interest"
                value={formData.interest}
                onChange={handleChange}
                className={`form-input ${errors.interest ? 'border-red-500' : ''}`}
                disabled={isSubmitting}
              >
                <option value="">Select your main interest</option>
                {INTEREST_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.interest && (
                <p className="mt-1 text-sm text-red-400">{errors.interest}</p>
              )}
            </div>
          </div>

          {/* Submit Error */}
          {submitError && (
            <p className="mt-4 text-center text-red-400">{submitError}</p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-8 btn-gold-outline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : CONTENT.ctaButton}
          </button>
        </form>
      </motion.div>
    </section>
  );
}
