# Quick Setup Guide

## Getting Started with New Features

### 1. Environment Setup

Add your Pinata API key to `.env.local`:

```bash
NEXT_PUBLIC_PINATA_JWT=your_pinata_jwt_token_here
```

**How to get Pinata JWT:**
1. Go to https://pinata.cloud
2. Sign up for free account
3. Navigate to API Keys section
4. Click "New Key"
5. Enable "pinFileToIPFS" and "pinJSONToIPFS" permissions
6. Copy the JWT token

### 2. Testing the Features

#### A. Report Found Feature

1. **Navigate to Browse Lost page** (`/browse-lost`)
2. **Connect your wallet**
3. **Find a bounty** you don't own
4. **Click "Report Found"** button
5. **Upload an image** (click the upload area)
6. **Write a description** of where you found it
7. **Click "Submit Claim"**
8. **Approve the transaction** in your wallet

**Expected Result:**
- Image uploaded to IPFS
- Metadata uploaded to IPFS
- Smart contract transaction submitted
- Modal closes on success

#### B. View Claims on My Devices

1. **Navigate to My Devices page** (`/my-devices`)
2. **Find a device** with an active bounty
3. **Scroll down** to see "Claims Submitted" section
4. **Review claim details**:
   - Claimant wallet address
   - Proof image from IPFS
   - Description
5. **Take action**:
   - Click "Confirm & Pay" to accept
   - Click "Reject" to decline

**Expected Result:**
- Claims display with images
- Confirmation sends bounty to finder
- Rejection marks claim as rejected

#### C. Contact Owner

1. **Navigate to Browse Lost page** (`/browse-lost`)
2. **Click "Contact"** on any bounty
3. **View social media links**
4. **Click a link** to open in new tab

**Expected Result:**
- Modal opens with social links
- Links are randomized per bounty
- Opens Twitter/Telegram/Facebook

---

## API Structure

### IPFS Upload Flow

```
1. User selects image + writes description
2. Frontend calls uploadClaimToIPFS(image, description)
3. Image uploaded to Pinata → returns hash1
4. Metadata JSON created: { image: hash1, description: "...", timestamp: ... }
5. Metadata uploaded to Pinata → returns hash2
6. Smart contract receives hash2
7. Later retrieval: fetch hash2 → get metadata → fetch hash1 → get image
```

### Claim Submission Flow

```
NFT Bounty:
User → IPFS Upload → submitClaim(tokenId, ipfsHash) → Contract

Open Bounty:
User → IPFS Upload → submitOpenClaim(bountyId, ipfsHash) → Contract
```

### Claim Retrieval Flow

```
My Devices Page Load:
1. Get user's devices
2. Filter devices with active bounties
3. For each bounty: getBountyClaims(tokenId)
4. For each claim: getClaim(claimId)
5. For each claim: fetchClaimFromIPFS(proofHash)
6. Display all data
```

---

## Troubleshooting

### IPFS Upload Fails

**Problem:** "Failed to upload to IPFS"

**Solutions:**
1. Check Pinata JWT is set correctly in `.env.local`
2. Verify Pinata account is active
3. Check API key permissions include file and JSON uploads
4. Try with smaller image file (< 5MB recommended)

### Claims Not Showing

**Problem:** Claims section doesn't appear

**Solutions:**
1. Ensure device has an active bounty
2. Check wallet is connected
3. Verify claims have been submitted for this bounty
4. Refresh the page

### Image Not Loading from IPFS

**Problem:** "Loading claim data..." never completes

**Solutions:**
1. Check IPFS gateway is accessible
2. Wait a few moments (IPFS can be slow initially)
3. Verify IPFS hash is valid
4. Check browser console for errors

### Transaction Fails

**Problem:** MetaMask transaction rejected

**Solutions:**
1. Ensure wallet has enough ETH for gas
2. Check you're on the correct network (Base Sepolia)
3. Verify contract address is correct
4. Try increasing gas limit

---

## Development Tips

### Testing Locally

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

### Viewing Smart Contract Events

After submitting a claim, check BaseScan:
1. Go to https://sepolia.basescan.org/
2. Search for your wallet address
3. View latest transactions
4. Check event logs for `ClaimSubmitted` or `OpenClaimSubmitted`

### Debugging IPFS

View uploaded content:
```
https://gateway.pinata.cloud/ipfs/YOUR_HASH_HERE
```

### Mock Data for Testing

If you want to test without IPFS:
1. Comment out IPFS upload calls
2. Use hardcoded hash: `"QmTest123..."`
3. Update `fetchClaimFromIPFS` to return mock data

---

## Security Considerations

### Current Implementation:
- ✅ Owner verification (can't claim own bounty)
- ✅ Wallet authentication required
- ✅ Smart contract handles payment security
- ✅ IPFS provides immutable proof storage

### Production Recommendations:
1. **Rate Limiting**: Add API rate limits for IPFS uploads
2. **Image Validation**: Verify image content and size on upload
3. **Spam Prevention**: Consider requiring small deposit for claims
4. **Content Moderation**: Implement reporting system for inappropriate claims
5. **Privacy**: Consider encrypting sensitive claim data

---

## Performance Optimization

### Current Optimizations:
- Parallel fetching of claim data
- Conditional rendering (only load claims when needed)
- Error handling prevents infinite loading states

### Recommended Improvements:
```javascript
// Add pagination for claims
const CLAIMS_PER_PAGE = 10;

// Implement lazy loading for images
<img loading="lazy" ... />

// Cache IPFS responses
const ipfsCache = new Map();
```

---

## Support

For issues or questions:
1. Check browser console for errors
2. Verify all environment variables are set
3. Ensure smart contract is deployed correctly
4. Test with small amounts first

## Next Steps

After setup:
1. ✅ Test Report Found on testnets
2. ✅ Submit a few test claims
3. ✅ Practice confirming/rejecting claims
4. ✅ Verify IPFS data persists
5. 🚀 Deploy to production when ready!

