'use client';

import Script from 'next/script';

export function LocalBusinessSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://iqeslowvoltage.com',
    name: 'IQES Low Voltage Solutions',
    alternateName: 'Low Voltage Florida',
    description: 'Professional low voltage electrical installation services in Florida. Specializing in fiber optic, CCTV, structured cabling, access control, and networking solutions.',
    url: 'https://iqeslowvoltage.com',
    telephone: '+1-386-603-9541',
    email: 'info@iqeslowvoltage.com',
    priceRange: '$$',
    image: 'https://img.freepik.com/free-vector/lighting-thunderbolt-flash-symbol-renewable-energy-concept-background_1017-60427.jpg?semt=ais_hybrid&w=740&q=80',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Miami',
      addressRegion: 'FL',
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 25.7617,
      longitude: -80.1918,
    },
    areaServed: [
      { '@type': 'City', name: 'Jacksonville', containedInPlace: { '@type': 'State', name: 'Florida' } },
      { '@type': 'City', name: 'Orlando', containedInPlace: { '@type': 'State', name: 'Florida' } },
      { '@type': 'City', name: 'Tampa', containedInPlace: { '@type': 'State', name: 'Florida' } },
      { '@type': 'City', name: 'Tallahassee', containedInPlace: { '@type': 'State', name: 'Florida' } },
      { '@type': 'City', name: 'Fort Myers', containedInPlace: { '@type': 'State', name: 'Florida' } },
      { '@type': 'City', name: 'Miami', containedInPlace: { '@type': 'State', name: 'Florida' } },
      { '@type': 'City', name: 'West Palm Beach', containedInPlace: { '@type': 'State', name: 'Florida' } },
      { '@type': 'State', name: 'Florida', containedInPlace: { '@type': 'Country', name: 'United States' } },
    ],
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:00',
      closes: '18:00',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Low Voltage Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Fiber Optic Installation',
            description: 'High-speed fiber optic installation, splicing, and certification services.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'CCTV Systems',
            description: 'Advanced surveillance and security camera systems with remote monitoring.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Structured Cabling',
            description: 'Professional Cat5e, Cat6, Cat6a cabling for voice and data networks.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Access Control',
            description: 'Secure access control systems including biometric readers and electronic locks.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Networking Solutions',
            description: 'Complete network infrastructure including WiFi and server room setup.',
          },
        },
      ],
    },
    sameAs: [
      'https://www.facebook.com/iqeslowvoltage',
      'https://www.linkedin.com/company/iqeslowvoltage',
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '127',
    },
  };

  return (
    <Script
      id="local-business-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function FAQSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What areas in Florida do you serve?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We serve all 67 counties in Florida including Jacksonville, Orlando, Tampa, Tallahassee, Fort Myers, Miami, and West Palm Beach. We provide service statewide within 150 miles of our main locations.',
        },
      },
      {
        '@type': 'Question',
        name: 'What low voltage services do you offer?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We offer fiber optic installation and splicing, CCTV and surveillance systems, structured cabling (Cat5e, Cat6, Cat6a), access control systems, and complete networking solutions.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do you provide free estimates?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! We provide free estimates for all projects. You can request a quote through our website or call us directly at 386-603-9541.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do you offer bilingual support?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, we provide full bilingual support in English and Spanish. Our team includes native speakers in both languages to serve all customers effectively.',
        },
      },
    ],
  };

  return (
    <Script
      id="faq-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
