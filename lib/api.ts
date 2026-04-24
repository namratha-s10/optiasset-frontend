const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface Asset {
  id: number;
  name: string;
  category: string;
  serial_number: string;
  status: string;
}

export interface AssetCreate {
  name: string;
  category: string;
  serial_number: string;
}

function getHeaders(email?: string) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (email) {
    headers["X-User-Email"] = email;
  }
  return headers;
}

export async function getAssets(email?: string): Promise<Asset[]> {
  const response = await fetch(`${API_BASE_URL}/assets/`, {
    headers: getHeaders(email)
  });
  if (!response.ok) {
    throw new Error("Failed to fetch assets");
  }
  return response.json();
}

export async function createAsset(asset: AssetCreate, email?: string): Promise<Asset> {
  const response = await fetch(`${API_BASE_URL}/assets/`, {
    method: "POST",
    headers: getHeaders(email),
    body: JSON.stringify(asset),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to create asset");
  }
  return response.json();
}

export async function deleteAsset(assetId: number, email?: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/assets/${assetId}`, {
    method: "DELETE",
    headers: getHeaders(email)
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to delete asset");
  }
}
