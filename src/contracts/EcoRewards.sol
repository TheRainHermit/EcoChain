// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract EcoRewards is ERC721, Ownable, ReentrancyGuard {
    uint256 private _tokenIdCounter;
    
    // Mapping from user address to their balance in wei
    mapping(address => uint256) public userBalances;
    
    // Mapping from user address to total recycled weight in grams
    mapping(address => uint256) public userRecycledWeight;
    
    // Mapping from user address to number of NFTs earned
    mapping(address => uint256) public userNFTCount;
    
    // Events
    event MaterialDeposited(
        address indexed user,
        string materialType,
        uint256 weight,
        uint256 reward
    );
    
    event NFTMinted(address indexed user, uint256 tokenId);
    event FundsWithdrawn(address indexed user, uint256 amount);
    
    // Constants
    uint256 public constant REWARD_RATE = 1e15; // 0.001 ETH per gram (1 kg = 1000g = 1 ETH)
    uint256 public constant NFT_THRESHOLD = 10000; // 10 kg in grams
    
    constructor() ERC721("EcoRewards", "ECO") {}
    
    // Function to deposit recycled material and earn rewards
    function depositMaterial(string memory materialType, uint256 weightInGrams) 
        external 
        nonReentrant 
    {
        require(weightInGrams > 0, "Weight must be greater than 0");
        require(bytes(materialType).length > 0, "Material type cannot be empty");
        
        // Calculate reward (0.001 ETH per gram)
        uint256 reward = weightInGrams * REWARD_RATE;
        
        // Update user data
        userBalances[msg.sender] += reward;
        userRecycledWeight[msg.sender] += weightInGrams;
        
        // Check if user qualifies for NFT
        uint256 newWeight = userRecycledWeight[msg.sender];
        uint256 previousNFTs = userNFTCount[msg.sender];
        uint256 newNFTs = newWeight / NFT_THRESHOLD;
        
        // Mint NFTs if user reached new threshold
        if (newNFTs > previousNFTs) {
            uint256 nftsToMint = newNFTs - previousNFTs;
            for (uint256 i = 0; i < nftsToMint; i++) {
                _mintNFT(msg.sender);
            }
            userNFTCount[msg.sender] = newNFTs;
        }
        
        emit MaterialDeposited(msg.sender, materialType, weightInGrams, reward);
    }
    
    // Internal function to mint NFT
    function _mintNFT(address to) internal {
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        _safeMint(to, tokenId);
        emit NFTMinted(to, tokenId);
    }
    
    // Function to withdraw earned rewards
    function withdrawFunds(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(userBalances[msg.sender] >= amount, "Insufficient balance");
        
        userBalances[msg.sender] -= amount;
        
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");
        
        emit FundsWithdrawn(msg.sender, amount);
    }
    
    // View functions
    function getUserBalance(address user) external view returns (uint256) {
        return userBalances[user];
    }
    
    function getUserRecycledWeight(address user) external view returns (uint256) {
        return userRecycledWeight[user];
    }
    
    function getUserNFTCount(address user) external view returns (uint256) {
        return userNFTCount[user];
    }
    
    function getNextNFTThreshold(address user) external view returns (uint256) {
        uint256 currentWeight = userRecycledWeight[user];
        uint256 currentNFTs = userNFTCount[user];
        uint256 nextThreshold = (currentNFTs + 1) * NFT_THRESHOLD;
        
        if (currentWeight >= nextThreshold) {
            return 0; // Already qualified for next NFT
        }
        
        return nextThreshold - currentWeight;
    }
    
    // Owner functions
    function fundContract() external payable onlyOwner {
        // Allow owner to fund the contract for rewards
    }
    
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Emergency withdraw failed");
    }
    
    // Function to receive Ether
    receive() external payable {}
    
    // Fallback function
    fallback() external payable {}
}