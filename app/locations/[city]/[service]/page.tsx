import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cities, services, getCityBySlug, getServiceBySlug, generateCityServiceContent } from '@/lib/seo-data';
import { Phone, MapPin, CheckCircle, ArrowRight, Star } from 'lucide-react';

interface PageProps {
  params: { city: string; service: string };
}

export async function generateStaticParams() {
  const params: { city: string; service: string }[] = [];
  cities.forEach((city) => {
    services.forEach((service) => {
      params.push({ city: city.slug, service: service.slug });
    });
  });
  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const city = getCityBySlug(params.city);
  const service = getServiceBySlug(params.service);
  if (!city || !service) return { title: 'Not Found' };

  const content = generateCityServiceContent(city, service, 'en');

  return {
    title: content.title,
    description: content.metaDescription,
    keywords: [
      ...service.keywords.map(k => `${k} ${city.name}`),
      ...service.keywords.map(k => `${k} ${city.name} FL`),
      `${service.shortName.toLowerCase()} contractor ${city.name}`,
      `${service.shortName.toLowerCase()} company ${city.name} Florida`,
    ],
    openGraph: {
      title: content.title,
      description: content.metaDescription,
      type: 'website',
    },
  };
}

export default function CityServicePage({ params }: PageProps) {
  const city = getCityBySlug(params.city);
  const service = getServiceBySlug(params.service);
  if (!city || !service) notFound();

  const content = generateCityServiceContent(city, service, 'en');

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#003366] to-[#004d99] text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-gray-300 mb-6">
              <Link href="/" className="hover:text-white">Home</Link>
              <span>/</span>
              <Link href={`/locations/${city.slug}`} className="hover:text-white">{city.name}</Link>
              <span>/</span>
              <span className="text-[#00A651]">{service.shortName}</span>
            </nav>

            <div className="flex items-center gap-2 mb-4">
              <span className="text-4xl">{service.icon}</span>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#00A651]" />
                <span className="text-[#00A651] font-semibold">{city.name}, FL</span>
              </div>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-bold mb-6">
              {content.h1}
            </h1>
            
            <p className="text-xl text-gray-200 mb-8">
              {content.intro}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
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

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-[#003366] mb-8">
              Why Choose IQES for {service.name} in {city.name}
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {service.benefits.map((benefit, idx) => (
                <div key={idx} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-[#00A651] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Applications */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-[#003366] mb-4">
              {service.name} Applications in {city.name}
            </h2>
            <p className="text-gray-600 mb-8">
              Our {service.shortName.toLowerCase()} solutions are perfect for {city.name}'s 
              diverse business community, including {city.keyIndustries.join(', ').toLowerCase()} sectors.
            </p>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {service.applications.map((app, idx) => (
                <div key={idx} className="bg-white p-4 rounded-lg shadow-sm">
                  <Star className="w-5 h-5 text-[#00A651] mb-2" />
                  <span className="font-medium text-[#003366]">{app}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Local Service Info */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-[#003366] mb-6">
              {service.shortName} Services Throughout {city.region}
            </h2>
            
            <div className="prose prose-lg max-w-none text-gray-700">
              <p>
                IQES is your trusted {service.shortName.toLowerCase()} contractor in {city.name}, Florida. 
                We provide comprehensive {service.name.toLowerCase()} solutions for businesses throughout 
                {city.region}, serving zip codes {city.zipCodes.slice(0, 4).join(', ')} and surrounding areas.
              </p>
              <p>
                With a population of {city.population} and key industries including {city.keyIndustries.join(', ')}, 
                {city.name} businesses need reliable low voltage infrastructure. Our certified technicians 
                understand the unique requirements of {city.region}'s commercial environment.
              </p>
              <p>
                Whether you're upgrading existing systems or planning a new installation, our team provides 
                free on-site assessments, detailed proposals, and professional installation with full warranty coverage.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Other Services */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-[#003366] text-center mb-8">
            Other Services in {city.name}
          </h2>
          <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
            {services.filter(s => s.slug !== service.slug).map((s) => (
              <Link
                key={s.slug}
                href={`/locations/${city.slug}/${s.slug}`}
                className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-[#003366] hover:text-white rounded-lg transition-all text-sm font-medium shadow-sm"
              >
                <span>{s.icon}</span>
                {s.shortName}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#003366] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready for {service.name} in {city.name}?
          </h2>
          <p className="text-gray-200 mb-8 max-w-2xl mx-auto">
            Contact IQES today for a free consultation and quote. Bilingual service available.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/quote"
              className="inline-flex items-center justify-center gap-2 bg-[#00A651] hover:bg-[#008c44] text-white px-8 py-4 rounded-lg font-semibold transition-all"
            >
              Request Free Quote
            </Link>
            <a
              href="tel:9546432668"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-lg font-semibold transition-all"
            >
              <Phone className="w-5 h-5" /> Español: (954) 643-2668
            </a>
          </div>
        </div>
      </section>

      {/* Other Cities */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h3 className="text-lg font-bold text-[#003366] text-center mb-6">
            {service.name} Also Available In:
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {cities.filter(c => c.slug !== city.slug).map((c) => (
              <Link
                key={c.slug}
                href={`/locations/${c.slug}/${service.slug}`}
                className="px-3 py-1.5 bg-gray-100 hover:bg-[#00A651] hover:text-white rounded-full transition-all text-sm"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
