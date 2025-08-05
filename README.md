# EcoRewards - Blockchain Recycling Incentive Platform

EcoRewards is a decentralized application (DApp) that incentivizes recycling by rewarding users with cryptocurrency (ETH) for depositing recyclable materials. Users can also earn exclusive NFTs based on their recycling achievements.

## 🌟 Features

- **Crypto Rewards**: Earn EcoCoins (ETH) by converting your EcoPoints
- **EcoPoints System**: Materials are first converted to EcoPoints, which can be exchanged for EcoCoins (ETH)
- **NFT Achievements**: Unlock exclusive NFTs for recycling milestones
- **Dynamic Recommendations**: Get new recycling tips and challenges that update regularly
- **Marketplace**: Trade your NFTs and EcoCoins with other users
- **Chatbot Assistant**: Get instant help and recycling advice from our AI-powered chatbot
- **Material Tracking**: Support for plastic, paper, glass, aluminum, and electronics
- **Real-time Conversion**: Live EcoCoin (ETH) to USD price conversion
- **Transaction History**: Complete history of all recycling activities
- **Wallet Integration**: Seamless MetaMask integration
- **Responsive Design**: Works perfectly on desktop and mobile devices

## 🏗️ Architecture

### Frontend (React + TypeScript)
- Modern React 18 with TypeScript
- Tailwind CSS for styling
- Web3 integration with ethers.js
- MetaMask wallet connection
- Responsive design with mobile-first approach

### Backend (Node.js + Express)
- RESTful API for transaction management
- In-memory storage (easily extendable to database)
- CORS enabled for cross-origin requests
- Error handling and logging

### Smart Contracts (Solidity)
- ERC-721 NFT functionality
- Reward calculation and distribution
- Reentrancy protection
- Access controls and security measures

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- MetaMask wallet extension
- Git

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd ecorewards
```

2. **Install frontend dependencies**
```bash
npm install
```

3. **Install backend dependencies**
```bash
cd backend
npm install
cd ..
```

4. **Install contract dependencies**
```bash
cd contracts
npm install
cd ..
```

### Running the Application

1. **Start the backend server**
```bash
cd backend
npm run dev
```

2. **Start the frontend development server**
```bash
npm run dev
```

3. **Deploy smart contracts (local network)**
```bash
cd contracts
npx hardhat node
# In another terminal:
npx hardhat run scripts/deploy.js --network localhost
```

## 📱 Usage

1. **Connect Wallet**: Click "Connect Wallet" and approve MetaMask connection
2. **Select Material**: Choose the type of recyclable material
3. **Enter Weight**: Input the weight in kilograms
4. **Calculate Reward**: See how much ETH you'll earn
5. **Deposit**: Submit the transaction and receive instant payment
6. **Track Progress**: Monitor your balance, NFTs, and recycling history

## 🔧 Smart Contract Details

### EcoRewards Contract
- **Address**: `0x742d35Cc6634C0532925a3b8D30b6AB61e3f9E94` (update after deployment)
- **Network**: Ethereum (or testnet)
- **Reward Rate**: 0.001 ETH per gram (1 ETH per kg)
- **NFT Threshold**: 10 kg for each NFT

### Key Functions
- `depositMaterial(string materialType, uint256 weightInGrams)`: Deposit material and earn rewards
- `withdrawFunds(uint256 amount)`: Withdraw earned rewards
- `getUserBalance(address user)`: Check user's reward balance
- `getUserRecycledWeight(address user)`: Get total recycled weight

## 🧪 Testing

### Smart Contract Tests
```bash
cd contracts
npx hardhat test
```

### Frontend Tests
```bash
npm test
```

## 🚀 Deployment

### Smart Contract Deployment

1. **Configure environment**
```bash
cd contracts
cp .env.example .env
# Edit .env with your private key and RPC URLs
```

2. **Deploy to testnet**
```bash
npx hardhat run scripts/deploy.js --network goerli
```

3. **Deploy to mainnet**
```bash
npx hardhat run scripts/deploy.js --network mainnet
```

### Frontend Deployment
```bash
npm run build
# Deploy the dist/ folder to your hosting service
```

### Backend Deployment
```bash
cd backend
npm start
# Or deploy to your preferred cloud service
```

## 🔒 Security Features

- Reentrancy protection on all financial functions
- Access controls for administrative functions
- Input validation and sanitization
- Secure wallet connection handling
- Protected API endpoints

## 🌍 Environmental Impact

- **1 kg plastic recycled** = 0.001 ETH reward (~$3.50)
- **Carbon footprint reduction** through recycling incentives
- **Circular economy support** via blockchain transparency
- **Community engagement** through NFT rewards

## 🛠️ Technical Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Blockchain**: Ethereum, Solidity, Hardhat
- **Web3**: ethers.js, MetaMask
- **Tools**: Vite, ESLint, Prettier

## 📈 Roadmap

- [ ] Mobile app development
- [ ] Integration with physical recycling stations
- [ ] Multi-chain support (Polygon, BSC)
- [ ] DAO governance for reward rates
- [ ] Partnership with recycling companies
- [ ] Marketplace for NFT trading

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💬 Support

- **Email**: info@ecorewards.com
- **Twitter**: @EcoRewards
- **Discord**: [Join our community]
- **Docs**: [Documentation site]

## 🔗 Links

- **Live Demo**: [https://ecorewards.app]
- **Contract**: [Etherscan link]
- **Whitepaper**: [Technical documentation]

---

**Built with 💚 for a sustainable future**