// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {TalentVaultToken} from "../contracts/TalentVaultToken.sol";
import {ProjectRegistry} from "../contracts/ProjectRegistry.sol";
import {FundingPool} from "../contracts/FundingPool.sol";

contract DeployScript is Script {
    function run() external {
        // Load private key from environment (as uint256)
        uint256 deployerPrivateKey = uint256(vm.envBytes32("PRIVATE_KEY"));
        
        vm.startBroadcast(deployerPrivateKey);

        console.log("Deploying Monad Idol contracts...");
        console.log("Deployer:", vm.addr(deployerPrivateKey));

        // 1. Deploy TalentVaultToken
        console.log("\nDeploying TalentVaultToken...");
        TalentVaultToken token = new TalentVaultToken();
        console.log("TalentVaultToken deployed to:", address(token));

        // 2. Deploy ProjectRegistry
        console.log("\nDeploying ProjectRegistry...");
        ProjectRegistry registry = new ProjectRegistry();
        console.log("ProjectRegistry deployed to:", address(registry));

        // 3. Deploy FundingPool
        console.log("\nDeploying FundingPool...");
        FundingPool fundingPool = new FundingPool(address(token), address(registry));
        console.log("FundingPool deployed to:", address(fundingPool));

        // 4. Initial setup
        console.log("\nSetting up initial configuration...");
        
        // Mint tokens for testing
        uint256 mintAmount = 100_000 * 10**18; // 100k tokens
        token.mint(vm.addr(deployerPrivateKey), mintAmount);
        console.log("Minted 100,000 TVT tokens to deployer");

        // Approve FundingPool
        token.approve(address(fundingPool), 50_000 * 10**18);
        console.log("Approved FundingPool to spend tokens");

        // Deposit to funding pool
        fundingPool.depositToPool(10_000 * 10**18);
        console.log("Deposited 10,000 TVT to funding pool");

        vm.stopBroadcast();

        // Print summary
        console.log("\n========================================");
        console.log("DEPLOYMENT COMPLETE!");
        console.log("========================================");
        console.log("\nContract Addresses:");
        console.log("TalentVaultToken:", address(token));
        console.log("ProjectRegistry:", address(registry));
        console.log("FundingPool:", address(fundingPool));
        console.log("\nSave these to your .env file:");
        console.log("TALENT_VAULT_TOKEN_ADDRESS=%s", address(token));
        console.log("PROJECT_REGISTRY_ADDRESS=%s", address(registry));
        console.log("FUNDING_POOL_ADDRESS=%s", address(fundingPool));
        console.log("========================================");
    }
}
