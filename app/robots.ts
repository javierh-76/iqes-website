import { MetadataRoute } from 'next';
import { headers } from 'next/headers';

export default function robots(): MetadataRoute.Robots {
  const headersList = headers();
  const host = headersList.get('x-forwarded-host') || process.env.NEXTAUTH_URL?.replace(/^https?:\/\//, '') || 'localhost:3000';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
