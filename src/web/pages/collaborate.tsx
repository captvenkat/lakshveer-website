import { useState } from "react";
import { SEO, PAGE_TITLES } from "@/components/seo";

interface LinkProps {
  href: string;
  children: React.ReactNode;
}

const InternalLink = ({ href, children }: LinkProps) => (
  <a href={href} className="link-internal">
    {children}
  </a>
);

const ExternalLink = ({ href, children }: LinkProps) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="link-external">
    {children}
  </a>
);

// What We Need items
const whatWeNeed = [
  "Hardware credits",
  "Manufacturing support",
  "Testing environments",
  "Cloud infrastructure",
  "Research mentorship",
  "Grant introductions",
];

// What We Offer items
const whatWeOffer = [
  "Live demonstrations",
  "Workshops",
  "Co-created pilots",
  "Product testing feedback",
  "Youth innovation representation",
];

// Category options for the form
const categoryOptions = [
  { value: "", label: "Select a category" },
  { value: "hardware-sponsorship", label: "Hardware Sponsorship" },
  { value: "cloud-credits", label: "Cloud Credits" },
  { value: "manufacturing-access", label: "Manufacturing Access" },
  { value: "research-collaboration", label: "Research Collaboration" },
  { value: "institutional-grant", label: "Institutional Grant" },
  { value: "media-feature", label: "Media Feature" },
  { value: "other", label: "Other" },
];

interface FormData {
  name: string;
  email: string;
  organisation: string;
  category: string;
  message: string;
}

function Collaborate() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    organisation: "",
    category: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // TODO: Integrate with Supabase for data persistence
    // TODO: Integrate with Resend for email notifications
    // Example Supabase integration:
    // const { data, error } = await supabase.from('inquiries').insert([formData]);
    // 
    // Example Resend integration:
    // await fetch('/api/send-email', {
    //   method: 'POST',
    //   body: JSON.stringify(formData),
    // });

    // Simulate submission delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const inputBaseClasses =
    "w-full px-4 py-3 bg-[var(--bg)] border border-[#27272a] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#22d3ee] transition-[border-color] duration-150";

  return (
    <div className="min-h-screen">
      <SEO title={PAGE_TITLES.collaborate} />
      <main className="container-main py-16 md:py-24">
        {/* Header */}
        <header className="mb-16 md:mb-20">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6">
            Collaborate
          </h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl leading-relaxed">
            We are building deployable hardware and AI systems and are open to serious collaboration.
          </p>
        </header>

        {/* Two Column Layout - What We Need / What We Offer */}
        <section className="mb-20 md:mb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
            {/* What We Need */}
            <div>
              <h2 className="text-2xl font-semibold mb-8">What We Need</h2>
              <ul className="space-y-4">
                {whatWeNeed.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="text-[var(--text-secondary)] select-none mt-0.5">-</span>
                    <span className="text-[var(--text-secondary)]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* What We Offer */}
            <div>
              <h2 className="text-2xl font-semibold mb-8">What We Offer</h2>
              <ul className="space-y-4">
                {whatWeOffer.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="text-[var(--text-secondary)] select-none mt-0.5">-</span>
                    <span className="text-[var(--text-secondary)]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="mb-20 md:mb-24">
          <h2 className="text-2xl font-semibold mb-10">Get in Touch</h2>

          {isSubmitted ? (
            <div className="p-8 bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
              <p className="text-lg text-[var(--text-primary)] mb-2">
                Thank you for your inquiry.
              </p>
              <p className="text-[var(--text-secondary)]">
                We will respond within 48 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm text-[var(--text-secondary)] mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className={inputBaseClasses}
                  placeholder="Your full name"
                />
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm text-[var(--text-secondary)] mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={inputBaseClasses}
                  placeholder="your@email.com"
                />
              </div>

              {/* Organisation Field */}
              <div>
                <label htmlFor="organisation" className="block text-sm text-[var(--text-secondary)] mb-2">
                  Organisation
                </label>
                <input
                  type="text"
                  id="organisation"
                  name="organisation"
                  required
                  value={formData.organisation}
                  onChange={handleChange}
                  className={inputBaseClasses}
                  placeholder="Your organisation name"
                />
              </div>

              {/* Category Dropdown */}
              <div>
                <label htmlFor="category" className="block text-sm text-[var(--text-secondary)] mb-2">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className={`${inputBaseClasses} appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2214%22%20height%3D%2214%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23a1a1aa%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_1rem_center]`}
                >
                  {categoryOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Message Textarea */}
              <div>
                <label htmlFor="message" className="block text-sm text-[var(--text-secondary)] mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className={`${inputBaseClasses} resize-none`}
                  placeholder="Tell us about your collaboration interest..."
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-[var(--text-primary)] text-[var(--bg)] font-medium hover:opacity-90 transition-opacity duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Sending..." : "Send Inquiry →"}
                </button>
              </div>
            </form>
          )}
        </section>

        {/* Back Link */}
        <div>
          <InternalLink href="/">Back to Home</InternalLink>
        </div>
      </main>

      {/* Footer */}
      <footer className="container-main pb-16">
        <div className="border-t border-[var(--border-subtle)] pt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Left column - Lakshveer info */}
            <div>
              <h3 className="text-xl font-semibold mb-2">Lakshveer Rao</h3>
              <p className="text-[var(--text-secondary)] mb-1">Co-Founder — Projects by Laksh</p>
              <p className="text-[var(--text-secondary)] text-sm">Based in Hyderabad, India (UTC+5:30)</p>
            </div>
            
            {/* Right column - Contact info */}
            <div className="md:text-right">
              <p className="text-sm text-[var(--text-secondary)] mb-4">Primary Contact:</p>
              <h4 className="text-lg font-semibold mb-1">Capt. Venkat</h4>
              <p className="text-sm text-[var(--text-secondary)] mb-1">First Backer, Investor & Operations Lead</p>
              <p className="text-sm text-[var(--text-secondary)] mb-4">Primary Point of Contact</p>
              <div className="flex flex-col md:items-end gap-2">
                <a 
                  href="mailto:contact@projectsbylaksh.com" 
                  className="text-sm text-[#22d3ee] hover:opacity-80 transition-opacity duration-150"
                >
                  contact@projectsbylaksh.com
                </a>
                <ExternalLink href="https://linkedin.com">LinkedIn</ExternalLink>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Collaborate;
