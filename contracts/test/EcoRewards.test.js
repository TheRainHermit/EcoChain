const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("EcoRewards", function () {
  let ecoRewards;
  let owner;
  let user1;
  let user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    const EcoRewards = await ethers.getContractFactory("EcoRewards");
    ecoRewards = await EcoRewards.deploy();
    await ecoRewards.deployed();

    // Fund the contract
    await owner.sendTransaction({
      to: ecoRewards.address,
      value: ethers.utils.parseEther("10.0"),
    });
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await ecoRewards.owner()).to.equal(owner.address);
    });

    it("Should have correct name and symbol", async function () {
      expect(await ecoRewards.name()).to.equal("EcoRewards");
      expect(await ecoRewards.symbol()).to.equal("ECO");
    });
  });

  describe("Material Deposit", function () {
    it("Should allow users to deposit materials and earn rewards", async function () {
      const materialType = "plastic";
      const weight = 5000; // 5 kg in grams
      const expectedReward = ethers.utils.parseEther("0.005"); // 5000 * 0.001 ETH per gram

      await expect(
        ecoRewards.connect(user1).depositMaterial(materialType, weight)
      )
        .to.emit(ecoRewards, "MaterialDeposited")
        .withArgs(user1.address, materialType, weight, expectedReward);

      const balance = await ecoRewards.getUserBalance(user1.address);
      expect(balance).to.equal(expectedReward);

      const recycledWeight = await ecoRewards.getUserRecycledWeight(user1.address);
      expect(recycledWeight).to.equal(weight);
    });

    it("Should mint NFT when user reaches threshold", async function () {
      const materialType = "plastic";
      const weight = 10000; // 10 kg (exactly at threshold)

      await expect(
        ecoRewards.connect(user1).depositMaterial(materialType, weight)
      )
        .to.emit(ecoRewards, "NFTMinted")
        .withArgs(user1.address, 0);

      const nftCount = await ecoRewards.getUserNFTCount(user1.address);
      expect(nftCount).to.equal(1);

      const balance = await ecoRewards.balanceOf(user1.address);
      expect(balance).to.equal(1);
    });

    it("Should revert with invalid inputs", async function () {
      await expect(
        ecoRewards.connect(user1).depositMaterial("plastic", 0)
      ).to.be.revertedWith("Weight must be greater than 0");

      await expect(
        ecoRewards.connect(user1).depositMaterial("", 1000)
      ).to.be.revertedWith("Material type cannot be empty");
    });
  });

  describe("Withdrawals", function () {
    beforeEach(async function () {
      // User deposits material to earn rewards
      await ecoRewards.connect(user1).depositMaterial("plastic", 5000);
    });

    it("Should allow users to withdraw their rewards", async function () {
      const balance = await ecoRewards.getUserBalance(user1.address);
      const initialEthBalance = await user1.getBalance();

      await expect(
        ecoRewards.connect(user1).withdrawFunds(balance)
      )
        .to.emit(ecoRewards, "FundsWithdrawn")
        .withArgs(user1.address, balance);

      const newBalance = await ecoRewards.getUserBalance(user1.address);
      expect(newBalance).to.equal(0);

      const finalEthBalance = await user1.getBalance();
      expect(finalEthBalance).to.be.gt(initialEthBalance);
    });

    it("Should revert when withdrawing more than balance", async function () {
      const balance = await ecoRewards.getUserBalance(user1.address);
      const excessAmount = balance.add(ethers.utils.parseEther("1"));

      await expect(
        ecoRewards.connect(user1).withdrawFunds(excessAmount)
      ).to.be.revertedWith("Insufficient balance");
    });

    it("Should revert when withdrawing zero amount", async function () {
      await expect(
        ecoRewards.connect(user1).withdrawFunds(0)
      ).to.be.revertedWith("Amount must be greater than 0");
    });
  });

  describe("NFT Mechanics", function () {
    it("Should mint multiple NFTs for large deposits", async function () {
      const materialType = "plastic";
      const weight = 25000; // 25 kg (should earn 2 NFTs)

      const tx = await ecoRewards.connect(user1).depositMaterial(materialType, weight);
      const receipt = await tx.wait();

      // Check for NFTMinted events
      const nftEvents = receipt.events.filter(e => e.event === "NFTMinted");
      expect(nftEvents.length).to.equal(2);

      const nftCount = await ecoRewards.getUserNFTCount(user1.address);
      expect(nftCount).to.equal(2);

      const balance = await ecoRewards.balanceOf(user1.address);
      expect(balance).to.equal(2);
    });

    it("Should calculate next NFT threshold correctly", async function () {
      // Deposit 5kg
      await ecoRewards.connect(user1).depositMaterial("plastic", 5000);

      const nextThreshold = await ecoRewards.getNextNFTThreshold(user1.address);
      expect(nextThreshold).to.equal(5000); // Need 5kg more for first NFT

      // Deposit another 5kg (total 10kg)
      await ecoRewards.connect(user1).depositMaterial("paper", 5000);

      const nextThreshold2 = await ecoRewards.getNextNFTThreshold(user1.address);
      expect(nextThreshold2).to.equal(10000); // Need 10kg more for second NFT
    });
  });

  describe("Owner Functions", function () {
    it("Should allow owner to fund contract", async function () {
      const fundAmount = ethers.utils.parseEther("5.0");
      
      await expect(
        ecoRewards.connect(owner).fundContract({ value: fundAmount })
      ).to.not.be.reverted;
    });

    it("Should allow owner to emergency withdraw", async function () {
      const initialBalance = await ethers.provider.getBalance(ecoRewards.address);
      
      await expect(
        ecoRewards.connect(owner).emergencyWithdraw()
      ).to.not.be.reverted;

      const finalBalance = await ethers.provider.getBalance(ecoRewards.address);
      expect(finalBalance).to.equal(0);
    });

    it("Should revert emergency withdraw from non-owner", async function () {
      await expect(
        ecoRewards.connect(user1).emergencyWithdraw()
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });
});