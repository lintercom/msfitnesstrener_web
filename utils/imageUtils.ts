/**
 * Utility for client-side image compression.
 * Resizes images to a maximum dimension and reduces JPEG/WebP quality.
 */

export const compressImage = (base64Str: string, maxWidth: number = 1920, maxHeight: number = 1080, quality: number = 0.8): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = base64Str;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            // Calculate new dimensions while maintaining aspect ratio
            if (width > height) {
                if (width > maxWidth) {
                    height *= maxWidth / width;
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width *= maxHeight / height;
                    height = maxHeight;
                }
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                reject(new Error('Could not get canvas context'));
                return;
            }

            ctx.drawImage(img, 0, 0, width, height);

            // Compress to WebP to preserve transparency (Alpha channel)
            const compressedBase64 = canvas.toDataURL('image/webp', quality);
            resolve(compressedBase64);
        };
        img.onerror = (error) => reject(error);
    });
};
