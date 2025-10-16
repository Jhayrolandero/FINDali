"use client";

import React from "react";
import { useWriteContract, useReadContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";
import { FINDCHAIN_CONTRACT_ADDRESS, FINDCHAIN_ABI } from "../contract";

/**
 * Hook for minting a device NFT
 * @param imei - The device IMEI (must be 15 characters)
 */
export function useMintDevice() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ hash });

  const mintDevice = (imei: string) => {
    if (imei.length !== 15) {
      throw new Error("IMEI must be 15 characters long");
    }
    
    writeContract({
      address: FINDCHAIN_CONTRACT_ADDRESS,
      abi: FINDCHAIN_ABI,
      functionName: "mintDevice",
      args: [imei],
    });
  };

  return {
    mintDevice,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  };
}

/**
 * Hook for transferring a device NFT
 */
export function useTransferDevice() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ hash });

  const transferDevice = (tokenId: bigint, toAddress: `0x${string}`) => {
    writeContract({
      address: FINDCHAIN_CONTRACT_ADDRESS,
      abi: FINDCHAIN_ABI,
      functionName: "transferDevice",
      args: [tokenId, toAddress],
    });
  };

  return {
    transferDevice,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  };
}

/**
 * Hook for checking if an IMEI is already registered
 */
export function useCheckIMEI(imei: string | undefined) {
  const { data, isError, isLoading } = useReadContract({
    address: FINDCHAIN_CONTRACT_ADDRESS,
    abi: FINDCHAIN_ABI,
    functionName: "isIMEIRegistered",
    args: imei ? [imei] : undefined,
    query: {
      enabled: !!imei && imei.length === 15,
    },
  });

  return {
    isRegistered: data as boolean | undefined,
    isError,
    isLoading,
  };
}

/**
 * Hook for getting the owner of a token
 */
export function useTokenOwner(tokenId: bigint | undefined) {
  const { data, isError, isLoading } = useReadContract({
    address: FINDCHAIN_CONTRACT_ADDRESS,
    abi: FINDCHAIN_ABI,
    functionName: "ownerOf",
    args: tokenId !== undefined ? [tokenId] : undefined,
    query: {
      enabled: tokenId !== undefined,
    },
  });

  return {
    owner: data as `0x${string}` | undefined,
    isError,
    isLoading,
  };
}

/**
 * Hook for getting the balance (number of devices) of an address
 */
export function useDeviceBalance(address: `0x${string}` | undefined) {
  const { data, isError, isLoading, refetch } = useReadContract({
    address: FINDCHAIN_CONTRACT_ADDRESS,
    abi: FINDCHAIN_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  return {
    balance: data as bigint | undefined,
    isError,
    isLoading,
    refetch,
  };
}

/**
 * Hook for getting the IMEI of a token (hashed)
 */
export function useTokenIMEI(tokenId: bigint | undefined) {
  const { data, isError, isLoading } = useReadContract({
    address: FINDCHAIN_CONTRACT_ADDRESS,
    abi: FINDCHAIN_ABI,
    functionName: "getTokenIMEI",
    args: tokenId !== undefined ? [tokenId] : undefined,
    query: {
      enabled: tokenId !== undefined,
    },
  });

  return {
    imei: data as string | undefined,
    isError,
    isLoading,
  };
}

/**
 * Hook to get all NFTs owned by a user with their IMEIs
 * Uses events to fetch minted devices and checks current ownership
 */
export function useUserDevices(userAddress: `0x${string}` | undefined) {
  const [devices, setDevices] = React.useState<Array<{
    tokenId: bigint;
    imei: string;
  }>>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  const fetchDevices = React.useCallback(async () => {
    if (!userAddress) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const { createPublicClient, http } = await import("viem");
      const { baseSepolia } = await import("wagmi/chains");
      
      const publicClient = createPublicClient({
        chain: baseSepolia,
        transport: http(),
      });

      // Fetch all DeviceMinted events
      const logs = await publicClient.getLogs({
        address: FINDCHAIN_CONTRACT_ADDRESS,
        event: {
          type: "event",
          name: "DeviceMinted",
          inputs: [
            { indexed: true, name: "tokenId", type: "uint256" },
            { indexed: false, name: "imei", type: "string" },
            { indexed: true, name: "owner", type: "address" },
          ],
        },
        fromBlock: "earliest",
        toBlock: "latest",
      });

      console.log("logs", logs);

      // Check ownership for each minted token and get IMEI
      const userDevices = await Promise.all(
        logs.map(async (log) => {
          const tokenId = log.args.tokenId!;
          
          // Check if user still owns this token
          const owner = await publicClient.readContract({
            address: FINDCHAIN_CONTRACT_ADDRESS,
            abi: FINDCHAIN_ABI,
            functionName: "ownerOf",
            args: [tokenId],
          });

          if (owner?.toLowerCase() === userAddress.toLowerCase()) {
            // Get IMEI
            const imei = await publicClient.readContract({
              address: FINDCHAIN_CONTRACT_ADDRESS,
              abi: FINDCHAIN_ABI,
              functionName: "getTokenIMEI",
              args: [tokenId],
            });

            return {
              tokenId,
              imei: imei as string,
            };
          }
          return null;
        })
      );

      setDevices(userDevices.filter((d) => d !== null) as Array<{ tokenId: bigint; imei: string }>);
    } catch (err) {
      console.error("Error fetching user devices:", err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [userAddress]);

  React.useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  return {
    devices,
    isLoading,
    error,
    refetch: fetchDevices,
  };
}

