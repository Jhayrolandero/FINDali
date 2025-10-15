"use client";

import { useWriteContract, useReadContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";
import { FINDCHAIN_CONTRACT_ADDRESS, FINDCHAIN_ABI } from "../contract";

/**
 * Hook for creating an open bounty (for devices without NFT)
 */
export function useCreateOpenBounty() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ hash });

  const createOpenBounty = (deviceDescription: string, amountInEth: string) => {
    if (!deviceDescription || deviceDescription.length === 0) {
      throw new Error("Device description is required");
    }
    
    writeContract({
      address: FINDCHAIN_CONTRACT_ADDRESS,
      abi: FINDCHAIN_ABI,
      functionName: "createOpenBounty",
      args: [deviceDescription],
      value: parseEther(amountInEth),
    });
  };

  return {
    createOpenBounty,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  };
}

/**
 * Hook for cancelling an open bounty
 */
export function useCancelOpenBounty() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ hash });

  const cancelOpenBounty = (bountyId: bigint) => {
    writeContract({
      address: FINDCHAIN_CONTRACT_ADDRESS,
      abi: FINDCHAIN_ABI,
      functionName: "cancelOpenBounty",
      args: [bountyId],
    });
  };

  return {
    cancelOpenBounty,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  };
}

/**
 * Hook for submitting a claim on an open bounty
 */
export function useSubmitOpenClaim() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ hash });

  const submitOpenClaim = (bountyId: bigint, proofHash: string) => {
    if (!proofHash || proofHash.length === 0) {
      throw new Error("Proof hash is required");
    }
    
    writeContract({
      address: FINDCHAIN_CONTRACT_ADDRESS,
      abi: FINDCHAIN_ABI,
      functionName: "submitOpenClaim",
      args: [bountyId, proofHash],
    });
  };

  return {
    submitOpenClaim,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  };
}

/**
 * Hook for confirming an open claim
 */
export function useConfirmOpenClaim() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ hash });

  const confirmOpenClaim = (claimId: bigint) => {
    writeContract({
      address: FINDCHAIN_CONTRACT_ADDRESS,
      abi: FINDCHAIN_ABI,
      functionName: "confirmOpenClaim",
      args: [claimId],
    });
  };

  return {
    confirmOpenClaim,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  };
}

/**
 * Hook for rejecting an open claim
 */
export function useRejectOpenClaim() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ hash });

  const rejectOpenClaim = (claimId: bigint) => {
    writeContract({
      address: FINDCHAIN_CONTRACT_ADDRESS,
      abi: FINDCHAIN_ABI,
      functionName: "rejectOpenClaim",
      args: [claimId],
    });
  };

  return {
    rejectOpenClaim,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  };
}

/**
 * Hook for getting open bounty information
 */
export function useGetOpenBounty(bountyId: bigint | undefined) {
  const { data, isError, isLoading, refetch } = useReadContract({
    address: FINDCHAIN_CONTRACT_ADDRESS,
    abi: FINDCHAIN_ABI,
    functionName: "getOpenBounty",
    args: bountyId !== undefined ? [bountyId] : undefined,
    query: {
      enabled: bountyId !== undefined,
    },
  });

  type OpenBountyData = {
    id: bigint;
    deviceDescription: string;
    amount: bigint;
    owner: `0x${string}`;
    createdAt: bigint;
    active: boolean;
  };

  return {
    openBounty: data as OpenBountyData | undefined,
    isError,
    isLoading,
    refetch,
  };
}

/**
 * Hook for getting open claim information
 */
export function useGetOpenClaim(claimId: bigint | undefined) {
  const { data, isError, isLoading, refetch } = useReadContract({
    address: FINDCHAIN_CONTRACT_ADDRESS,
    abi: FINDCHAIN_ABI,
    functionName: "getOpenClaim",
    args: claimId !== undefined ? [claimId] : undefined,
    query: {
      enabled: claimId !== undefined,
    },
  });

  type OpenClaimData = {
    openBountyId: bigint;
    finder: `0x${string}`;
    proofHash: string;
    submittedAt: bigint;
    confirmed: boolean;
    rejected: boolean;
  };

  return {
    openClaim: data as OpenClaimData | undefined,
    isError,
    isLoading,
    refetch,
  };
}

/**
 * Hook for getting all claims for an open bounty
 */
export function useGetOpenBountyClaims(bountyId: bigint | undefined) {
  const { data, isError, isLoading, refetch } = useReadContract({
    address: FINDCHAIN_CONTRACT_ADDRESS,
    abi: FINDCHAIN_ABI,
    functionName: "getOpenBountyClaims",
    args: bountyId !== undefined ? [bountyId] : undefined,
    query: {
      enabled: bountyId !== undefined,
    },
  });

  return {
    claimIds: data as bigint[] | undefined,
    isError,
    isLoading,
    refetch,
  };
}

/**
 * Hook for getting total number of open bounties
 */
export function useGetTotalOpenBounties() {
  const { data, isError, isLoading, refetch } = useReadContract({
    address: FINDCHAIN_CONTRACT_ADDRESS,
    abi: FINDCHAIN_ABI,
    functionName: "getTotalOpenBounties",
  });

  return {
    total: data as bigint | undefined,
    isError,
    isLoading,
    refetch,
  };
}

/**
 * Hook for getting total number of open claims
 */
export function useGetTotalOpenClaims() {
  const { data, isError, isLoading, refetch } = useReadContract({
    address: FINDCHAIN_CONTRACT_ADDRESS,
    abi: FINDCHAIN_ABI,
    functionName: "getTotalOpenClaims",
  });

  return {
    total: data as bigint | undefined,
    isError,
    isLoading,
    refetch,
  };
}

