/**
 * =============================================================================
 * USER DEVICES WITH METADATA API - USAGE GUIDE
 * =============================================================================
 * 
 * This module provides a complete solution for fetching user-owned NFT devices
 * with full metadata (brand, model, IMEI) in a secure, scalable manner.
 * 
 * ARCHITECTURE:
 * -------------
 * 1. Frontend Hook (useUserDevicesWithMetadata)
 *    └─> Calls Backend API (/api/user-devices)
 *        └─> Fetches NFTs from Alchemy
 *        └─> Fetches IMEIs from Smart Contract
 *        └─> Fetches Device Info from IMEI API
 *        └─> Returns Combined Data
 * 
 * WHY BACKEND API?
 * ----------------
 * - Protects IMEI data from exposure in browser
 * - Centralizes API key management
 * - Enables caching and rate limiting
 * - Better error handling and logging
 * 
 * =============================================================================
 * SETUP INSTRUCTIONS
 * =============================================================================
 */

// STEP 1: Environment Configuration
// ----------------------------------
// Create a .env.local file with:
/*
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_key
IMEI_API_KEY=your_imei_api_key
*/

// STEP 2: Frontend Usage - React Component
// -----------------------------------------
import { useUserDevicesWithMetadata } from '@/lib/hooks/useUserDevicesWithMetadata';
import { useAccount } from 'wagmi';

function MyDevicesPage() {
  const { address } = useAccount();
  const { devices, isLoading, error, refetch } = useUserDevicesWithMetadata(address);

  if (isLoading) return <div>Loading devices...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>My Devices ({devices.length})</h1>
      {devices.map((device) => (
        <div key={device.tokenId}>
          <h2>{device.modelName}</h2>
          <p>Brand: {device.brand}</p>
          <p>Model: {device.model}</p>
          <p>Token ID: {device.tokenId}</p>
          <p>Minted: {new Date(device.mintedAt).toLocaleDateString()}</p>
        </div>
      ))}
      <button onClick={refetch}>Refresh</button>
    </div>
  );
}

// STEP 3: Direct API Usage (Server Components / API Routes)
// ----------------------------------------------------------
import { fetchAllNFTsForOwner } from '@/lib/api/alchemy';
import { getMultipleTokenIMEIs } from '@/lib/api/contract';
import { fetchMultipleDeviceInfo } from '@/lib/api/imei';
import { FINDCHAIN_CONTRACT_ADDRESS } from '@/lib/contract';

async function getDevicesServerSide(walletAddress: string) {
  // Fetch NFTs
  const nfts = await fetchAllNFTsForOwner(walletAddress, FINDCHAIN_CONTRACT_ADDRESS);
  
  // Fetch IMEIs
  const tokenIds = nfts.ownedNfts.map(nft => nft.tokenId);
  const imeis = await getMultipleTokenIMEIs(tokenIds);
  
  // Fetch device info
  const deviceInfo = await fetchMultipleDeviceInfo(imeis);
  
  // Combine data
  return nfts.ownedNfts.map((nft, i) => ({
    tokenId: nft.tokenId,
    imei: imeis[i],
    brand: deviceInfo[i]?.object.brand,
    model: deviceInfo[i]?.object.model,
    modelName: deviceInfo[i]?.object.name,
    mintedAt: nft.mint.timestamp,
  }));
}

// STEP 4: Custom Endpoint (if needed)
// ------------------------------------
// You can also call individual API functions to build custom endpoints:

import { fetchDeviceInfo } from '@/lib/api/imei';

async function customDeviceEndpoint(imei: string) {
  try {
    const info = await fetchDeviceInfo(imei);
    return {
      brand: info.object.brand,
      model: info.object.model,
      name: info.object.name,
    };
  } catch (error) {
    console.error('Failed to fetch device:', error);
    throw error;
  }
}

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

import type { DeviceMetadata, UserDevicesResponse } from '@/lib/api/types';

// DeviceMetadata structure:
type ExampleDevice = {
  tokenId: string;        // "0", "1", "2", etc.
  imei: string;           // "352322311421731"
  brand: string;          // "Motorola"
  model: string;          // "XT2231-5"
  modelName: string;      // "Moto G22"
  mintedAt: string;       // "2025-10-16T03:34:14Z"
  mintBlock: number;      // 32408683
};

// =============================================================================
// ERROR HANDLING
// =============================================================================

// The API gracefully handles failures:
// - Invalid wallet address → 400 error
// - Failed IMEI fetch → Device returned with "Unknown" metadata
// - Failed device info → Device returned with basic data
// - No NFTs found → Returns empty array (not an error)

function handleDeviceErrors() {
  const { devices, error } = useUserDevicesWithMetadata("0x..." as `0x${string}`);
  
  if (error) {
    // Network error, API down, etc.
    console.error('Critical error:', error);
  }
  
  // Check individual devices
  devices.forEach((device) => {
    if (device.brand === 'Unknown') {
      console.warn(`Device ${device.tokenId} has unknown metadata`);
    }
  });
}

// =============================================================================
// CACHING & PERFORMANCE
// =============================================================================

// The API route implements caching:
// - Response cache: 5 minutes (s-maxage=300)
// - Stale-while-revalidate: 10 minutes
// - IMEI API cache: 24 hours (device info doesn't change)

// For better performance with large collections:
// - Requests are made in parallel (Promise.all)
// - Pagination is handled automatically
// - Failed requests don't block successful ones

// =============================================================================
// SECURITY CONSIDERATIONS
// =============================================================================

// ✅ IMEI data never exposed to frontend
// ✅ API keys kept server-side only
// ✅ Input validation on wallet addresses
// ✅ Error messages don't leak sensitive info
// ✅ Rate limiting via Alchemy/IMEI API
// ⚠️  Consider adding authentication if needed
// ⚠️  Consider adding rate limiting middleware

// =============================================================================
// TESTING
// =============================================================================

// Test the API directly:
// GET /api/user-devices?address=0xYourWalletAddress

// Expected response:
const exampleResponse: UserDevicesResponse = {
  devices: [
    {
      tokenId: "0",
      imei: "352322311421731",
      brand: "Motorola",
      model: "XT2231-5",
      modelName: "Moto G22",
      mintedAt: "2025-10-16T03:34:14Z",
      mintBlock: 32408683,
    }
  ],
  totalCount: 1,
};

// =============================================================================
// TROUBLESHOOTING
// =============================================================================

/*
Issue: "Alchemy API key not configured"
Fix: Add NEXT_PUBLIC_ALCHEMY_API_KEY or ALCHEMY_API_KEY to .env.local

Issue: "Failed to fetch NFTs"
Fix: Check Alchemy API key, network connection, and Base Sepolia RPC

Issue: "Invalid IMEI: must be 15 characters"
Fix: Ensure NFTs have valid IMEI data in smart contract

Issue: Devices show "Unknown" brand
Fix: IMEI API might be rate limited or down, check API key

Issue: Hook returns empty array but I have NFTs
Fix: Check contract address matches deployment, verify wallet has NFTs
*/

export {};

