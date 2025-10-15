"use client";

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

