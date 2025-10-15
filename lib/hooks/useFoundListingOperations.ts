"use client";

import { useWriteContract, useReadContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";
import { FINDCHAIN_CONTRACT_ADDRESS, FINDCHAIN_ABI } from "../contract";

/**
 * Hook for creating a found listing (finders post what they found)
 */
export function useCreateFoundListing() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ hash });

  const createFoundListing = (deviceDescription: string, proofHash: string) => {
    if (!deviceDescription || deviceDescription.length === 0) {
      throw new Error("Device description is required");
    }
    if (!proofHash || proofHash.length === 0) {
      throw new Error("Proof hash is required");
    }
    
    writeContract({
      address: FINDCHAIN_CONTRACT_ADDRESS,
      abi: FINDCHAIN_ABI,
      functionName: "createFoundListing",
      args: [deviceDescription, proofHash],
    });
  };

  return {
    createFoundListing,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  };
}

/**
 * Hook for removing a found listing (by the finder)
 */
export function useRemoveFoundListing() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ hash });

  const removeFoundListing = (listingId: bigint) => {
    writeContract({
      address: FINDCHAIN_CONTRACT_ADDRESS,
      abi: FINDCHAIN_ABI,
      functionName: "removeFoundListing",
      args: [listingId],
    });
  };

  return {
    removeFoundListing,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  };
}

/**
 * Hook for claiming a found listing (owner claims their device with optional reward)
 */
export function useClaimFoundListing() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ hash });

  const claimFoundListing = (listingId: bigint, rewardInEth?: string) => {
    writeContract({
      address: FINDCHAIN_CONTRACT_ADDRESS,
      abi: FINDCHAIN_ABI,
      functionName: "claimFoundListing",
      args: [listingId],
      value: rewardInEth ? parseEther(rewardInEth) : BigInt(0),
    });
  };

  return {
    claimFoundListing,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  };
}

/**
 * Hook for getting found listing information
 */
export function useGetFoundListing(listingId: bigint | undefined) {
  const { data, isError, isLoading, refetch } = useReadContract({
    address: FINDCHAIN_CONTRACT_ADDRESS,
    abi: FINDCHAIN_ABI,
    functionName: "getFoundListing",
    args: listingId !== undefined ? [listingId] : undefined,
    query: {
      enabled: listingId !== undefined,
    },
  });

  type FoundListingData = {
    id: bigint;
    deviceDescription: string;
    proofHash: string;
    finder: `0x${string}`;
    submittedAt: bigint;
    claimed: boolean;
    claimedBy: `0x${string}`;
    rewardAmount: bigint;
  };

  return {
    listing: data as FoundListingData | undefined,
    isError,
    isLoading,
    refetch,
  };
}

/**
 * Hook for getting total number of found listings
 */
export function useGetTotalFoundListings() {
  const { data, isError, isLoading, refetch } = useReadContract({
    address: FINDCHAIN_CONTRACT_ADDRESS,
    abi: FINDCHAIN_ABI,
    functionName: "getTotalFoundListings",
  });

  return {
    total: data as bigint | undefined,
    isError,
    isLoading,
    refetch,
  };
}

