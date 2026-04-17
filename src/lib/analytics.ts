type AnalyticsEvent = {
  name: string;
  timestamp: string;
  properties?: Record<string, string | number | boolean>;
};

const events: AnalyticsEvent[] = [];

export function trackEvent(
  name: string,
  properties?: Record<string, string | number | boolean>,
) {
  const event: AnalyticsEvent = {
    name,
    timestamp: new Date().toISOString(),
    properties,
  };
  events.push(event);
  console.info("[analytics]", event);
}

export function getTrackedEvents() {
  return [...events];
}
