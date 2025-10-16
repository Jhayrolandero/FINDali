/**
 * Type definitions for external APIs and internal data structures
 */

// Alchemy API Types
export interface AlchemyNFTResponse {
  ownedNfts: AlchemyNFT[];
  totalCount: number;
  pageKey: string | null;
}

export interface AlchemyNFT {
  tokenId: string;
  tokenType: string;
  mint: {
    mintAddress: string;
    blockNumber: number;
    timestamp: string;
    transactionHash: string;
  };
  balance: string;
}

// IMEI Check API Types
export interface IMEICheckResponse {
  status: string;
  result: string;
  imei: string;
  count_free_checks_today: number;
  readPerformance: string;
  object: {
    brand: string;
    name: string;
    model: string;
  };
}

// Internal Types
export interface DeviceMetadata {
  tokenId: string;
  imei: string;
  brand: string;
  model: string;
  modelName: string;
  mintedAt: string;
  mintBlock: number;
}

export interface UserDevicesResponse {
  devices: DeviceMetadata[];
  totalCount: number;
  error?: string;
}

// API Error Types
export interface ApiError {
  message: string;
  code?: string;
  statusCode: number;
}

