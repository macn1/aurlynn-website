// Source: brand document, homepage "Integrations". No specific platforms are confirmed yet:
// add a platform to `confirmedPlatforms` only once it is actually live.
export const confirmedPlatforms = [
  // { name: "Example CRM", category: "crm", note: "What the integration does" },
];

export const integrationCategories = [
  { id: "crm", name: "CRM", text: "Update records and opportunities from conversation outcomes.", flow: "Qualified → create or update opportunity" },
  { id: "calendars", name: "Calendars", text: "Check availability and book meetings, visits and appointments.", flow: "Slot chosen → booking confirmed" },
  { id: "contact-centers", name: "Contact centers", text: "Hand conversations to live agents, with context.", flow: "Needs a person → transfer with summary" },
  { id: "marketing", name: "Marketing automation", text: "Respond to campaign leads and feed outcomes back into journeys.", flow: "Campaign lead → call → status update" },
  { id: "support", name: "Customer support", text: "Create or update tickets from support conversations.", flow: "Issue captured → ticket created" },
  { id: "erp", name: "ERP", text: "Look up or update operational data where connected.", flow: "Order number → status returned" },
  { id: "communication", name: "Communication platforms", text: "Send confirmations and notify teams after a call.", flow: "Booking made → confirmation sent" },
  { id: "databases", name: "Databases", text: "Read approved data to personalise, and store captured information.", flow: "Caller identified → context loaded" },
  { id: "apis", name: "APIs", text: "Connect systems that expose an API.", flow: "Outcome → API call" },
  { id: "webhooks", name: "Webhooks", text: "Push conversation events to your own systems as they happen.", flow: "Event → your endpoint" },
];

export const integrationById = Object.fromEntries(integrationCategories.map((c) => [c.id, c]));
// Aliases used by use-case data.
integrationById["analytics"] = { id: "analytics", name: "Analytics", text: "Outcome data for review and reporting." };
