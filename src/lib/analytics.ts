type AnalyticsEvent =
  | "template_downloaded"
  | "signup_started"
  | "project_created"
  | "pronunciation_added"
  | "pickup_added"
  | "invoice_created"
  | "checkout_started"
  | "subscription_created";

export function trackEvent(event: AnalyticsEvent, properties?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  // Stub: integrate with PostHog/Plausible when credentials are available
  if (process.env.NODE_ENV === "development") {
    console.log("[analytics]", event, properties);
  }
}
