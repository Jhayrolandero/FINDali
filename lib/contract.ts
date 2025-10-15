// FindChain Smart Contract Configuration
// Replace this address with your deployed contract address
export const FINDCHAIN_CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000" as const;

// Complete FindChain Contract ABI
export const FINDCHAIN_ABI = [
  // NFT Functions
  {
    inputs: [{ internalType: "string", name: "imei", type: "string" }],
    name: "mintDevice",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "tokenId", type: "uint256" },
      { internalType: "address", name: "to", type: "address" },
    ],
    name: "transferDevice",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  // Bounty Functions
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "createBounty",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "tokenId", type: "uint256" },
      { internalType: "string", name: "proofHash", type: "string" },
    ],
    name: "submitClaim",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "claimId", type: "uint256" }],
    name: "confirmClaim",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "claimId", type: "uint256" }],
    name: "rejectClaim",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "cancelBounty",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  // Open Bounty Functions
  {
    inputs: [{ internalType: "string", name: "deviceDescription", type: "string" }],
    name: "createOpenBounty",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "bountyId", type: "uint256" }],
    name: "cancelOpenBounty",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "bountyId", type: "uint256" },
      { internalType: "string", name: "proofHash", type: "string" },
    ],
    name: "submitOpenClaim",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "claimId", type: "uint256" }],
    name: "confirmOpenClaim",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "claimId", type: "uint256" }],
    name: "rejectOpenClaim",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  // Found Listing Functions
  {
    inputs: [
      { internalType: "string", name: "deviceDescription", type: "string" },
      { internalType: "string", name: "proofHash", type: "string" },
    ],
    name: "createFoundListing",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "listingId", type: "uint256" }],
    name: "removeFoundListing",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "listingId", type: "uint256" }],
    name: "claimFoundListing",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  // View Functions
  {
    inputs: [{ internalType: "string", name: "imei", type: "string" }],
    name: "isIMEIRegistered",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "getBounty",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "amount", type: "uint256" },
          { internalType: "address", name: "owner", type: "address" },
          { internalType: "uint256", name: "createdAt", type: "uint256" },
          { internalType: "bool", name: "active", type: "bool" },
        ],
        internalType: "struct FindChain.Bounty",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "claimId", type: "uint256" }],
    name: "getClaim",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "bountyTokenId", type: "uint256" },
          { internalType: "address", name: "finder", type: "address" },
          { internalType: "string", name: "proofHash", type: "string" },
          { internalType: "uint256", name: "submittedAt", type: "uint256" },
          { internalType: "bool", name: "confirmed", type: "bool" },
          { internalType: "bool", name: "rejected", type: "bool" },
        ],
        internalType: "struct FindChain.Claim",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "getBountyClaims",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "getTokenIMEI",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "bountyId", type: "uint256" }],
    name: "getOpenBounty",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "id", type: "uint256" },
          { internalType: "string", name: "deviceDescription", type: "string" },
          { internalType: "uint256", name: "amount", type: "uint256" },
          { internalType: "address", name: "owner", type: "address" },
          { internalType: "uint256", name: "createdAt", type: "uint256" },
          { internalType: "bool", name: "active", type: "bool" },
        ],
        internalType: "struct FindChain.OpenBounty",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "claimId", type: "uint256" }],
    name: "getOpenClaim",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "openBountyId", type: "uint256" },
          { internalType: "address", name: "finder", type: "address" },
          { internalType: "string", name: "proofHash", type: "string" },
          { internalType: "uint256", name: "submittedAt", type: "uint256" },
          { internalType: "bool", name: "confirmed", type: "bool" },
          { internalType: "bool", name: "rejected", type: "bool" },
        ],
        internalType: "struct FindChain.OpenClaim",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "bountyId", type: "uint256" }],
    name: "getOpenBountyClaims",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "listingId", type: "uint256" }],
    name: "getFoundListing",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "id", type: "uint256" },
          { internalType: "string", name: "deviceDescription", type: "string" },
          { internalType: "string", name: "proofHash", type: "string" },
          { internalType: "address", name: "finder", type: "address" },
          { internalType: "uint256", name: "submittedAt", type: "uint256" },
          { internalType: "bool", name: "claimed", type: "bool" },
          { internalType: "address", name: "claimedBy", type: "address" },
          { internalType: "uint256", name: "rewardAmount", type: "uint256" },
        ],
        internalType: "struct FindChain.FoundListing",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTotalOpenBounties",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTotalFoundListings",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTotalOpenClaims",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  // ERC721 Standard Functions
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "ownerOf",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "tokenId", type: "uint256" },
      { indexed: false, internalType: "string", name: "imei", type: "string" },
      { indexed: true, internalType: "address", name: "owner", type: "address" },
    ],
    name: "DeviceMinted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "tokenId", type: "uint256" },
      { indexed: true, internalType: "address", name: "owner", type: "address" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "BountyCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "claimId", type: "uint256" },
      { indexed: true, internalType: "uint256", name: "tokenId", type: "uint256" },
      { indexed: true, internalType: "address", name: "finder", type: "address" },
    ],
    name: "ClaimSubmitted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "bountyId", type: "uint256" },
      { indexed: true, internalType: "address", name: "owner", type: "address" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
      { indexed: false, internalType: "string", name: "description", type: "string" },
    ],
    name: "OpenBountyCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "listingId", type: "uint256" },
      { indexed: true, internalType: "address", name: "finder", type: "address" },
      { indexed: false, internalType: "string", name: "description", type: "string" },
    ],
    name: "FoundListingCreated",
    type: "event",
  },
] as const;

