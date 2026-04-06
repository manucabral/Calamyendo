import type { Metadata } from 'next';
import { Bebas_Neue, IBM_Plex_Sans } from 'next/font/google';
import './globals.css';

const bebasNeue = Bebas_Neue({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['400'],
});

const ibmPlexSans = IBM_Plex_Sans({
  variable: '--font-body',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Calamyendo Wiki Planner',
  description:
    'Estructura y progresion de Terraria + Calamity basada en las wikis oficiales, con enfoque por bosses y class setups.',
  keywords: [
    'Terraria',
    'Calamity Mod',
    'Wiki',
    'Bosses',
    'Class Setups',
    'Progresión',
    'Guide',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#020617" />
      </head>
      <body
        className={`${bebasNeue.variable} ${ibmPlexSans.variable} min-h-screen antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
