export default async function handler(req: any, res: any) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { imageBase64 } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "imageBase64 required" });
    }

    console.log("[TEST] Received image upload test");
    console.log("[TEST] Base64 length:", imageBase64.length);

    // Just echo back that we received it
    res.status(200).json({
      success: true,
      message: "✅ Image received successfully!",
      imageSizeKB: Math.round(imageBase64.length / 1024),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[TEST] Error:", message);
    res.status(500).json({ error: message });
  }
}
