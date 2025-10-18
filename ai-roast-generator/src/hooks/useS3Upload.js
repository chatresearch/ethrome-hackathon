import { useState, useCallback } from 'react';
export function useS3Upload() {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const uploadImageToS3 = useCallback(async (imageBase64) => {
        try {
            setError(null);
            setUploading(true);
            // Detect image type from base64 header
            let contentType = 'image/png';
            let extension = 'png';
            if (imageBase64.includes('image/jpeg') || imageBase64.includes('/9j/')) {
                contentType = 'image/jpeg';
                extension = 'jpg';
            }
            else if (imageBase64.includes('image/gif')) {
                contentType = 'image/gif';
                extension = 'gif';
            }
            else if (imageBase64.includes('image/webp')) {
                contentType = 'image/webp';
                extension = 'webp';
            }
            // Convert base64 to Blob
            const base64Data = imageBase64.split(',')[1] || imageBase64;
            const binaryString = atob(base64Data);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            const blob = new Blob([bytes], { type: contentType });
            // Determine presigned URL endpoint
            // @ts-ignore
            const isProduction = typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
            // @ts-ignore
            const xmtpApiUrl = isProduction ? (import.meta.env.VITE_REACT_APP_XMTP_API || import.meta.env.VITE_XMTP_API) : 'http://127.0.0.1:3003';
            let presignedUrlEndpoint = '/api/s3-presigned-url'; // Default to Vercel API route
            if (!isProduction && xmtpApiUrl) {
                // In local dev, use XMTP agent endpoint
                presignedUrlEndpoint = `${xmtpApiUrl}/api/s3-upload-url`;
                console.log(`[S3] Using local XMTP agent for presigned URL: ${presignedUrlEndpoint}`);
            }
            else if (isProduction) {
                // In production, use Vercel API route (relative URL)
                console.log(`[S3] Using Vercel API route for presigned URL`);
            }
            // Get presigned URL
            console.log(`[S3] Requesting presigned URL from ${presignedUrlEndpoint}...`);
            const presignedUrlResponse = await fetch(`${presignedUrlEndpoint}?filename=image-${Date.now()}.${extension}&contentType=${encodeURIComponent(contentType)}`);
            if (!presignedUrlResponse.ok) {
                const errorText = await presignedUrlResponse.text();
                console.error(`[S3] Presigned URL request failed: ${presignedUrlResponse.status}`, errorText);
                throw new Error(`Failed to get presigned URL: ${presignedUrlResponse.status} - ${errorText.substring(0, 100)}`);
            }
            const { uploadUrl, expiresIn } = await presignedUrlResponse.json();
            console.log(`[S3] Got presigned URL, expires in ${expiresIn}s`);
            // Upload to S3 using presigned URL
            console.log(`[S3] Uploading image to S3 via presigned URL...`);
            const s3Response = await fetch(uploadUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': contentType,
                },
                body: blob,
            });
            if (!s3Response.ok) {
                throw new Error(`S3 upload failed: ${s3Response.status} ${s3Response.statusText}`);
            }
            // Extract S3 URL from presigned URL (remove query params)
            const s3Url = uploadUrl.split('?')[0];
            console.log(`[S3] ✅ Upload complete: ${s3Url}`);
            setUploading(false);
            return s3Url;
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(`[S3] ❌ Upload failed: ${message}`);
            setError(message);
            setUploading(false);
            throw new Error(`S3 upload failed: ${message}`);
        }
    }, []);
    return {
        uploadImageToS3,
        uploading,
        error,
    };
}
//# sourceMappingURL=useS3Upload.js.map