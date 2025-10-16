"use client";

import { useWriteContract, useReadContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";
import { FINDCHAIN_CONTRACT_ADDRESS, FINDCHAIN_ABI } from "../contract";

/**
 * Hook for creating a bounty on a device NFT
 */
export function useCreateBounty() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ hash });

  const createBounty = (tokenId: bigint, amountInEth: string) => {
    writeContract({
      address: FINDCHAIN_CONTRACT_ADDRESS,
      abi: FINDCHAIN_ABI,
      functionName: "createBounty",
      args: [tokenId],
      value: parseEther(amountInEth),
    });
  };

  return {
    createBounty,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  };
}

/**
 * Hook for submitting a claim on a bounty
 */
export function useSubmitClaim() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ hash });

  const submitClaim = (tokenId: bigint, proofHash: string) => {
    if (!proofHash || proofHash.length === 0) {
      throw new Error("Proof hash is required");
    }
    
    writeContract({
      address: FINDCHAIN_CONTRACT_ADDRESS,
      abi: FINDCHAIN_ABI,
      functionName: "submitClaim",
      args: [tokenId, proofHash],
    });
  };

  return {
    submitClaim,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  };
}

/**
 * Hook for confirming a claim (releasing the bounty to the finder)
 */
export function useConfirmClaim() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ hash });

  const confirmClaim = (claimId: bigint) => {
    writeContract({
      address: FINDCHAIN_CONTRACT_ADDRESS,
      abi: FINDCHAIN_ABI,
      functionName: "confirmClaim",
      args: [claimId],
    });
  };

  return {
    confirmClaim,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  };
}

/**
 * Hook for rejecting a claim
 */
export function useRejectClaim() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ hash });

  const rejectClaim = (claimId: bigint) => {
    writeContract({
      address: FINDCHAIN_CONTRACT_ADDRESS,
      abi: FINDCHAIN_ABI,
      functionName: "rejectClaim",
      args: [claimId],
    });
  };

  return {
    rejectClaim,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  };
}

/**
 * Hook for cancelling a bounty and getting the funds back
 */
export function useCancelBounty() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ hash });

  const cancelBounty = (tokenId: bigint) => {
    writeContract({
      address: FINDCHAIN_CONTRACT_ADDRESS,
      abi: FINDCHAIN_ABI,
      functionName: "cancelBounty",
      args: [tokenId],
    });
  };

  return {
    cancelBounty,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  };
}

/**
 * Hook for getting bounty information
 */
export function useGetBounty(tokenId: bigint | undefined) {
  const { data, isError, isLoading, refetch } = useReadContract({
    address: FINDCHAIN_CONTRACT_ADDRESS,
    abi: FINDCHAIN_ABI,
    functionName: "getBounty",
    args: tokenId !== undefined ? [tokenId] : undefined,
    query: {
      enabled: tokenId !== undefined,
    },
  });

  type BountyData = {
    amount: bigint;
    owner: `0x${string}`;
    createdAt: bigint;
    active: boolean;
  };

  return {
    bounty: data as BountyData | undefined,
    isError,
    isLoading,
    refetch,
  };
}

/**
 * Hook for getting claim information
 */
export function useGetClaim(claimId: bigint | undefined) {
  const { data, isError, isLoading, refetch } = useReadContract({
    address: FINDCHAIN_CONTRACT_ADDRESS,
    abi: FINDCHAIN_ABI,
    functionName: "getClaim",
    args: claimId !== undefined ? [claimId] : undefined,
    query: {
      enabled: claimId !== undefined,
    },
  });

  type ClaimData = {
    bountyTokenId: bigint;
    finder: `0x${string}`;
    proofHash: string;
    submittedAt: bigint;
    confirmed: boolean;
    rejected: boolean;
  };

  return {
    claim: data as ClaimData | undefined,
    isError,
    isLoading,
    refetch,
  };
}

/**
 * Hook for getting all claims for a bounty
 */
export function useGetBountyClaims(tokenId: bigint | undefined) {
  const { data, isError, isLoading, refetch } = useReadContract({
    address: FINDCHAIN_CONTRACT_ADDRESS,
    abi: FINDCHAIN_ABI,
    functionName: "getBountyClaims",
    args: tokenId !== undefined ? [tokenId] : undefined,
    query: {
      enabled: tokenId !== undefined,
    },
  });

  return {
    claimIds: data as bigint[] | undefined,
    isError,
    isLoading,
    refetch,
  };
}

