import { minikitConfig } from '../../../minikit.config';

// Serve the complete minikit config including accountAssociation and all metadata
export function GET() {
  return Response.json(minikitConfig);
}
