import { useState, useCallback } from 'react';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const S3_BUCKET = 'irc-ai-roaster';
const S3_REGION = 'eu-south-1';

export function useS3Upload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImageToS3 = useCallback(async (imageBase64: string): Promise<string> => {
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

      // Generate unique filename
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(7);
      const filename = `roasts/${timestamp}-${random}.png`;

      console.log(`[S3] Uploading image to ${filename}...`);

      // Upload to S3 using default AWS credentials from environment
      const s3Client = new S3Client({
        region: S3_REGION,
        credentials: {
          // AWS SDK will use environment variables or default profile
          // AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_SESSION_TOKEN
          // Or default ~/.aws/credentials profile
        }
      });

      const uploadParams = {
        Bucket: S3_BUCKET,
        Key: filename,
        Body: blob,
        ContentType: 'image/png',
      };

      const command = new PutObjectCommand(uploadParams);
      await s3Client.send(command);

      // Return S3 URL
      const s3Url = `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/${filename}`;
      console.log(`[S3] ✅ Upload complete: ${s3Url}`);

      setUploading(false);
      return s3Url;
    } catch (err) {
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
