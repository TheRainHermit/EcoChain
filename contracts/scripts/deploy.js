const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying EcoRewards contract...");

  // Get the ContractFactory and Signers here
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Deploy the contract
  const EcoRewards = await ethers.getContractFactory("EcoRewards");
  const ecoRewards = await EcoRewards.deploy();

  await ecoRewards.deployed();

  console.log("EcoRewards deployed to:", ecoRewards.address);
  console.log("Transaction hash:", ecoRewards.deployTransaction.hash);

  // Fund the contract with some ETH for rewards
  const fundAmount = ethers.utils.parseEther("10.0"); // 10 ETH
  console.log("Funding contract with 10 ETH...");
  
  const fundTx = await deployer.sendTransaction({
    to: ecoRewards.address,
    value: fundAmount,
  });

  await fundTx.wait();
  console.log("Contract funded successfully!");

  // Verify contract on Etherscan (for testnets/mainnet)
  if (network.name !== "hardhat" && network.name !== "localhost") {
    console.log("Waiting for block confirmations...");
    await ecoRewards.deployTransaction.wait(6);

    console.log("Verifying contract on Etherscan...");
    try {
      await hre.run("verify:verify", {
        address: ecoRewards.address,
        constructorArguments: [],
      });
      console.log("Contract verified successfully!");
    } catch (error) {
      console.log("Verification failed:", error.message);
    }
  }

  console.log("\n=== Deployment Summary ===");
  console.log("Contract Address:", ecoRewards.address);
  console.log("Deployer:", deployer.address);
  console.log("Network:", network.name);
  console.log("Gas Used:", ecoRewards.deployTransaction.gasLimit?.toString());
  console.log("==========================\n");

  // Save deployment info
  const deploymentInfo = {
    address: ecoRewards.address,
    deployer: deployer.address,
    network: network.name,
    transactionHash: ecoRewards.deployTransaction.hash,
    timestamp: new Date().toISOString(),
  };

  const fs = require("fs");
  fs.writeFileSync(
    `./deployments/${network.name}.json`,
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log(`Deployment info saved to ./deployments/${network.name}.json`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });