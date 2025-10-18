import { useState, useCallback } from 'react';
export function useS3Upload() {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const uploadImageToS3 = useCallback(async (imageBase64) => {
        try {
            setError(null);
            setUploading(true);
            // Convert base64 to Blob
            const base64Data = imageBase64.split(',')[1] || imageBase64;
            const binaryString = atob(base64Data);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            const blob = new Blob([bytes], { type: 'image/png' });
            // Get presigned URL from Vercel API route (not XMTP)
            console.log(`[S3] Requesting presigned URL from Vercel API...`);
            const presignedUrlResponse = await fetch(`/api/s3-presigned-url?filename=roast.png&contentType=image/png`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!presignedUrlResponse.ok) {
                const errorText = await presignedUrlResponse.text();
                console.error(`[S3] Presigned URL request failed: ${presignedUrlResponse.status}`, errorText);
                throw new Error(`Failed to get presigned URL: ${presignedUrlResponse.status} - ${errorText.substring(0, 100)}`);
            }
            const { uploadUrl, expiresIn } = await presignedUrlResponse.json();
            console.log(`[S3] Got presigned URL from Vercel, expires in ${expiresIn}s`);
            // Upload to S3 using presigned URL
            console.log(`[S3] Uploading image to S3 via presigned URL...`);
            const s3Response = await fetch(uploadUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'image/png',
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