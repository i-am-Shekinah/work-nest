import { proxyBackendRequest } from "@/lib/api/proxy";

type Params = {
  params: Promise<{
    path: string[];
  }>;
};

export async function GET(request: Request, { params }: Params) {
  return proxyBackendRequest(request, (await params).path);
}

export async function POST(request: Request, { params }: Params) {
  return proxyBackendRequest(request, (await params).path);
}

export async function PATCH(request: Request, { params }: Params) {
  return proxyBackendRequest(request, (await params).path);
}

export async function DELETE(request: Request, { params }: Params) {
  return proxyBackendRequest(request, (await params).path);
}
