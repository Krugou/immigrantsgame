// shared analytics helpers for both client and server

/**
 * Client-side GA helper.
 * Make sure `gtag` script is loaded (added in layout) and
 * `NEXT_PUBLIC_GA_ID` is set in env.
 */
// Augment the Window interface so we don't need `any` casts
declare global {
  interface Window {
    gtag?: (event: string, action: string, params?: Record<string, unknown>) => void;
  }
}

export const gaEvent = (action: string, params: Record<string, unknown> = {}): void => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, params);
  }
};

/**
 * Server-side GA measurement protocol. This lets backend code fire events.
 * Requires environment variable `GA_MEASUREMENT_ID` and `GA_API_SECRET`.
 * Example:
 *   await serverGaEvent('purchase', { value: 9.99, currency: 'USD' });
 */

export const serverGaEvent = async (
  clientId: string,
  eventName: string,
  params: Record<string, unknown> = {},
): Promise<void> => {
  const measurementId = process.env.GA_MEASUREMENT_ID;
  const apiSecret = process.env.GA_API_SECRET;
  if (!measurementId || !apiSecret) {
    return;
  }

  const url = `https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`;
  const body = {
    client_id: clientId,
    events: [{ name: eventName, params }],
  };
  try {
    await fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    // swallow errors for now
    console.error('GA event failed', e);
  }
};
