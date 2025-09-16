import {

  upload,
} from "@imagekit/next";

// Define the response type from your backend `/api/upload-auth`
interface AuthResponse {
  signature: string;
  expire: number;
  token: string;
  publicKey: string;
}

// Authenticator function for ImageKit
const authenticator = async (): Promise<AuthResponse> => {
  const response = await fetch("/api/upload-auth");
  if (!response.ok) {
    throw new Error(`Auth failed: ${response.status}`);
  }
  return response.json();
};

const UploadImage = async (file: File): Promise<string | null> => {
  try {
    const { signature, expire, token, publicKey } = await authenticator();

    const uploadResponse = await upload({
      expire,
      token,
      signature,
      publicKey,
      file, // ✅ must be File | Blob | string
      fileName: file?.name || `file-${Date.now()}`,
    });

    return uploadResponse.url ?? null;
  } catch (error) {
    console.error("Upload error:", error);
    return null;
  }
};

export default UploadImage;
