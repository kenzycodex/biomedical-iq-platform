/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://biomediq.vercel.app',
  generateRobotsTxt: true, // To control crawling
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*', // Allow all crawlers to access the site
        allow: '/',
        disallow: ['/private', '/admin', '/login', '/dashboard'], // Exclude non-public routes
      },
    ],
    additionalSitemaps: [
      `${process.env.SITE_URL || 'https://biomediq.vercel.app'}/server-sitemap.xml`,
    ],
  },
  exclude: ['/private', '/admin', '/login', '/dashboard'], // Exclude sensitive or irrelevant routes from the sitemap
  changefreq: 'daily', // Frequent crawling to keep the index up-to-date
  priority: 0.8, // Default priority, adjusted below for specific pages
  sitemapSize: 5000, // Split sitemap after 5000 URLs
  generateIndexSitemap: true, // Allow index sitemap generation for easier management
  outDir: 'public', // Output folder for sitemaps
  autoLastmod: true, // Automatically set last modification time

  // Enhanced transformation for SEO relevance and backlink potential
  transform: async (config, path) => {
    let updatedConfig = {
      loc: path, // The URL of the page
      changefreq: 'daily', // Frequent crawling for updated content
      priority: config.priority || 0.7, // Default priority
      lastmod: new Date().toISOString(), // Set last modification date
    };

    // Prioritize key pages that can attract backlinks
    if (path.includes('/blog') || path.includes('/whitepapers') || path.includes('/case-studies')) {
      updatedConfig.priority = 1.0;
      updatedConfig.changefreq = 'weekly';
    } else if (path.includes('/equipment') || path.includes('/reports')) {
      updatedConfig.priority = 0.9;
      updatedConfig.changefreq = 'daily';
    } else if (path === '/') {
      updatedConfig.priority = 1.0; // Highest priority for homepage
    } else if (path.includes('/about') || path.includes('/services')) {
      updatedConfig.priority = 0.9;
      updatedConfig.changefreq = 'monthly';
    }

    return updatedConfig;
  },

  // Additional paths for high-priority pages that attract backlinks
  additionalPaths: async (config) => [
    { loc: '/about', priority: 0.9, changefreq: 'monthly' },
    { loc: '/contact', priority: 0.8, changefreq: 'monthly' },
    { loc: '/services', priority: 0.9, changefreq: 'monthly' },
    { loc: '/faq', priority: 0.7, changefreq: 'weekly' },
    { loc: '/case-studies', priority: 1.0, changefreq: 'weekly' }, // Case studies can attract backlinks
  ],

  // Structured data for rich results and snippets
  trailingSlash: false, // Modern URL practice
  xmlNs: true, // Add XML namespace

  // Additional metadata strategies to enhance SEO and backlink attraction:
  metadata: {
    titleTemplate: "%s | Biomedical IQ",
    metaTags: [
      {
        name: "description",
        content: "Biomedical IQ - A healthcare platform for managing equipment care, performance, and tracking." // Tailored meta description
      },
      {
        name: "keywords",
        content: "Biomedical IQ, healthcare equipment management, medical care platform, equipment care, performance tracking"
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        property: "og:title",
        content: "Biomedical IQ - Healthcare Equipment Care Platform",
      },
      {
        property: "og:description",
        content: "Manage healthcare equipment maintenance, performance reports, and care plans with Biomedical IQ.",
      },
      {
        property: "og:url",
        content: "https://biomediq.vercel.app",
      },
      {
        property: "og:image",
        content: "https://biomediq.vercel.app/og-image.jpg", // Image for social sharing
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
    ],
  },

  // Robots.txt management to control how the site is crawled
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/private", "/admin", "/login", "/dashboard"],
        crawlDelay: 2, // Helps Google manage crawling efficiently
      },
    ],
  },
};