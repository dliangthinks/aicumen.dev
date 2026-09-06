import type { Metadata } from 'next';
import { Geist, Geist_Mono, Instrument_Serif } from 'next/font/google';
import './globals.css';
import { SiteMotion } from './interactions';
const sans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const mono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });
const serif = Instrument_Serif({
  variable: '--font-editorial',
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
});
export const metadata: Metadata = {
  title: {
    default: 'Aicumen — Develop your AI expertise',
    template: '%s · Aicumen',
  },
  description:
    'Tools and frameworks for developing AI expertise. Discover Composer, an agent-driven course authoring engine, and Assessor, an adaptive AI competency assessment.',
  icons: { icon: '/favicon.svg' },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${sans.variable} ${mono.variable} ${serif.variable}`}>
        {children}
        <SiteMotion />
      </body>
    </html>
  );
}
