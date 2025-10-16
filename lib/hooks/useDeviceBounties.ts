import { useEffect, useState } from "react";
import { usePublicClient } from "wagmi";
import { FINDCHAIN_CONTRACT_ADDRESS, FINDCHAIN_ABI } from "@/lib/contract";

interface BountyStatus {
  hasActiveBounty: boolean;
  amount: string;
  location: string;
  details: string;
}

export function useDeviceBounties(tokenIds: string[]) {
  const [bountyStatuses, setBountyStatuses] = useState<
    Record<string, BountyStatus>
  >({});
  const [isLoading, setIsLoading] = useState(false);
  const publicClient = usePublicClient();

  useEffect(() => {
    const fetchBounties = async () => {
      if (!publicClient || tokenIds.length === 0) return;

      setIsLoading(true);
      const statuses: Record<string, BountyStatus> = {};

      try {
        for (const tokenId of tokenIds) {
          const bounty = (await publicClient.readContract({
            address: FINDCHAIN_CONTRACT_ADDRESS as `0x${string}`,
            abi: FINDCHAIN_ABI,
            functionName: "getBounty",
            args: [BigInt(tokenId)],
          })) as any;

          statuses[tokenId] = {
            hasActiveBounty: bounty.active || false,
            amount: bounty.amount
              ? (Number(bounty.amount) / 1e18).toFixed(4)
              : "0",
            location: bounty.location || "",
            details: bounty.details || "",
          };
        }

        setBountyStatuses(statuses);
      } catch (error) {
        console.error("Error fetching bounties:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBounties();
  }, [publicClient, tokenIds.join(",")]);

  return { bountyStatuses, isLoading };
}
