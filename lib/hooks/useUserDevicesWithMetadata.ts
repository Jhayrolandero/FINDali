/**
 * Frontend hook for fetching user devices with full metadata
 * This hook calls the backend API to securely fetch device information
 */

import { useState, useEffect, useCallback } from 'react';
import type { UserDevicesResponse, DeviceMetadata } from '../api/types';

interface UseUserDevicesWithMetadataResult {
  devices: DeviceMetadata[];
  totalCount: number;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch user devices with full metadata (brand, model, etc.)
 * @param userAddress - Wallet address of the user
 * @returns Object containing devices array, loading state, and error
 */
export function useUserDevicesWithMetadata(
  userAddress: `0x${string}` | undefined
): UseUserDevicesWithMetadataResult {
  const [devices, setDevices] = useState<DeviceMetadata[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchDevices = useCallback(async () => {
    if (!userAddress) {
      setDevices([]);
      setTotalCount(0);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/user-devices?address=${userAddress}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      const data: UserDevicesResponse = await response.json();
      
      setDevices(data.devices);
      setTotalCount(data.totalCount);
    } catch (err) {
      console.error('Error fetching user devices with metadata:', err);
      setError(
        err instanceof Error
          ? err
          : new Error('Failed to fetch user devices')
      );
      setDevices([]);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [userAddress]);

  // Auto-fetch on mount and when address changes
  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  return {
    devices,
    totalCount,
    isLoading,
    error,
    refetch: fetchDevices,
  };
}

