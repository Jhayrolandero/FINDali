// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FindChain is ERC721, Ownable {
    // Custom errors (saves gas and bytecode)
    error NotDeviceOwner();
    error InvalidAmount();
    error BountyNotActive();
    error BountyAlreadyActive();
    error ProofRequired();
    error NotBountyOwner();
    error ClaimAlreadyConfirmed();
    error ClaimAlreadyRejected();
    error DescriptionRequired();
    error InvalidIMEI();
    error IMEIAlreadyRegistered();
    error ListingNotFound();
    error NotListingOwner();
    error ListingAlreadyClaimed();
    error CannotClaimOwnListing();

    // State variables
    uint256 private _nextTokenId;
    uint256 private _nextClaimId;
    uint256 private _nextOpenBountyId;
    uint256 private _nextFoundListingId;
    uint256 private _nextOpenClaimId;
    
    mapping(uint256 => string) private _tokenToIMEI;
    mapping(string => bool) private _imeiRegistered;
    mapping(uint256 => Bounty) private _bounties;
    mapping(uint256 => Claim) private _claims;
    mapping(uint256 => uint256[]) private _bountyToClaims;
    
    // New mappings for open system
    mapping(uint256 => OpenBounty) private _openBounties;
    mapping(uint256 => OpenClaim) private _openClaims;
    mapping(uint256 => uint256[]) private _openBountyToClaims;
    mapping(uint256 => FoundListing) private _foundListings;

    // Structs
    struct Bounty {
        uint256 amount;
        address owner;
        uint256 createdAt;
        bool active;
        string location;
        string details;
    }

    struct Claim {
        uint256 bountyTokenId;
        address finder;
        string proofHash;
        uint256 submittedAt;
        bool confirmed;
        bool rejected;
    }
    
    // Open bounty for devices without NFT
    struct OpenBounty {
        uint256 id;
        string deviceDescription;
        uint256 amount;
        address owner;
        uint256 createdAt;
        bool active;
    }
    
    // Claims for open bounties
    struct OpenClaim {
        uint256 openBountyId;
        address finder;
        string proofHash;
        uint256 submittedAt;
        bool confirmed;
        bool rejected;
    }
    
    // Found device listing (standalone posts by finders)
    struct FoundListing {
        uint256 id;
        string deviceDescription;  // What finder observes
        string proofHash;  // Photos, location proof
        address finder;
        uint256 submittedAt;
        bool claimed;
        address claimedBy;  // Owner who claimed it
        uint256 rewardAmount;  // Reward paid by owner
    }

//General FLOW
    // Open bounty
    // Claim you found it => Send proof you found it (image, etc.)
    // Bounty maker can see all claims + details (incl. wallet address)

    // If XTMP, you can immediately start a safe conversation, anonymous
    // Other options incl. sharing social media, linked to wallet address

    // If meetup is done and return has been confirmed, release the bounty.


//NFT System

    
    // Events
    event DeviceMinted(uint256 indexed tokenId, string imei, address indexed owner);
    event DeviceTransferred(uint256 indexed tokenId, address indexed from, address indexed to);
    event BountyCreated(uint256 indexed tokenId, address indexed owner, uint256 amount);
    event ClaimSubmitted(uint256 indexed claimId, uint256 indexed tokenId, address indexed finder);
    event ClaimConfirmed(uint256 indexed claimId, uint256 indexed tokenId, address indexed finder, uint256 amount);
    event ClaimRejected(uint256 indexed claimId, uint256 indexed tokenId);
    event BountyCancelled(uint256 indexed tokenId, address indexed owner, uint256 amount);
    
    // New events for open system
    event OpenBountyCreated(uint256 indexed bountyId, address indexed owner, uint256 amount, string description);
    event OpenBountyCancelled(uint256 indexed bountyId, address indexed owner, uint256 amount);
    event OpenClaimSubmitted(uint256 indexed claimId, uint256 indexed bountyId, address indexed finder);
    event OpenClaimConfirmed(uint256 indexed claimId, uint256 indexed bountyId, address indexed finder, uint256 amount);
    event OpenClaimRejected(uint256 indexed claimId, uint256 indexed bountyId);
    event FoundListingCreated(uint256 indexed listingId, address indexed finder, string description);
    event FoundListingRemoved(uint256 indexed listingId, address indexed finder);
    event FoundListingClaimed(uint256 indexed listingId, address indexed owner, address indexed finder, uint256 reward);

    constructor()
        ERC721("FindChain", "FIND")
        Ownable(msg.sender)
    {
        _nextTokenId = 0;
        _nextClaimId = 0;
        _nextOpenBountyId = 0;
        _nextFoundListingId = 0;
        _nextOpenClaimId = 0;
    }

    // Bounty functions
    function createBounty(uint256 tokenId, string memory location, string memory details) public payable {
        if(_ownerOf(tokenId) != msg.sender) revert NotDeviceOwner();
        if(msg.value == 0) revert InvalidAmount();
        if(_bounties[tokenId].active) revert BountyAlreadyActive();

        _bounties[tokenId] = Bounty({
            amount: msg.value,
            owner: msg.sender,
            createdAt: block.timestamp,
            active: true,
            location: location,
            details: details
        });

        emit BountyCreated(tokenId, msg.sender, msg.value);
    }

    function submitClaim(uint256 tokenId, string memory proofHash) public returns (uint256) {
        if(!_bounties[tokenId].active) revert BountyNotActive();
        if(bytes(proofHash).length == 0) revert ProofRequired();

        uint256 claimId = _nextClaimId++;
        
        _claims[claimId] = Claim({
            bountyTokenId: tokenId,
            finder: msg.sender,
            proofHash: proofHash,
            submittedAt: block.timestamp,
            confirmed: false,
            rejected: false
        });

        _bountyToClaims[tokenId].push(claimId);

        emit ClaimSubmitted(claimId, tokenId, msg.sender);
        return claimId;
    }

    function confirmClaim(uint256 claimId) public {
        Claim storage claim = _claims[claimId];
        Bounty storage bountyData = _bounties[claim.bountyTokenId];

        if(!bountyData.active) revert BountyNotActive();
        if(bountyData.owner != msg.sender) revert NotBountyOwner();
        if(claim.confirmed) revert ClaimAlreadyConfirmed();
        if(claim.rejected) revert ClaimAlreadyRejected();

        claim.confirmed = true;
        bountyData.active = false;

        payable(claim.finder).transfer(bountyData.amount);

        emit ClaimConfirmed(claimId, claim.bountyTokenId, claim.finder, bountyData.amount);
    }

    function rejectClaim(uint256 claimId) public {
        Claim storage claim = _claims[claimId];
        Bounty storage bountyData = _bounties[claim.bountyTokenId];

        if(!bountyData.active) revert BountyNotActive();
        if(bountyData.owner != msg.sender) revert NotBountyOwner();
        if(claim.confirmed) revert ClaimAlreadyConfirmed();
        if(claim.rejected) revert ClaimAlreadyRejected();

        claim.rejected = true;

        emit ClaimRejected(claimId, claim.bountyTokenId);
    }

    function cancelBounty(uint256 tokenId) public {
        Bounty storage bountyData = _bounties[tokenId];
        
        if(!bountyData.active) revert BountyNotActive();
        if(bountyData.owner != msg.sender) revert NotBountyOwner();

        bountyData.active = false;
        payable(bountyData.owner).transfer(bountyData.amount);

        emit BountyCancelled(tokenId, msg.sender, bountyData.amount);
    }

    // Open Bounty functions (for devices without NFT)
    function createOpenBounty(string memory deviceDescription) public payable returns (uint256) {
        if(bytes(deviceDescription).length == 0) revert DescriptionRequired();
        if(msg.value == 0) revert InvalidAmount();

        uint256 bountyId = _nextOpenBountyId++;
        
        _openBounties[bountyId] = OpenBounty({
            id: bountyId,
            deviceDescription: deviceDescription,
            amount: msg.value,
            owner: msg.sender,
            createdAt: block.timestamp,
            active: true
        });

        emit OpenBountyCreated(bountyId, msg.sender, msg.value, deviceDescription);
        return bountyId;
    }

    function cancelOpenBounty(uint256 bountyId) public {
        OpenBounty storage bounty = _openBounties[bountyId];
        
        if(!bounty.active) revert BountyNotActive();
        if(bounty.owner != msg.sender) revert NotBountyOwner();

        bounty.active = false;
        payable(bounty.owner).transfer(bounty.amount);

        emit OpenBountyCancelled(bountyId, msg.sender, bounty.amount);
    }

    // Open Claim functions (for open bounties)
    function submitOpenClaim(uint256 bountyId, string memory proofHash) public returns (uint256) {
        if(!_openBounties[bountyId].active) revert BountyNotActive();
        if(bytes(proofHash).length == 0) revert ProofRequired();

        uint256 claimId = _nextOpenClaimId++;
        
        _openClaims[claimId] = OpenClaim({
            openBountyId: bountyId,
            finder: msg.sender,
            proofHash: proofHash,
            submittedAt: block.timestamp,
            confirmed: false,
            rejected: false
        });

        _openBountyToClaims[bountyId].push(claimId);

        emit OpenClaimSubmitted(claimId, bountyId, msg.sender);
        return claimId;
    }

    function confirmOpenClaim(uint256 claimId) public {
        OpenClaim storage claim = _openClaims[claimId];
        OpenBounty storage bounty = _openBounties[claim.openBountyId];

        if(!bounty.active) revert BountyNotActive();
        if(bounty.owner != msg.sender) revert NotBountyOwner();
        if(claim.confirmed) revert ClaimAlreadyConfirmed();
        if(claim.rejected) revert ClaimAlreadyRejected();

        claim.confirmed = true;
        bounty.active = false;

        payable(claim.finder).transfer(bounty.amount);

        emit OpenClaimConfirmed(claimId, claim.openBountyId, claim.finder, bounty.amount);
    }

    function rejectOpenClaim(uint256 claimId) public {
        OpenClaim storage claim = _openClaims[claimId];
        OpenBounty storage bounty = _openBounties[claim.openBountyId];

        if(!bounty.active) revert BountyNotActive();
        if(bounty.owner != msg.sender) revert NotBountyOwner();
        if(claim.confirmed) revert ClaimAlreadyConfirmed();
        if(claim.rejected) revert ClaimAlreadyRejected();

        claim.rejected = true;

        emit OpenClaimRejected(claimId, claim.openBountyId);
    }

    // Found Listing functions (for finders)
    function createFoundListing(string memory deviceDescription, string memory proofHash) public returns (uint256) {
        if(bytes(deviceDescription).length == 0) revert DescriptionRequired();
        if(bytes(proofHash).length == 0) revert ProofRequired();

        uint256 listingId = _nextFoundListingId++;
        
        _foundListings[listingId] = FoundListing({
            id: listingId,
            deviceDescription: deviceDescription,
            proofHash: proofHash,
            finder: msg.sender,
            submittedAt: block.timestamp,
            claimed: false,
            claimedBy: address(0),
            rewardAmount: 0
        });

        emit FoundListingCreated(listingId, msg.sender, deviceDescription);
        return listingId;
    }

    function removeFoundListing(uint256 listingId) public {
        FoundListing storage listing = _foundListings[listingId];
        
        if(listing.finder != msg.sender) revert NotListingOwner();
        if(listing.claimed) revert ListingAlreadyClaimed();

        listing.claimed = true;

        emit FoundListingRemoved(listingId, msg.sender);
    }

    // Owner claims a found listing (with optional reward)
    function claimFoundListing(uint256 listingId) public payable {
        FoundListing storage listing = _foundListings[listingId];
        
        if(listing.claimed) revert ListingAlreadyClaimed();
        if(msg.sender == listing.finder) revert CannotClaimOwnListing();

        listing.claimed = true;
        listing.claimedBy = msg.sender;
        listing.rewardAmount = msg.value;

        if (msg.value > 0) {
            payable(listing.finder).transfer(msg.value);
        }

        emit FoundListingClaimed(listingId, msg.sender, listing.finder, msg.value);
    }

    // NFT functions
    function mintDevice(string memory imei) public returns (uint256) {
        if(bytes(imei).length != 15) revert InvalidIMEI();
        if(_imeiRegistered[imei]) revert IMEIAlreadyRegistered();

        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);
        _tokenToIMEI[tokenId] = imei;
        _imeiRegistered[imei] = true;
        
        emit DeviceMinted(tokenId, imei, msg.sender);
        return tokenId;
    }

    function transferDevice(uint256 tokenId, address to) public {
        if(_ownerOf(tokenId) != msg.sender) revert NotDeviceOwner();
        _transfer(msg.sender, to, tokenId);
        emit DeviceTransferred(tokenId, msg.sender, to);
    }

    // view stuffs and whatever
    function isIMEIRegistered(string memory imei) public view returns (bool) {
        return _imeiRegistered[imei];
    }

    function getBounty(uint256 tokenId) public view returns (Bounty memory) {
        return _bounties[tokenId];
    }

    function getClaim(uint256 claimId) public view returns (Claim memory) {
        return _claims[claimId];
    }

    function getBountyClaims(uint256 tokenId) public view returns (uint256[] memory) {
        return _bountyToClaims[tokenId];
    }

    function getTokenIMEI(uint256 tokenId) public view returns (string memory) {
        return _tokenToIMEI[tokenId];
    }

    // View functions for open system
    function getOpenBounty(uint256 bountyId) public view returns (OpenBounty memory) {
        return _openBounties[bountyId];
    }

    function getOpenClaim(uint256 claimId) public view returns (OpenClaim memory) {
        return _openClaims[claimId];
    }

    function getOpenBountyClaims(uint256 bountyId) public view returns (uint256[] memory) {
        return _openBountyToClaims[bountyId];
    }

    function getFoundListing(uint256 listingId) public view returns (FoundListing memory) {
        return _foundListings[listingId];
    }

    function getTotalOpenBounties() public view returns (uint256) {
        return _nextOpenBountyId;
    }

    function getTotalFoundListings() public view returns (uint256) {
        return _nextFoundListingId;
    }

    function getTotalOpenClaims() public view returns (uint256) {
        return _nextOpenClaimId;
    }
}