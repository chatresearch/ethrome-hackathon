import { minikitConfig } from '../../../minikit.config';

// Force cache bust: serving complete minikit config with accountAssociation
export function GET() {
  return Response.json(minikitConfig);
}
