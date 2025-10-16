/**
 * Alchemy API utilities for fetching NFT ownership data
 */

import { AlchemyNFTResponse } from './types';

const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || process.env.ALCHEMY_API_KEY;
const BASE_SEPOLIA_URL = `https://base-sepolia.g.alchemy.com/nft/v3/${ALCHEMY_API_KEY}`;

/**
 * Fetches all NFTs owned by a wallet address for a specific contract
 * @param ownerAddress - Wallet address of the owner
 * @param contractAddress - Smart contract address
 * @param pageKey - Optional pagination key for fetching next page
 * @returns Promise with owned NFTs data
 */
export async function fetchNFTsForOwner(
  ownerAddress: string,
  contractAddress: string,
  pageKey?: string
): Promise<AlchemyNFTResponse> {
  if (!ALCHEMY_API_KEY) {
    throw new Error('Alchemy API key not configured');
  }

  const params = new URLSearchParams({
    owner: ownerAddress,
    'contractAddresses[]': contractAddress,
    withMetadata: 'false', // We don't need metadata from Alchemy
    pageSize: '100',
  });

  if (pageKey) {
    params.append('pageKey', pageKey);
  }

  const url = `${BASE_SEPOLIA_URL}/getNFTsForOwner?${params.toString()}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Alchemy API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching NFTs from Alchemy:', error);
    throw new Error(
      `Failed to fetch NFTs: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Fetches all NFTs for an owner, handling pagination automatically
 * @param ownerAddress - Wallet address of the owner
 * @param contractAddress - Smart contract address
 * @returns Promise with all owned NFTs (paginated results combined)
 */
export async function fetchAllNFTsForOwner(
  ownerAddress: string,
  contractAddress: string
): Promise<AlchemyNFTResponse> {
  let allNFTs: AlchemyNFTResponse['ownedNfts'] = [];
  let pageKey: string | null = null;
  let totalCount = 0;

  do {
    const result = await fetchNFTsForOwner(
      ownerAddress,
      contractAddress,
      pageKey || undefined
    );
    
    allNFTs = [...allNFTs, ...result.ownedNfts];
    pageKey = result.pageKey;
    totalCount = result.totalCount;
  } while (pageKey);

  return {
    ownedNfts: allNFTs,
    totalCount,
    pageKey: null,
  };
}

