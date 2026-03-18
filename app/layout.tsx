import type { Metadata } from 'next';
import { Roboto, Open_Sans } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { LayoutWrapper } from '@/components/layout-wrapper';
import { LocalBusinessSchema, FAQSchema } from '@/components/structured-data';

const roboto = Roboto({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-roboto',
  display: 'swap',
});

const openSans = Open_Sans({
  weight: ['400', '600'],
  subsets: ['latin'],
  variable: '--font-open-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  title: {
    default: 'IQES Low Voltage Solutions | Expert Electrical Services Florida',
    template: '%s | IQES Low Voltage Florida',
  },
  description: 'Professional low voltage electrical installation across Florida. Expert fiber optic, CCTV, structured cabling, access control & networking services in Jacksonville, Orlando, Tampa, Miami. Free estimates! Call 386-603-9541.',
  keywords: [
    'low voltage Florida',
    'low voltage contractor Florida',
    'fiber optic installation Florida',
    'fiber optic splicing Florida',
    'CCTV installation Miami',
    'CCTV installation Jacksonville',
    'security camera installation Florida',
    'structured cabling Jacksonville',
    'structured cabling Orlando',
    'Cat6 cabling contractor Florida',
    'access control Tampa',
    'access control systems Florida',
    'networking solutions Orlando',
    'network installation Florida',
    'low voltage contractor near me',
    'commercial electrical Florida',
    'telecommunications contractor Florida',
    'data center cabling Florida',
    'fiber optic contractor Tallahassee',
    'CCTV Fort Myers',
    'low voltage West Palm Beach',
    'instalación de fibra óptica Florida',
    'cableado estructurado Florida',
    'sistemas CCTV Florida',
  ],
  authors: [{ name: 'IQES Low Voltage Solutions' }],
  creator: 'IQES Low Voltage Solutions',
  publisher: 'IQES Low Voltage Solutions',
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  openGraph: {
    title: 'IQES Low Voltage Solutions | Professional Electrical Services Florida',
    description: 'Expert low voltage electrical installation across Florida. Fiber optic, CCTV, structured cabling, access control & networking. Free estimates!',
    images: ['/og-image.png'],
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'es_US',
    siteName: 'IQES Low Voltage Solutions',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IQES Low Voltage Solutions | Florida',
    description: 'Professional low voltage electrical services across Florida. Free estimates!',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'verification-code-here', // Replace with actual Google verification code
  },
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en',
      'es-US': '/es',
    },
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script src="https://apps.abacus.ai/chatllm/appllm-lib.js" async />
      </head>
      <body className={`${roboto.variable} ${openSans.variable} font-sans antialiased`}>
        <LocalBusinessSchema />
        <FAQSchema />
        <Providers>
          <LayoutWrapper>{children}</LayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
