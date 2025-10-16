import { formatEther } from "viem";

/**
 * Format a bigint Wei value to ETH string with specified decimals
 */
export function formatEthValue(value: bigint | undefined, decimals: number = 4): string {
  if (value === undefined) return "0";
  const ethValue = formatEther(value);
  return parseFloat(ethValue).toFixed(decimals);
}

/**
 * Shorten an address for display
 */
export function shortenAddress(address: string, chars: number = 4): string {
  if (!address) return "";
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}


//Remove 0x from address
export function remove0x(address: string): string {
  if (!address) return "";
  return address.replace("0x", "");
}

/**
 * Format a timestamp to a readable date
 */
export function formatTimestamp(timestamp: bigint | undefined): string {
  if (timestamp === undefined) return "";
  const date = new Date(Number(timestamp) * 1000);
  return date.toLocaleDateString();
}

/**
 * Upload images to IPFS or other storage (placeholder)
 * In production, you would integrate with IPFS, Arweave, or similar
 */
export async function uploadToIPFS(files: File[]): Promise<string> {
  // This is a placeholder. In production, integrate with:
  // - Pinata (IPFS)
  // - NFT.Storage
  // - Arweave
  // - Your own backend storage
  
  // For now, return a mock hash
  const mockHash = `QmHash${Math.random().toString(36).substring(7)}`;
  console.log("Files to upload:", files);
  return mockHash;
}

/**
 * Create a proof hash from device details and images
 * This would typically be an IPFS hash or similar
 */
export async function createProofHash(deviceData: {
  brand: string;
  model: string;
  imei: string;
  description?: string;
  images?: File[];
}): Promise<string> {
  // In production, upload to IPFS and return the hash
  if (deviceData.images && deviceData.images.length > 0) {
    return await uploadToIPFS(deviceData.images);
  }
  
  // Fallback: create a simple hash from the data
  const dataString = JSON.stringify(deviceData);
  return `0x${Buffer.from(dataString).toString("hex").slice(0, 64)}`;
}

/**
 * Validate IMEI format
 */
export function validateIMEI(imei: string): boolean {
  // Basic IMEI validation: 15 digits
  return /^\d{15}$/.test(imei);
}

/**
 * Get block explorer URL for a transaction
 */
export function getBlockExplorerUrl(txHash: string, chainId: number = 84532): string {
  // Base Sepolia
  if (chainId === 84532) {
    return `https://sepolia.basescan.org/tx/${txHash}`;
  }
  // Base Mainnet
  if (chainId === 8453) {
    return `https://basescan.org/tx/${txHash}`;
  }
  return "";
}

/**
 * Get block explorer URL for an address
 */
export function getAddressExplorerUrl(address: string, chainId: number = 84532): string {
  if (chainId === 84532) {
    return `https://sepolia.basescan.org/address/${address}`;
  }
  if (chainId === 8453) {
    return `https://basescan.org/address/${address}`;
  }
  return "";
}

