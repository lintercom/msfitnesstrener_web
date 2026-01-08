
import React, { useRef, useState } from 'react';
import { compressImage } from '../../utils/imageUtils';

interface ImageUploaderProps {
    label: string;
    imageUrl: string;
    onImageChange: (base64: string | null) => void;
    showToast: (message: string, type?: 'success' | 'error') => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ label, imageUrl, onImageChange, showToast }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isCompressing, setIsCompressing] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Increase limit to 5MB for warning, as we will compress it anyway
        if (file.size > 5 * 1024 * 1024) {
            showToast(`Soubor ${file.name} je velmi velký. Bude automaticky optimalizován pro web.`, 'success');
        }

        setIsCompressing(true);
        try {
            const reader = new FileReader();
            reader.onload = async (event) => {
                const base64 = event.target?.result as string;
                try {
                    // Automatically compress all uploaded images to standard dimensions and quality
                    const compressed = await compressImage(base64);
                    onImageChange(compressed);
                } catch (err) {
                    console.error("Compression failed", err);
                    onImageChange(base64); // Fallback to original if compression fails
                } finally {
                    setIsCompressing(false);
                }
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error("File reading failed", error);
            setIsCompressing(false);
        }
    };

    return (
        <div className="p-3 bg-gray-50 rounded-md border">
            <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
            <div className="flex items-center gap-4">
                <div className="w-32 h-20 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                    {imageUrl ? (
                        <img src={imageUrl} alt="Náhled" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs text-center">Bez obrázku</div>
                    )}
                </div>
                <div className="flex flex-col gap-2">
                    <input
                        type="file"
                        accept="image/png, image/jpeg, image/webp"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isCompressing}
                        className={`px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50`}
                    >
                        {isCompressing ? 'Optimalizace...' : 'Nahrát nový'}
                    </button>
                    {imageUrl && (
                        <button type="button" onClick={() => onImageChange(null)} className="px-3 py-1.5 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm font-medium hover:bg-red-100">
                            Odstranit
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ImageUploader;
