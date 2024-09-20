/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://biomediq.vercel.app',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/private', '/admin', '/login'],
      },
    ],
    additionalSitemaps: [
      `${process.env.SITE_URL || 'https://biomediq.vercel.app'}/server-sitemap.xml`,
    ],
  },
  exclude: ['/private', '/admin', '/login'],
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
  generateIndexSitemap: true,
  outDir: 'public',
  transform: async (config, path) => {
    // Custom transformation for each page entry
    if (path.includes('/blog')) {
      // Increase the priority for blog posts
      return {
        loc: path,
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: new Date().toISOString(),
      };
    }
    // Use default transformation for all other paths
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
};