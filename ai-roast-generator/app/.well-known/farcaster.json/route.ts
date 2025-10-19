import { minikitConfig } from '../../../minikit.config';

export async function GET() {
  return new Response(JSON.stringify(minikitConfig), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

