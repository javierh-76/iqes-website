import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cities, services, getCityBySlug } from '@/lib/seo-data';
import { Phone, MapPin, CheckCircle, ArrowRight } from 'lucide-react';

interface PageProps {
  params: { city: string };
}

export async function generateStaticParams() {
  return cities.map((city) => ({ city: city.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const city = getCityBySlug(params.city);
  if (!city) return { title: 'Not Found' };

  const title = `Low Voltage Services in ${city.name}, Florida | IQES`;
  const description = `Professional low voltage electrical services in ${city.name}, FL. Fiber optic, CCTV, structured cabling, access control & networking. Serving ${city.region}. Free quotes!`;

  return {
    title,
    description,
    keywords: [
      `low voltage ${city.name}`,
      `electrical contractor ${city.name} FL`,
      `fiber optic ${city.name}`,
      `CCTV installation ${city.name}`,
      `structured cabling ${city.name}`,
      `network installation ${city.name} Florida`,
    ],
    openGraph: {
      title,
      description,
      type: 'website',
    },
    alternates: {
      languages: {
        'en': `/locations/${params.city}`,
        'es': `/locations/${params.city}`,
      },
    },
  };
}

export default function CityLandingPage({ params }: PageProps) {
  const city = getCityBySlug(params.city);
  if (!city) notFound();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#003366] to-[#004d99] text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <MapPin className="w-6 h-6 text-[#00A651]" />
              <span className="text-[#00A651] font-semibold">{city.region}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Low Voltage Services in {city.name}, Florida
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              Professional fiber optic, CCTV, structured cabling, access control, and networking 
              solutions for businesses in {city.name} and throughout {city.region}.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/quote"
                className="inline-flex items-center justify-center gap-2 bg-[#00A651] hover:bg-[#008c44] text-white px-8 py-4 rounded-lg font-semibold transition-all"
              >
                Get Free Quote <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="tel:3059266419"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-lg font-semibold transition-all"
              >
                <Phone className="w-5 h-5" /> (305) 926-6419
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#003366] text-center mb-4">
            Our Services in {city.name}
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Comprehensive low voltage solutions tailored for {city.name}'s 
            {city.keyIndustries.slice(0, 3).join(', ').toLowerCase()} industries and more.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {services.map((service) => (
              <Link
                key={service.slug}
                href={`/locations/${city.slug}/${service.slug}`}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all group"
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold text-[#003366] mb-2 group-hover:text-[#00A651] transition-colors">
                  {service.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {service.description}
                </p>
                <span className="text-[#00A651] font-medium text-sm flex items-center gap-1">
                  Learn more <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-[#003366] text-center mb-12">
              Why {city.name} Businesses Choose IQES
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { title: 'Local Expertise', desc: `Deep knowledge of ${city.name}'s business landscape and building codes` },
                { title: 'Fast Response', desc: `Quick service throughout ${city.region} - often same-day` },
                { title: 'Certified Technicians', desc: 'Factory-trained experts with industry certifications' },
                { title: 'Bilingual Service', desc: 'Full service in English and Spanish' },
                { title: 'Free Estimates', desc: 'Detailed quotes with no obligation' },
                { title: 'Warranty Included', desc: 'All work backed by comprehensive warranty' },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <CheckCircle className="w-6 h-6 text-[#00A651] flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-[#003366]">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#003366] text-center mb-8">
            Areas We Serve in {city.name}
          </h2>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-gray-600 mb-6">
              We provide low voltage services throughout {city.name} and surrounding areas 
              including zip codes: {city.zipCodes.join(', ')} and more.
            </p>
            <p className="text-gray-600">
              Serving {city.region} with a population of {city.population} residents and 
              key industries including {city.keyIndustries.join(', ')}.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#003366] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your Project in {city.name}?
          </h2>
          <p className="text-gray-200 mb-8 max-w-2xl mx-auto">
            Contact us today for a free consultation and quote. Our team is ready to help 
            with your low voltage electrical needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/quote"
              className="inline-flex items-center justify-center gap-2 bg-[#00A651] hover:bg-[#008c44] text-white px-8 py-4 rounded-lg font-semibold transition-all"
            >
              Request Quote
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-lg font-semibold transition-all"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Other Cities */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-[#003366] text-center mb-8">
            We Also Serve
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {cities.filter(c => c.slug !== city.slug).map((c) => (
              <Link
                key={c.slug}
                href={`/locations/${c.slug}`}
                className="px-4 py-2 bg-gray-100 hover:bg-[#003366] hover:text-white rounded-lg transition-all text-sm font-medium"
              >
                {c.name}, FL
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
