'use client';

import { Header } from './header';
import { Footer } from './footer';
import dynamic from 'next/dynamic';

const VapiVoiceWidget = dynamic(() => import('./vapi-voice-widget'), {
  ssr: false,
});

const WhatsAppWidget = dynamic(() => import('./whatsapp-widget'), {
  ssr: false,
});

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppWidget />
      <VapiVoiceWidget />
    </div>
  );
}
