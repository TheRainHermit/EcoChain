import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ethers } from 'ethers';
import { useWallet } from './WalletContext';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../contracts/config';

interface Web3ContextType {
  depositMaterial: (materialType: string, weight: number) => Promise<void>;
  getRewardAmount: (weight: number) => number;
  getUserBalance: () => Promise<string>;
  withdrawFunds: (amount: string) => Promise<void>;
  contract: ethers.Contract | null;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

interface Web3ProviderProps {
  children: ReactNode;
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  const { signer, provider } = useWallet();
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  React.useEffect(() => {
    if (signer && provider) {
      const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      setContract(contractInstance);
    }
  }, [signer, provider]);

  const getRewardAmount = (weight: number): number => {
    // 1 kg = 0.001 ETH
    return weight * 0.001;
  };

  const depositMaterial = async (materialType: string, weight: number) => {
    if (!contract || !signer) {
      throw new Error('Contract not initialized');
    }

    try {
      const rewardAmount = getRewardAmount(weight);
      const weightInGrams = Math.floor(weight * 1000);
      
      // Call smart contract function
      const tx = await contract.depositMaterial(
        materialType,
        weightInGrams,
        { gasLimit: 300000 }
      );
      
      await tx.wait();
      
      // Update backend
      await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userAddress: await signer.getAddress(),
          materialType,
          weight,
          rewardAmount,
          transactionHash: tx.hash,
        }),
      });
      
    } catch (error) {
      console.error('Error depositing material:', error);
      throw error;
    }
  };

  const getUserBalance = async (): Promise<string> => {
    if (!contract || !signer) {
      return '0.000';
    }

    try {
      const balance = await contract.getUserBalance(await signer.getAddress());
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Error getting user balance:', error);
      return '0.000';
    }
  };

  const withdrawFunds = async (amount: string) => {
    if (!contract || !signer) {
      throw new Error('Contract not initialized');
    }

    try {
      const amountWei = ethers.parseEther(amount);
      const tx = await contract.withdrawFunds(amountWei);
      await tx.wait();
    } catch (error) {
      console.error('Error withdrawing funds:', error);
      throw error;
    }
  };

  return (
    <Web3Context.Provider
      value={{
        depositMaterial,
        getRewardAmount,
        getUserBalance,
        withdrawFunds,
        contract,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};