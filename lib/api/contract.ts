/**
 * Smart contract interaction utilities for backend
 */

import { createPublicClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';
import { FINDCHAIN_CONTRACT_ADDRESS, FINDCHAIN_ABI } from '../contract';

/**
 * Creates a public client for reading contract data
 */
export function getPublicClient() {
  return createPublicClient({
    chain: baseSepolia,
    transport: http(),
  });
}

/**
 * Fetches the IMEI for a specific token
 * @param tokenId - NFT token ID
 * @returns Promise with IMEI string
 */
export async function getTokenIMEI(tokenId: bigint | string): Promise<string> {
  const client = getPublicClient();
  
  try {
    const imei = await client.readContract({
      address: FINDCHAIN_CONTRACT_ADDRESS,
      abi: FINDCHAIN_ABI,
      functionName: 'getTokenIMEI',
      args: [BigInt(tokenId)],
    });

    return imei as string;
  } catch (error) {
    console.error(`Error fetching IMEI for token ${tokenId}:`, error);
    throw new Error(
      `Failed to fetch IMEI: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Fetches IMEIs for multiple tokens in parallel
 * @param tokenIds - Array of token IDs
 * @returns Promise with array of IMEIs (empty string for failed requests)
 */
export async function getMultipleTokenIMEIs(
  tokenIds: (bigint | string)[]
): Promise<string[]> {
  const promises = tokenIds.map(async (tokenId) => {
    try {
      return await getTokenIMEI(tokenId);
    } catch (error) {
      console.error(`Failed to fetch IMEI for token ${tokenId}:`, error);
      return '';
    }
  });

  return Promise.all(promises);
}

