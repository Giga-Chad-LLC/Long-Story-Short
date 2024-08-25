import {routes, SERVER_API_URL} from "../shared/protocol/apis.ts";

interface EncryptionData {
  iv: string
  encryptedToken: string
}

export const encryptToken = async (token: string): Promise<EncryptionData> => {
  const response = await fetch(`${SERVER_API_URL}/${routes.encryptToken}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ token })
  });

  if (!response.ok) {
    throw new Error("Failed to encrypt token");
  }

  const { iv, encrypted_token: encryptedToken } = await response.json();
  return { iv, encryptedToken };
};
