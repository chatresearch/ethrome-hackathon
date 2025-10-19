import { useEffect, useState } from 'react';

interface RoastPageData {
  image?: string;
  agent?: string;
  text?: string;
}

function getAgentIcon(agentName: string): string {
  if (agentName.includes('defi')) return '💰';
  if (agentName.includes('security')) return '🔒';
  if (agentName.includes('profile')) return '💕';
  if (agentName.includes('linkedin')) return '💼';
  if (agentName.includes('vibe')) return '✨';
  return '😈';
}

export default function RoastPage() {
  const [roastData, setRoastData] = useState<RoastPageData>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Parse query parameters
    const params = new URLSearchParams(window.location.search);
    const image = params.get('image') || undefined;
    const agent = params.get('agent') || 'AI Roaster';
    const text = params.get('text') || 'Got roasted!';

    setRoastData({ image, agent, text });

    // Set OG meta tags for social sharing
    document.title = `Roasted by ${agent} 🔥 | AI Roast Generator`;
    
    // Add OG meta tags
    const setMeta = (property: string, content: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    setMeta('og:title', `Roasted by ${agent} 🔥`);
    setMeta('og:description', text.substring(0, 150));
    if (image) {
      setMeta('og:image', image);
      setMeta('og:image:width', '1200');
      setMeta('og:image:height', '630');
    }
    setMeta('og:type', 'website');
    setMeta('og:url', window.location.href);

    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div style={{ textAlign: 'center', padding: '40px' }}>Loading roast...</div>;
  }

  const { image, agent, text } = roastData;
  const icon = agent ? getAgentIcon(agent) : '😈';

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Agent Header */}
        <div style={styles.header}>
          <span style={styles.icon}>{icon}</span>
          <h1 style={styles.agentName}>{agent}</h1>
        </div>

        {/* Image */}
        {image && (
          <img 
            src={image} 
            alt="Roasted image" 
            style={styles.image}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        )}

        {/* Roast Text */}
        <div style={styles.roastBox}>
          <p style={styles.roastText}>{text}</p>
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <p style={styles.footerText}>
            Got roasted? Try the{' '}
            <a href="/" style={styles.link}>
              AI Roast Generator
            </a>
            {' '}and get your own! 🔥
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  } as React.CSSProperties,
  card: {
    background: 'white',
    borderRadius: '16px',
    padding: '40px',
    maxWidth: '600px',
    width: '100%',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
  } as React.CSSProperties,
  header: {
    textAlign: 'center' as const,
    marginBottom: '30px',
    borderBottom: '2px solid #f0f0f0',
    paddingBottom: '20px',
  } as React.CSSProperties,
  icon: {
    fontSize: '48px',
    marginRight: '10px',
  } as React.CSSProperties,
  agentName: {
    margin: '10px 0 0 0',
    fontSize: '28px',
    color: '#333',
  } as React.CSSProperties,
  image: {
    width: '100%',
    height: 'auto',
    borderRadius: '12px',
    marginBottom: '30px',
    maxHeight: '400px',
    objectFit: 'cover',
  } as React.CSSProperties,
  roastBox: {
    background: '#f8f8f8',
    borderLeft: '4px solid #667eea',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '30px',
  } as React.CSSProperties,
  roastText: {
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#333',
    margin: '0',
  } as React.CSSProperties,
  footer: {
    textAlign: 'center' as const,
    paddingTop: '20px',
    borderTop: '1px solid #f0f0f0',
  } as React.CSSProperties,
  footerText: {
    color: '#666',
    fontSize: '14px',
  } as React.CSSProperties,
  link: {
    color: '#667eea',
    textDecoration: 'none',
    fontWeight: 'bold',
  } as React.CSSProperties,
};
