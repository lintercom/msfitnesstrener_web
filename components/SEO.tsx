
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
        setMetaTag('meta[name="description"]', 'content', description || seoConfig.home.description);
        setMetaTag('meta[name="keywords"]', 'content', keywords || seoConfig.globalKeywords);

        // Open Graph Meta Tags
        setMetaTag('meta[property="og:title"]', 'content', ogTitle || title || seoConfig.home.title);
        setMetaTag('meta[property="og:description"]', 'content', ogDescription || description || seoConfig.home.description);
        setMetaTag('meta[property="og:image"]', 'content', ogImage || seoConfig.ogImage || '/og-image.jpg');
        setMetaTag('meta[property="og:type"]', 'content', 'website');
        setMetaTag('meta[property="og:site_name"]', 'content', siteName);

        // Twitter Meta Tags
        setMetaTag('meta[name="twitter:card"]', 'content', 'summary_large_image');
        setMetaTag('meta[name="twitter:title"]', 'content', ogTitle || title || seoConfig.home.title);
        setMetaTag('meta[name="twitter:description"]', 'content', ogDescription || description || seoConfig.home.description);
        setMetaTag('meta[name="twitter:image"]', 'content', ogImage || seoConfig.ogImage || '/og-image.jpg');

        // Canonical Link
        let canonicalTag = document.querySelector('link[rel="canonical"]');
        if (canonical) {
            if (!canonicalTag) {
                canonicalTag = document.createElement('link');
                canonicalTag.setAttribute('rel', 'canonical');
                document.head.appendChild(canonicalTag);
            }
            canonicalTag.setAttribute('href', canonical);
        } else if (canonicalTag) {
            canonicalTag.remove();
        }

    }, [title, description, keywords, ogTitle, ogDescription, ogImage, canonical, seoConfig]);

    return null;
};

export default SEO;
