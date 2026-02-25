import type { MetadataRoute } from 'next';

const baseUrl = 'https://aiseo-n9lz.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: baseUrl, lastModified, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/register`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/login`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/privacy`, lastModified, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified, changeFrequency: 'yearly', priority: 0.3 },
  ];
}
