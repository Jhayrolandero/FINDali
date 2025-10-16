/**
 * API Route: Fetch user devices with full metadata
 * GET /api/user-devices?address={walletAddress}
 * 
 * This endpoint:
 * 1. Fetches NFTs owned by the user from Alchemy
 * 2. Retrieves IMEI for each token from the smart contract
 * 3. Fetches device metadata from IMEI API
 * 4. Returns combined data with device info
 */

import { NextRequest, NextResponse } from 'next/server';
import { fetchAllNFTsForOwner } from '@/lib/api/alchemy';
import { getMultipleTokenIMEIs } from '@/lib/api/contract';
import { fetchMultipleDeviceInfo } from '@/lib/api/imei';
import { FINDCHAIN_CONTRACT_ADDRESS } from '@/lib/contract';
import type { UserDevicesResponse, DeviceMetadata } from '@/lib/api/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET handler for fetching user devices
 */
export async function GET(request: NextRequest) {
  try {
    // Extract and validate wallet address
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');

    if (!address) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    if (!address.match(/^0x[a-fA-F0-9]{40}$/)) {
      return NextResponse.json(
        { error: 'Invalid wallet address format' },
        { status: 400 }
      );
    }

    // Step 1: Fetch NFTs from Alchemy
    console.log(`Fetching NFTs for address: ${address}`);
    const nftData = await fetchAllNFTsForOwner(address, FINDCHAIN_CONTRACT_ADDRESS);

    if (nftData.ownedNfts.length === 0) {
      return NextResponse.json<UserDevicesResponse>({
        devices: [],
        totalCount: 0,
      });
    }

    console.log(`NFTs fetched: ${nftData.ownedNfts.length}`);

    // Step 2: Fetch IMEIs from smart contract
    console.log(`Fetching IMEIs for ${nftData.ownedNfts.length} tokens`);
    const tokenIds = nftData.ownedNfts.map(nft => nft.tokenId);
    const imeis = await getMultipleTokenIMEIs(tokenIds);

    // Step 3: Fetch device info from IMEI API
    console.log(`Fetching device info for ${imeis.length} IMEIs`);
    const validIMEIs = imeis.filter(imei => imei.length === 15);
    const deviceInfoResults = await fetchMultipleDeviceInfo(validIMEIs);

    console.log(`Device info fetched: ${deviceInfoResults}`);
    // Step 4: Combine all data
    const devices: DeviceMetadata[] = nftData.ownedNfts
      .map((nft, index) => {
        const imei = imeis[index];
        const deviceInfo = deviceInfoResults[index];

        // Skip if IMEI fetch failed
        if (!imei || imei.length !== 15) {
          console.warn(`Invalid IMEI for token ${nft.tokenId}`);
          return null;
        }
        console.log(`Device info fetched: ${deviceInfo}`);

        // If device info fetch failed, still return basic data
        if (!deviceInfo) {
          return {
            tokenId: nft.tokenId,
            imei,
            brand: 'Unknown',
            model: 'Unknown',
            modelName: 'Unknown Device',
          };
        }

        return {
          tokenId: nft.tokenId,
          imei,
          brand: deviceInfo.object.brand,
          model: deviceInfo.object.model,
          modelName: deviceInfo.object.name,
          mintBlock: nft.mint.blockNumber,
        };
      })
      .filter((device): device is DeviceMetadata => device !== null);

    const response: UserDevicesResponse = {
      devices,
      totalCount: devices.length,
    };

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Error in user-devices API:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to fetch user devices',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

