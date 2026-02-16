import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
}

const DEFAULT_TITLE = "Lakshveer Rao | Hardware + AI Systems Builder";
const DEFAULT_DESCRIPTION = "Building deployable autonomous hardware and AI systems from India. Age 8. Co-Founder of Projects by Laksh.";

/**
 * SEO component for managing page-specific metadata
 * Updates document title and meta tags dynamically
 */
export function SEO({ title, description }: SEOProps) {
  const pageTitle = title ? `${title}` : DEFAULT_TITLE;
  const pageDescription = description || DEFAULT_DESCRIPTION;

  useEffect(() => {
    // Update document title
    document.title = pageTitle;

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", pageDescription);
    }

    // Update OG title
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute("content", pageTitle);
    }

    // Update OG description
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute("content", pageDescription);
    }

    // Update Twitter title
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) {
      twitterTitle.setAttribute("content", pageTitle);
    }

    // Update Twitter description
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) {
      twitterDescription.setAttribute("content", pageDescription);
    }

    // Cleanup: reset to default on unmount
    return () => {
      document.title = DEFAULT_TITLE;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute("content", DEFAULT_DESCRIPTION);
      }
    };
  }, [pageTitle, pageDescription]);

  return null;
}

// Page-specific title configurations
export const PAGE_TITLES = {
  home: "Lakshveer Rao | Hardware + AI Systems Builder",
  systems: "Systems | Lakshveer Rao",
  impact: "Impact | Lakshveer Rao",
  venture: "Projects by Laksh | Venture",
  collaborate: "Collaborate | Lakshveer Rao",
  admin: "Admin | Projects by Laksh",
  recognition: "Recognition | Lakshveer Rao",
} as const;
