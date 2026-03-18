'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/contexts/language-context';
import { LanguageSwitcher } from './language-switcher';
import { Button } from './ui/button';
import { Menu, X, Phone } from 'lucide-react';
import { useState } from 'react';
import { COLORS, COMPANY } from '@/lib/constants';

export function Header() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Navigation without How It Works and AI Analysis
  const navigation = [
    { name: t?.nav?.home ?? 'Home', href: '/' },
    { name: t?.nav?.services ?? 'Services', href: '/services' },
    { name: t?.nav?.serviceAreas ?? 'Service Areas', href: '/service-areas' },
    { name: t?.nav?.projects ?? 'Projects', href: '/projects' },
    { name: t?.nav?.payments ?? 'Payments', href: '/payments' },
    { name: t?.nav?.contact ?? 'Contact', href: '/contact' },
  ];

  return (
    <header
      className="sticky top-0 z-50 w-full border-b"
      style={{
        backgroundColor: COLORS.primary,
        borderColor: `${COLORS.primary}`,
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-18 lg:h-20 items-center justify-between">
          {/* Logo - 3x larger as requested, header stays compact */}
          <Link href="/" className="flex items-center">
            <div className="relative h-20 w-64 sm:h-24 sm:w-80 lg:h-28 lg:w-96">
              <Image
                src="/logo-header.jpg"
                alt={COMPANY.name}
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-3">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={
                  pathname === item.href
                    ? 'px-4 py-2 text-lg font-semibold text-white bg-white/10 rounded-md'
                    : 'px-4 py-2 text-lg font-semibold text-white/90 hover:text-white hover:bg-white/5 rounded-md transition-colors'
                }
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side - Phone, Quote, Language */}
          <div className="flex items-center space-x-3">
            {/* Phone number - visible on desktop */}
            <a
              href={`tel:${COMPANY.phone}`}
              className="hidden lg:flex items-center space-x-2 text-white hover:text-white/80 transition-colors"
            >
              <Phone className="h-5 w-5" />
              <span className="text-base font-semibold whitespace-nowrap">{COMPANY.phone}</span>
            </a>
            
            <LanguageSwitcher />
            
            {/* Get Quote - Orange button */}
            <Link href="/quote" className="hidden sm:inline-block">
              <Button
                size="sm"
                style={{
                  backgroundColor: COLORS.orange,
                  color: COLORS.white,
                }}
                className="hover:opacity-90 transition-opacity font-semibold"
              >
                {t?.nav?.getQuote ?? 'Get Quote'}
              </Button>
            </Link>
            
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-white hover:bg-white/10 rounded-md"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t" style={{ borderColor: `${COLORS.primary}`, backgroundColor: COLORS.primary }}>
          <div className="space-y-1 px-4 pb-3 pt-2">
            {/* Phone number in mobile menu */}
            <a
              href={`tel:${COMPANY.phone}`}
              className="flex items-center space-x-2 px-3 py-3 text-white bg-white/5 rounded-md mb-2"
            >
              <Phone className="h-5 w-5" />
              <span className="font-semibold">{COMPANY.phone}</span>
            </a>
            
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={
                  pathname === item.href
                    ? 'block px-3 py-2 text-base font-medium text-white bg-white/10 rounded-md'
                    : 'block px-3 py-2 text-base font-medium text-white/80 hover:text-white hover:bg-white/5 rounded-md'
                }
              >
                {item.name}
              </Link>
            ))}
            
            {/* Get Quote - Orange in mobile */}
            <Link
              href="/quote"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full mt-2"
            >
              <Button
                className="w-full font-semibold"
                style={{
                  backgroundColor: COLORS.orange,
                  color: COLORS.white,
                }}
              >
                {t?.nav?.getQuote ?? 'Get Quote'}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
