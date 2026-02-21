import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import '../i18n';
import { colors } from '../lib/colors';
import { AuthProvider } from '../context/AuthContext';
import { GameProvider } from '../context/GameContext';
import PWARegister from '../components/PWARegister';
import DisableConsole from '../components/DisableConsole';
import Analytics from '../components/Analytics';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'The Immigrants - Space Colonization',
  description:
    'An advanced event-driven incremental game about population movement and territory expansion.',
  // keep the string value in sync with the variable defined in `colors.ts`
  themeColor: colors.theme,
  manifest: '/manifest.json',
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  return (
    <html lang="en">
      <head>
        {gaId && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId}');
`,
              }}
            />
          </>
        )}
      </head>
      <body
        className={`${inter.className} min-h-screen bg-cinematic-bg text-slate-100 overflow-x-hidden pt-8`}
      >
        <AuthProvider>
          <GameProvider>
            <DisableConsole />
            <Analytics />
            {children}
            <PWARegister />
          </GameProvider>
        </AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
