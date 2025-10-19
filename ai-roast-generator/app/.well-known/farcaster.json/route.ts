import { minikitConfig } from '../../../minikit.config';

export function GET() {
  return Response.json(minikitConfig.miniapp);
}
