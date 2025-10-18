import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const config = {
  runtime: "nodejs",
};

export default async function handler(req: any, res: any) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { filename = "image.png", contentType = "image/png" } = req.query;

    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      console.error("AWS credentials not configured");
      return res.status(500).json({ error: "AWS credentials not configured" });
    }

    const s3Client = new S3Client({
      region: "eu-south-1",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    const bucket = "irc-ai-roaster";
    const key = `roasts/${Date.now()}-${Math.random().toString(36).substring(7)}-${filename}`;

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: contentType,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    console.log(`[S3] Generated presigned URL for ${key}`);
    res.status(200).json({
      uploadUrl: url,
      expiresIn: 3600,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[S3] Error:", message);
    res.status(500).json({ error: message });
  }
}
