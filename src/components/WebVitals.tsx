'use client';

import { useReportWebVitals } from 'next/web-vitals';
import { gaEvent } from '../lib/analytics';

export function WebVitals() {
  useReportWebVitals((metric) => {
    // Send to Google Analytics if configured
    if (process.env.NEXT_PUBLIC_GA_ID) {
      gaEvent('web_vitals', {
        name: metric.name,
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        eventLabel: metric.id,
        nonInteraction: true,
      });
    } else {
      // In development, you might just want to console.log
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.debug(`[Web Vitals] ${metric.name}:`, metric.value);
      }
    }
  });

  return null;
}
