import { navGroups } from "@/data/navigation";

const site = {
  name: "Aurlynn",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://aurlynn.com",
  // Placeholder: replace with the real support inbox.
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "support@aurlynn.com",
  // Sign-in lives in the existing product dashboard; set this once its URL is known.
  signInUrl: process.env.NEXT_PUBLIC_SIGN_IN_URL ?? "/contact",
  description:
    "Aurlynn is an AI voice agent platform for businesses that enables intelligent voice conversations and business workflow automation.",
};

export { site, navGroups };
