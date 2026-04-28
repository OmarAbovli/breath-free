import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/settings/', '/onboarding/'],
    },
    sitemap: 'https://breath-free-one.vercel.app/sitemap.xml',
  }
}
