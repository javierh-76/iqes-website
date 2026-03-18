import { MetadataRoute } from 'next';
import { headers } from 'next/headers';
import { cities, services as seoServices } from '@/lib/seo-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const headersList = headers();
  const host = headersList.get('x-forwarded-host') || process.env.NEXTAUTH_URL?.replace(/^https?:\/\//, '') || 'localhost:3000';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;

  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/service-areas`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/process`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/analyze`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/quote`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/payments`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  // Service pages
  const services = ['fiber-optic', 'cctv', 'structured-cabling', 'access-control', 'networking'];
  services.forEach(service => {
    routes.push({
      url: `${baseUrl}/services/${service}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    });
  });

  // City landing pages (high priority for local SEO)
  cities.forEach(city => {
    routes.push({
      url: `${baseUrl}/locations/${city.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    });

    // City + Service landing pages (highest priority for local SEO)
    seoServices.forEach(service => {
      routes.push({
        url: `${baseUrl}/locations/${city.slug}/${service.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.85,
      });
    });
  });

  return routes;
}
