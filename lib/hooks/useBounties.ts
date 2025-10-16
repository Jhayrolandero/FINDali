import { useEffect, useState } from "react";
import { FINDCHAIN_CONTRACT_ADDRESS, FINDCHAIN_ABI } from "../contract";
import { usePublicClient } from "wagmi";
import { formatEther } from "viem";

export interface Bounty {
  tokenId: number;
  amount: string;
  owner: string;
  createdAt: number;
  active: boolean;
  location: string;
  details: string;
  isNFTVerified: boolean;
  deviceInfo?: {
    brand: string;
    model: string;
    modelName: string;
  };
}

export function useBounties() {
  const [bounties, setBounties] = useState<Bounty[]>([]);
  const [loading, setLoading] = useState(true);
  const client = usePublicClient();

  useEffect(() => {
    async function fetchBounties() {
      if (!client) return;

      setLoading(true);
      try {
        // Get total NFT count to iterate through all possible tokenIds
        // For now, we'll check the first 100 tokenIds for bounties
        const maxTokenId = 100;
        const bountyPromises = [];

        for (let i = 0; i < maxTokenId; i++) {
          bountyPromises.push(
            client
              .readContract({
                address: FINDCHAIN_CONTRACT_ADDRESS as `0x${string}`,
                abi: FINDCHAIN_ABI,
                functionName: "getBounty",
                args: [BigInt(i)],
              })
              .catch(() => null) // Return null if bounty doesn't exist
          );
        }

        const results = await Promise.all(bountyPromises);

        const activeBounties: Bounty[] = results
          .map((result: any, tokenId: number) => {
            if (!result || !result.active) return null;

            return {
              tokenId,
              amount: formatEther(result.amount),
              owner: result.owner,
              createdAt: Number(result.createdAt),
              active: result.active,
              location: result.location || "",
              details: result.details || "",
              isNFTVerified: true, // All bounties are NFT-verified
            };
          })
          .filter((bounty): bounty is Bounty => bounty !== null);

        // Fetch device info for each bounty
        const bountiesWithDeviceInfo = await Promise.all(
          activeBounties.map(async (bounty) => {
            try {
              // Get IMEI from contract
              const imei = await client.readContract({
                address: FINDCHAIN_CONTRACT_ADDRESS as `0x${string}`,
                abi: FINDCHAIN_ABI,
                functionName: "getTokenIMEI",
                args: [BigInt(bounty.tokenId)],
              });

              // Fetch device info from API
              const response = await fetch(`/api/device-info?imei=${imei}`);

              if (response.ok) {
                const data = await response.json();
                return {
                  ...bounty,
                  deviceInfo: {
                    brand: data.brand || "Unknown",
                    model: data.model || "Unknown",
                    modelName: data.modelName || "Unknown Device",
                  },
                };
              }
            } catch (error) {
              console.error(
                `Error fetching device info for token ${bounty.tokenId}:`,
                error
              );
            }
            return bounty;
          })
        );

        setBounties(bountiesWithDeviceInfo);
      } catch (err) {
        console.error("Error fetching bounties:", err);
        setBounties([]);
      }
      setLoading(false);
    }

    fetchBounties();
  }, [client]);

  return { bounties, loading };
}
