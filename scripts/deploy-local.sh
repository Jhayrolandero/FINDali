#!/bin/bash

# Color output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=====================================${NC}"
echo -e "${BLUE}  FindChain Local Deployment Script ${NC}"
echo -e "${BLUE}=====================================${NC}\n"

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo -e "${YELLOW}No .env.local found. Creating from example...${NC}"
    if [ -f .env.local.example ]; then
        cp .env.local.example .env.local
    else
        # Create a basic .env.local with Anvil defaults
        cat > .env.local << EOF
# Anvil Default Account #0 Private Key (DO NOT USE IN PRODUCTION!)
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

# Deployed Contract Address (will be updated after deployment)
NEXT_PUBLIC_FINDCHAIN_CONTRACT_ADDRESS=

# Enable local chain
NEXT_PUBLIC_USE_LOCAL_CHAIN=true

# OnchainKit API Key (optional for local development)
NEXT_PUBLIC_ONCHAINKIT_API_KEY=
EOF
    fi
    echo -e "${GREEN}Created .env.local${NC}\n"
fi

# Load and export environment variables
set -a  # automatically export all variables
source .env.local
set +a  # stop automatically exporting

# Check if Anvil is running
if ! nc -z localhost 8545 2>/dev/null; then
    echo -e "${RED}Anvil is not running on localhost:8545${NC}"
    echo -e "${YELLOW}Please start Anvil in another terminal:${NC}"
    echo -e "${BLUE}  anvil${NC}\n"
    exit 1
fi

echo -e "${GREEN}Anvil is running${NC}\n"

# Install OpenZeppelin contracts if not present
if [ ! -d "node_modules/@openzeppelin" ]; then
    echo -e "${YELLOW}Installing OpenZeppelin contracts...${NC}"
    npm install @openzeppelin/contracts
fi

# Deploy the contract
echo -e "${BLUE}Deploying FindChain contract to Anvil...${NC}\n"

DEPLOY_OUTPUT=$(forge script script/Deploy.s.sol:DeployScript \
    --rpc-url http://localhost:8545 \
    --broadcast \
    --private-key $PRIVATE_KEY 2>&1)

echo "$DEPLOY_OUTPUT"

# Extract contract address from deployment output
CONTRACT_ADDRESS=$(echo "$DEPLOY_OUTPUT" | grep -oE "FindChain deployed to: 0x[a-fA-F0-9]{40}" | grep -oE "0x[a-fA-F0-9]{40}")

if [ -z "$CONTRACT_ADDRESS" ]; then
    echo -e "\n${RED}Deployment failed or address not found${NC}"
    exit 1
fi

echo -e "\n${GREEN}Contract deployed successfully!${NC}"
echo -e "${GREEN}Address: ${CONTRACT_ADDRESS}${NC}\n"

# Update .env.local with the new contract address
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s|NEXT_PUBLIC_FINDCHAIN_CONTRACT_ADDRESS=.*|NEXT_PUBLIC_FINDCHAIN_CONTRACT_ADDRESS=${CONTRACT_ADDRESS}|" .env.local
else
    # Linux
    sed -i "s|NEXT_PUBLIC_FINDCHAIN_CONTRACT_ADDRESS=.*|NEXT_PUBLIC_FINDCHAIN_CONTRACT_ADDRESS=${CONTRACT_ADDRESS}|" .env.local
fi

echo -e "${GREEN}Updated .env.local with contract address${NC}\n"

# Update lib/contract.ts
echo -e "${BLUE}Updating lib/contract.ts...${NC}"
if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' "s|export const FINDCHAIN_CONTRACT_ADDRESS = \"0x[a-fA-F0-9]*\"|export const FINDCHAIN_CONTRACT_ADDRESS = \"${CONTRACT_ADDRESS}\"|" lib/contract.ts
else
    sed -i "s|export const FINDCHAIN_CONTRACT_ADDRESS = \"0x[a-fA-F0-9]*\"|export const FINDCHAIN_CONTRACT_ADDRESS = \"${CONTRACT_ADDRESS}\"|" lib/contract.ts
fi

echo -e "${GREEN}Updated lib/contract.ts${NC}\n"

echo -e "${BLUE}=====================================${NC}"
echo -e "${GREEN}Deployment Complete!${NC}"
echo -e "${BLUE}=====================================${NC}\n"

echo -e "${YELLOW}Next Steps:${NC}"
echo -e "1. Make sure your Next.js dev server is running: ${BLUE}npm run dev${NC}"
echo -e "2. Connect MetaMask to Localhost 8545"
echo -e "3. Import an Anvil account using one of the private keys shown when you started Anvil"
echo -e "\n${YELLOW}Default Anvil Account #0:${NC}"
echo -e "Address: ${BLUE}0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266${NC}"
echo -e "Private Key: ${BLUE}0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80${NC}"
echo -e "\n${GREEN}Happy Testing!${NC}\n"

