export default async function handler(req: any, res: any) {
  try {
    const { image, agent, text } = req.query;
    
    if (!image || !agent || !text) {
      return res.status(400).json({ error: 'Missing parameters' });
    }

    // Decode parameters (they'll be URL-encoded)
    const decodedAgent = decodeURIComponent(agent as string);
    const decodedText = decodeURIComponent(text as string);
    const decodedImage = decodeURIComponent(image as string);
    
    // Truncate text for preview
    const preview = decodedText.substring(0, 160);
    const title = `I got roasted by ${decodedAgent}! 🔥`;
    
    // Generate HTML with Open Graph meta tags
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  
  <!-- Open Graph for social sharing -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${preview}...">
  <meta property="og:image" content="${decodedImage}">
  <meta property="og:url" content="https://ai-roast-generator.vercel.app/">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${preview}...">
  <meta name="twitter:image" content="${decodedImage}">
  
  <!-- Farcaster -->
  <meta property="fc:frame" content="vNext">
  <meta property="fc:frame:image" content="${decodedImage}">
  
  <style>
    * { margin: 0; padding: 0; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .container {
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      max-width: 600px;
      width: 100%;
      overflow: hidden;
    }
    .image {
      width: 100%;
      max-height: 400px;
      object-fit: cover;
    }
    .content {
      padding: 40px;
    }
    h1 {
      font-size: 24px;
      margin-bottom: 16px;
      color: #333;
    }
    .agent {
      display: inline-block;
      background: #667eea;
      color: white;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      margin-bottom: 16px;
    }
    .roast {
      font-size: 16px;
      line-height: 1.6;
      color: #666;
      margin-bottom: 24px;
      font-style: italic;
      border-left: 4px solid #667eea;
      padding-left: 16px;
    }
    .cta {
      display: inline-block;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 12px 32px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      transition: transform 0.2s;
    }
    .cta:hover {
      transform: scale(1.05);
    }
  </style>
</head>
<body>
  <div class="container">
    <img src="${decodedImage}" alt="Roast" class="image" onerror="this.style.display='none'">
    <div class="content">
      <div class="agent">${decodedAgent}</div>
      <h1>${title}</h1>
      <p class="roast">"${decodedText}"</p>
      <a href="https://ai-roast-generator.vercel.app/" class="cta">Get Your Own Roast! 🔥</a>
    </div>
  </div>
</body>
</html>
    `;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(html);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
