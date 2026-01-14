
import React, { useEffect } from 'react';
import { useData } from '../context/DataProvider';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    canonical?: string;
}

const SEO: React.FC<SEOProps> = ({
    title,
    description,
    keywords,
    ogTitle,
    ogDescription,
    ogImage,
    canonical
}) => {
    const { data } = useData();
    const seoConfig = data.seo;

    useEffect(() => {
        // 1. Handle Title
        const siteName = seoConfig.siteName || 'Martin Šťastný';
        const separator = seoConfig.titleSeparator || '|';
        const fullTitle = title
            ? `${title} ${separator} ${siteName}`
            : `${seoConfig.home.title} ${separator} ${siteName}`;

        document.title = fullTitle;

        // Domain for absolute URLs
        const SITE_DOMAIN = 'https://martin-stastny.cz';

        // 2. Helper to set meta tags
        const setMetaTag = (selector: string, attribute: string, value: string) => {
            if (!value) return;
            let element = document.querySelector(selector);
            if (!element) {
                element = document.createElement('meta');
                if (selector.startsWith('meta[name')) {
                    const name = selector.match(/name="([^"]+)"/)?.[1];
                    if (name) element.setAttribute('name', name);
                } else if (selector.startsWith('meta[property')) {
                    const property = selector.match(/property="([^"]+)"/)?.[1];
                    if (property) element.setAttribute('property', property);
                }
                document.head.appendChild(element);
            }
            element.setAttribute(attribute, value);
        };

        // Standard Meta Tags
        setMetaTag('meta[name="google-site-verification"]', 'content', '5axqCGdDIYmBGEAD_L561iIe32xmTInxDYLOOAOIp2M');
        setMetaTag('meta[name="description"]', 'content', description || seoConfig.home.description);
        setMetaTag('meta[name="keywords"]', 'content', keywords || seoConfig.globalKeywords);
        setMetaTag('meta[name="robots"]', 'content', 'index, follow');
        setMetaTag('meta[property="og:locale"]', 'content', 'cs_CZ');

        // Resolve absolute image URL
        const rawOgImage = ogImage || seoConfig.ogImage || '/og-image.jpg';
        const absoluteOgImage = rawOgImage.startsWith('http')
            ? rawOgImage
            : `${SITE_DOMAIN}${rawOgImage.startsWith('/') ? '' : '/'}${rawOgImage}`;

        // Open Graph Meta Tags
        setMetaTag('meta[property="og:title"]', 'content', ogTitle || title || seoConfig.home.title);
        setMetaTag('meta[property="og:description"]', 'content', ogDescription || description || seoConfig.home.description);
        setMetaTag('meta[property="og:image"]', 'content', absoluteOgImage);
        setMetaTag('meta[property="og:type"]', 'content', 'website');
        setMetaTag('meta[property="og:site_name"]', 'content', siteName);
        setMetaTag('meta[property="og:url"]', 'content', window.location.href);

        // Twitter Meta Tags
        setMetaTag('meta[name="twitter:card"]', 'content', 'summary_large_image');
        setMetaTag('meta[name="twitter:title"]', 'content', ogTitle || title || seoConfig.home.title);
        setMetaTag('meta[name="twitter:description"]', 'content', ogDescription || description || seoConfig.home.description);
        setMetaTag('meta[name="twitter:image"]', 'content', absoluteOgImage);

        // Canonical Link
        let canonicalTag = document.querySelector('link[rel="canonical"]');
        // Default to current page on production domain if not specific canonical provided
        const finalCanonical = canonical || `https://martin-stastny.cz${window.location.pathname}`;

        if (!canonicalTag) {
            canonicalTag = document.createElement('link');
            canonicalTag.setAttribute('rel', 'canonical');
            document.head.appendChild(canonicalTag);
        }
        canonicalTag.setAttribute('href', finalCanonical);

    }, [title, description, keywords, ogTitle, ogDescription, ogImage, canonical, seoConfig]);

    return null;
};

export default SEO;
