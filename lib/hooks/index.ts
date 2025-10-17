/**
 * Central export for all custom hooks
 */

// NFT Operations
export { useMintDevice } from "./useNFTOperations";
export { useTransferDevice } from "./useNFTOperations";
export { useCheckIMEI } from "./useNFTOperations";
export { useTokenOwner } from "./useNFTOperations";
export { useDeviceBalance } from "./useNFTOperations";
export { useTokenIMEI } from "./useNFTOperations";
export { useUserDevices } from "./useNFTOperations";

// Bounty Operations
export { useCreateBounty } from "./useBountyOperations";
export { useSubmitClaim } from "./useBountyOperations";
export { useConfirmClaim } from "./useBountyOperations";
export { useRejectClaim } from "./useBountyOperations";
export { useCancelBounty } from "./useBountyOperations";
export { useGetBounty } from "./useBountyOperations";
export { useGetClaim } from "./useBountyOperations";
export { useGetBountyClaims } from "./useBountyOperations";

// Open Bounty Operations
export { useCreateOpenBounty } from "./useOpenBountyOperations";
export { useCancelOpenBounty } from "./useOpenBountyOperations";
export { useSubmitOpenClaim } from "./useOpenBountyOperations";
export { useConfirmOpenClaim } from "./useOpenBountyOperations";
export { useRejectOpenClaim } from "./useOpenBountyOperations";
export { useGetOpenBounty } from "./useOpenBountyOperations";
export { useGetOpenClaim } from "./useOpenBountyOperations";
export { useGetOpenBountyClaims } from "./useOpenBountyOperations";
export { useGetTotalOpenBounties } from "./useOpenBountyOperations";
export { useGetTotalOpenClaims } from "./useOpenBountyOperations";

// Found Listing Operations
export { useCreateFoundListing } from "./useFoundListingOperations";
export { useRemoveFoundListing } from "./useFoundListingOperations";
export { useClaimFoundListing } from "./useFoundListingOperations";
export { useFoundListings } from "./useFoundListingOperations";
export { useGetTotalFoundListings } from "./useFoundListingOperations";

// Enhanced Device Operations with Metadata
export { useUserDevicesWithMetadata } from "./useUserDevicesWithMetadata";

// Device Bounty Status
export { useDeviceBounties } from "./useDeviceBounties";

// Bounty Claims
export { useBountyClaims, useOpenBountyClaims, useUserBountyClaims } from "./useBountyClaims";

// Bounties (all active bounties)
export { useBounties } from "./useBounties";