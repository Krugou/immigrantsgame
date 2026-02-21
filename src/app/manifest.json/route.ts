import { NextResponse } from 'next/server';
import { colors } from '../../lib/colors';

export const GET = () =>
  // build the manifest using the canonical values from colors.ts
  NextResponse.json({
    name: 'The Immigrants',
    short_name: 'Immigrants',
    start_url: '/',
    display: 'standalone',
    background_color: colors.theme,
    theme_color: colors.theme,
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  });
