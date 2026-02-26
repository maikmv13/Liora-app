/**
 * Utility to optimize Unsplash images using their Imgix-powered API.
 * 
 * @param url Base Unsplash image URL
 * @param width Target width in pixels
 * @param quality Quality level (1-100)
 * @returns Optimized URL with parameters
 */
export const getOptimizedUnsplashUrl = (url: string | undefined, width: number = 800, quality: number = 60) => {
    if (!url) return '';

    // If it's not an Unsplash URL, return as is
    if (!url.includes('unsplash.com')) return url;

    // Clean base URL (remove existing search params)
    const baseUrl = url.split('?')[0];

    // Return optimized URL
    // auto=format: automatically choose best format (webp, avif, etc)
    // fit=crop: crop to dimensions
    return `${baseUrl}?auto=format&fit=crop&q=${quality}&w=${width}`;
};
