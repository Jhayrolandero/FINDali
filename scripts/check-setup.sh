#!/bin/bash

# Color output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=====================================${NC}"
echo -e "${BLUE}  FindChain Setup Verification      ${NC}"
echo -e "${BLUE}=====================================${NC}\n"

ERRORS=0
WARNINGS=0

# Check Foundry installation
echo -e "${BLUE}Checking Foundry installation...${NC}"
if command -v forge &> /dev/null; then
    VERSION=$(forge --version | head -n 1)
    echo -e "${GREEN}✅ Foundry installed: ${VERSION}${NC}"
else
    echo -e "${RED}❌ Foundry not found${NC}"
    echo -e "${YELLOW}   Install: curl -L https://foundry.paradigm.xyz | bash && foundryup${NC}"
    ((ERRORS++))
fi

if command -v anvil &> /dev/null; then
    echo -e "${GREEN}✅ Anvil available${NC}"
else
    echo -e "${RED}❌ Anvil not found${NC}"
    ((ERRORS++))
fi
echo ""

# Check Node.js
echo -e "${BLUE}Checking Node.js...${NC}"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✅ Node.js: ${NODE_VERSION}${NC}"
else
    echo -e "${RED}❌ Node.js not found${NC}"
    ((ERRORS++))
fi

if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✅ npm: ${NPM_VERSION}${NC}"
else
    echo -e "${RED}❌ npm not found${NC}"
    ((ERRORS++))
fi
echo ""

# Check required files
echo -e "${BLUE}Checking project files...${NC}"

FILES=(
    "contracts/FindChain.sol"
    "script/Deploy.s.sol"
    "scripts/deploy-local.sh"
    "foundry.toml"
    "app/rootProvider.tsx"
    "lib/contract.ts"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ ${file}${NC}"
    else
        echo -e "${RED}❌ Missing: ${file}${NC}"
        ((ERRORS++))
    fi
done
echo ""

# Check dependencies
echo -e "${BLUE}Checking dependencies...${NC}"

if [ -d "node_modules/@openzeppelin/contracts" ]; then
    echo -e "${GREEN}✅ OpenZeppelin contracts installed${NC}"
else
    echo -e "${YELLOW}⚠️  OpenZeppelin contracts not found${NC}"
    echo -e "${YELLOW}   Run: npm install @openzeppelin/contracts${NC}"
    ((WARNINGS++))
fi

if [ -d "node_modules/wagmi" ]; then
    echo -e "${GREEN}✅ Wagmi installed${NC}"
else
    echo -e "${YELLOW}⚠️  Wagmi not found${NC}"
    echo -e "${YELLOW}   Run: npm install${NC}"
    ((WARNINGS++))
fi

if [ -d "lib/forge-std" ]; then
    echo -e "${GREEN}✅ Forge standard library installed${NC}"
else
    echo -e "${YELLOW}⚠️  Forge standard library not found${NC}"
    echo -e "${YELLOW}   Run: npm run foundry:install${NC}"
    ((WARNINGS++))
fi
echo ""

# Check Anvil status
echo -e "${BLUE}Checking Anvil status...${NC}"
if nc -z localhost 8545 2>/dev/null; then
    echo -e "${GREEN}✅ Anvil is running on localhost:8545${NC}"
    
    # Try to get chain ID
    if command -v cast &> /dev/null; then
        CHAIN_ID=$(cast chain-id --rpc-url http://localhost:8545 2>/dev/null)
        if [ "$CHAIN_ID" = "31337" ]; then
            echo -e "${GREEN}✅ Chain ID: 31337 (Anvil)${NC}"
        else
            echo -e "${YELLOW}⚠️  Unexpected Chain ID: ${CHAIN_ID}${NC}"
        fi
    fi
else
    echo -e "${YELLOW}⚠️  Anvil not running${NC}"
    echo -e "${YELLOW}   Start with: npm run anvil${NC}"
    ((WARNINGS++))
fi
echo ""

# Check .env.local
echo -e "${BLUE}Checking environment configuration...${NC}"
if [ -f ".env.local" ]; then
    echo -e "${GREEN}✅ .env.local exists${NC}"
    
    if grep -q "NEXT_PUBLIC_USE_LOCAL_CHAIN=true" .env.local; then
        echo -e "${GREEN}✅ Local chain enabled${NC}"
    else
        echo -e "${YELLOW}⚠️  Local chain not enabled${NC}"
        echo -e "${YELLOW}   Add: NEXT_PUBLIC_USE_LOCAL_CHAIN=true${NC}"
        ((WARNINGS++))
    fi
    
    if grep -q "NEXT_PUBLIC_FINDCHAIN_CONTRACT_ADDRESS=0x[0-9a-fA-F]\{40\}" .env.local; then
        ADDRESS=$(grep "NEXT_PUBLIC_FINDCHAIN_CONTRACT_ADDRESS" .env.local | cut -d'=' -f2)
        if [ "$ADDRESS" != "0x0000000000000000000000000000000000000000" ] && [ ! -z "$ADDRESS" ]; then
            echo -e "${GREEN}✅ Contract address set: ${ADDRESS}${NC}"
        else
            echo -e "${YELLOW}⚠️  Contract not deployed yet${NC}"
            echo -e "${YELLOW}   Run: npm run deploy:local${NC}"
            ((WARNINGS++))
        fi
    else
        echo -e "${YELLOW}⚠️  Contract address not set${NC}"
        ((WARNINGS++))
    fi
else
    echo -e "${YELLOW}⚠️  .env.local not found${NC}"
    echo -e "${YELLOW}   Will be created automatically on first deploy${NC}"
    ((WARNINGS++))
fi
echo ""

# Summary
echo -e "${BLUE}=====================================${NC}"
if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}🎉 Everything looks good!${NC}"
    echo -e "${GREEN}You're ready to test!${NC}\n"
    
    if ! nc -z localhost 8545 2>/dev/null; then
        echo -e "${YELLOW}Next steps:${NC}"
        echo -e "1. Start Anvil: ${BLUE}npm run anvil${NC}"
        echo -e "2. Deploy contract: ${BLUE}npm run deploy:local${NC}"
        echo -e "3. Start Next.js: ${BLUE}npm run dev${NC}"
    else
        echo -e "${YELLOW}Next steps:${NC}"
        echo -e "1. Deploy contract: ${BLUE}npm run deploy:local${NC}"
        echo -e "2. Start Next.js: ${BLUE}npm run dev${NC}"
    fi
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠️  Setup complete with ${WARNINGS} warning(s)${NC}"
    echo -e "${YELLOW}Review the warnings above and fix if needed${NC}"
else
    echo -e "${RED}❌ Found ${ERRORS} error(s) and ${WARNINGS} warning(s)${NC}"
    echo -e "${RED}Please fix the errors above before continuing${NC}"
fi
echo -e "${BLUE}=====================================${NC}\n"

echo -e "For help, see:"
echo -e "  • ${BLUE}TEST_NOW.md${NC} - Quick start"
echo -e "  • ${BLUE}SETUP_COMPLETE.md${NC} - What was set up"
echo -e "  • ${BLUE}ANVIL_TESTING_GUIDE.md${NC} - Full guide\n"

