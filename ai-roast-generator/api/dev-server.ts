import * as http from 'http';
import * as url from 'url';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const PORT = process.env.API_PORT || 3001;

async function handleS3PresignedUrl(searchParams: URLSearchParams) {
  const filename = searchParams.get('filename') || 'image.png';
  const contentType = searchParams.get('contentType') || 'image/png';

  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    throw new Error('AWS credentials not configured');
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

  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  console.log(`[S3] Generated presigned URL for ${key}`);

  return {
    uploadUrl,
    expiresIn: 3600,
  };
}

const server = http.createServer(async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  try {
    const parsedUrl = url.parse(req.url || '', true);
    
    if (parsedUrl.pathname === '/api/s3-presigned-url' && req.method === 'GET') {
      const result = await handleS3PresignedUrl(new URLSearchParams(parsedUrl.query as Record<string, string>));
      res.writeHead(200);
      res.end(JSON.stringify(result));
      return;
    }

    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found' }));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('[API] Error:', message);
    res.writeHead(500);
    res.end(JSON.stringify({ error: message }));
  }
});

server.listen(PORT, () => {
  console.log(`\n🚀 API dev server running on http://localhost:${PORT}`);
  console.log(`   Endpoints:`);
  console.log(`   - GET /api/s3-presigned-url?filename=test.png&contentType=image/png\n`);
});
