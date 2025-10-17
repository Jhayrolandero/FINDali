import { useEffect, useState } from "react";
import { FINDCHAIN_CONTRACT_ADDRESS, FINDCHAIN_ABI } from "../contract";
import { usePublicClient } from "wagmi";

export interface Claim {
  claimId: number;
  bountyTokenId: number;
  finder: string;
  proofHash: string;
  submittedAt: number;
  confirmed: boolean;
  rejected: boolean;
}

export interface OpenClaim {
  claimId: number;
  openBountyId: number;
  finder: string;
  proofHash: string;
  submittedAt: number;
  confirmed: boolean;
  rejected: boolean;
}

/**
 * Hook to fetch all claims for a specific NFT bounty
 */
export function useBountyClaims(tokenId: number | undefined) {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const client = usePublicClient();

  useEffect(() => {
    async function fetchClaims() {
      if (!client || tokenId === undefined) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Get all claim IDs for this bounty
        const claimIds = (await client.readContract({
          address: FINDCHAIN_CONTRACT_ADDRESS as `0x${string}`,
          abi: FINDCHAIN_ABI,
          functionName: "getBountyClaims",
          args: [BigInt(tokenId)],
        })) as bigint[];

        // Fetch details for each claim
        const claimPromises = claimIds.map(async (claimId) => {
          const claim = (await client.readContract({
            address: FINDCHAIN_CONTRACT_ADDRESS as `0x${string}`,
            abi: FINDCHAIN_ABI,
            functionName: "getClaim",
            args: [claimId],
          })) as any;

          return {
            claimId: Number(claimId),
            bountyTokenId: Number(claim.bountyTokenId),
            finder: claim.finder,
            proofHash: claim.proofHash,
            submittedAt: Number(claim.submittedAt),
            confirmed: claim.confirmed,
            rejected: claim.rejected,
          };
        });

        const fetchedClaims = await Promise.all(claimPromises);
        setClaims(fetchedClaims);
      } catch (err) {
        console.error("Error fetching claims:", err);
        setClaims([]);
      }
      setLoading(false);
    }

    fetchClaims();
  }, [client, tokenId]);

  return { claims, loading };
}

/**
 * Hook to fetch all claims for a specific open bounty
 */
export function useOpenBountyClaims(bountyId: number | undefined) {
  const [claims, setClaims] = useState<OpenClaim[]>([]);
  const [loading, setLoading] = useState(true);
  const client = usePublicClient();

  useEffect(() => {
    async function fetchClaims() {
      if (!client || bountyId === undefined) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Get all claim IDs for this open bounty
        const claimIds = (await client.readContract({
          address: FINDCHAIN_CONTRACT_ADDRESS as `0x${string}`,
          abi: FINDCHAIN_ABI,
          functionName: "getOpenBountyClaims",
          args: [BigInt(bountyId)],
        })) as bigint[];

        // Fetch details for each claim
        const claimPromises = claimIds.map(async (claimId) => {
          const claim = (await client.readContract({
            address: FINDCHAIN_CONTRACT_ADDRESS as `0x${string}`,
            abi: FINDCHAIN_ABI,
            functionName: "getOpenClaim",
            args: [claimId],
          })) as any;

          return {
            claimId: Number(claimId),
            openBountyId: Number(claim.openBountyId),
            finder: claim.finder,
            proofHash: claim.proofHash,
            submittedAt: Number(claim.submittedAt),
            confirmed: claim.confirmed,
            rejected: claim.rejected,
          };
        });

        const fetchedClaims = await Promise.all(claimPromises);
        setClaims(fetchedClaims);
      } catch (err) {
        console.error("Error fetching open claims:", err);
        setClaims([]);
      }
      setLoading(false);
    }

    fetchClaims();
  }, [client, bountyId]);

  return { claims, loading };
}

/**
 * Hook to fetch all claims for all bounties owned by a user
 */
export function useUserBountyClaims(tokenIds: number[]) {
  const [claimsByToken, setClaimsByToken] = useState<Record<number, Claim[]>>(
    {}
  );
  const [loading, setLoading] = useState(true);
  const client = usePublicClient();

  useEffect(() => {
    async function fetchAllClaims() {
      if (!client || tokenIds.length === 0) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const results: Record<number, Claim[]> = {};

        // Fetch claims for each token
        await Promise.all(
          tokenIds.map(async (tokenId) => {
            try {
              // Get all claim IDs for this bounty
              const claimIds = (await client.readContract({
                address: FINDCHAIN_CONTRACT_ADDRESS as `0x${string}`,
                abi: FINDCHAIN_ABI,
                functionName: "getBountyClaims",
                args: [BigInt(tokenId)],
              })) as bigint[];

              // Fetch details for each claim
              const claimPromises = claimIds.map(async (claimId) => {
                const claim = (await client.readContract({
                  address: FINDCHAIN_CONTRACT_ADDRESS as `0x${string}`,
                  abi: FINDCHAIN_ABI,
                  functionName: "getClaim",
                  args: [claimId],
                })) as any;

                return {
                  claimId: Number(claimId),
                  bountyTokenId: Number(claim.bountyTokenId),
                  finder: claim.finder,
                  proofHash: claim.proofHash,
                  submittedAt: Number(claim.submittedAt),
                  confirmed: claim.confirmed,
                  rejected: claim.rejected,
                };
              });

              results[tokenId] = await Promise.all(claimPromises);
            } catch (err) {
              console.error(`Error fetching claims for token ${tokenId}:`, err);
              results[tokenId] = [];
            }
          })
        );

        setClaimsByToken(results);
      } catch (err) {
        console.error("Error fetching all claims:", err);
        setClaimsByToken({});
      }
      setLoading(false);
    }

    fetchAllClaims();
  }, [client, JSON.stringify(tokenIds)]);

  return { claimsByToken, loading };
}

