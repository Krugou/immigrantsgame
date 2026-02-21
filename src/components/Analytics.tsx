'use client';
import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { gaEvent } from '../lib/analytics';

const Analytics: React.FC = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_GA_ID) {
      return;
    }
    const page_path = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    gaEvent('page_view', { page_path });
  }, [pathname, searchParams]);

  return null;
};

export default Analytics;
