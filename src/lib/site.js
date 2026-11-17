const site = {
  name: "Aurlynn",
  url: import.meta.env.VITE_SITE_URL ?? "https://aurlynn.com",
  // Sign-in lives in the existing product dashboard; set this once its URL is known.
  // Placeholder: replace with the real support inbox.
  supportEmail: import.meta.env.VITE_SUPPORT_EMAIL ?? "support@aurlynn.com",
  signInUrl: import.meta.env.VITE_SIGN_IN_URL ?? "/contact"
};
const navGroups = [
  {
    label: "Platform",
    items: [
      { label: "Platform overview", href: "/platform", description: "The voice agent platform" },
      { label: "How it works", href: "/how-it-works", description: "From call to completed action" },
      { label: "Integrations", href: "/integrations", description: "Connect your existing tools" },
      { label: "Security", href: "/security", description: "How conversations stay protected" }
    ]
  },
  {
    label: "Solutions",
    items: [
      { label: "B2B", href: "/solutions/b2b", description: "Sales, support and operations" },
      { label: "B2C", href: "/solutions/b2c", description: "Customer-facing conversations" },
      { label: "Use cases", href: "/use-cases", description: "What teams automate first" }
    ]
  },
  {
    label: "Industries",
    items: [
      { label: "Automotive", href: "/industries/automotive" },
      { label: "Real Estate", href: "/industries/real-estate" },
      { label: "Healthcare", href: "/industries/healthcare" },
      { label: "Education", href: "/industries/education" }
    ]
  },
  {
    label: "Resources",
    items: [{ label: "Resources", href: "/resources", description: "Guides and product notes" }]
  },
  {
    label: "Company",
    items: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" }
    ]
  }
];
export {
  navGroups,
  site
};
