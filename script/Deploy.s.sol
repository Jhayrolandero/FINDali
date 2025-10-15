// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../contracts/FindChain.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);
        
        FindChain findChain = new FindChain();
        
        console.log("FindChain deployed to:", address(findChain));
        
        vm.stopBroadcast();
    }
}

