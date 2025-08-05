import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';

type LoginType = 'web3' | 'custodial' | null;

interface WalletContextType {
  account: string | null;
  isConnected: boolean;
  balance: string;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  provider: ethers.BrowserProvider | null;
  signer: ethers.Signer | null;
  loginType: LoginType;
  jwt: string | null;
  loginCustodial: (email: string, password: string) => Promise<boolean>;
  logoutCustodial: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>('0.000');
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [loginType, setLoginType] = useState<LoginType>(null);
  const [jwt, setJwt] = useState<string | null>(null);

  // --- Web3 login ---
  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send('eth_requestAccounts', []);
        const signer = await provider.getSigner();

        setAccount(accounts[0]);
        setProvider(provider);
        setSigner(signer);
        setLoginType('web3');
        setJwt(null);

        const balance = await provider.getBalance(accounts[0]);
        setBalance(ethers.formatEther(balance));

        window.ethereum.on('accountsChanged', (accounts: string[]) => {
          if (accounts.length === 0) {
            disconnectWallet();
          } else {
            setAccount(accounts[0]);
          }
        });

        window.ethereum.on('chainChanged', () => {
          window.location.reload();
        });

      } catch (error) {
        console.error('Error connecting wallet:', error);
        throw new Error('Failed to connect wallet');
      }
    } else {
      throw new Error('MetaMask is not installed');
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setBalance('0.000');
    setProvider(null);
    setSigner(null);
    setLoginType(null);
    setJwt(null);
  };

  // --- Custodial login ---
  const loginCustodial = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (data.token && data.wallet_address) {
        setAccount(data.wallet_address);
        setJwt(data.token);
        setLoginType('custodial');
        // Puedes obtener el balance llamando a tu backend aquí si quieres
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error login custodial:', error);
      return false;
    }
  };

  const logoutCustodial = () => {
    setAccount(null);
    setJwt(null);
    setLoginType(null);
    setBalance('0.000');
    setProvider(null);
    setSigner(null);
  };

  const isConnected = account !== null;

  useEffect(() => {
    // Solo intenta reconectar Web3 si no hay sesión custodial
    if (!jwt && typeof window.ethereum !== 'undefined') {
      const checkConnection = async () => {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await provider.listAccounts();
          if (accounts.length > 0) {
            await connectWallet();
          }
        } catch (error) {
          // Silenciar error
          console.error('Error checking wallet connection:', error);
          setAccount(null);
        }
      };
      checkConnection();
    }
  }, [jwt]);

  return (
    <WalletContext.Provider
      value={{
        account,
        isConnected,
        balance,
        connectWallet,
        disconnectWallet,
        provider,
        signer,
        loginType,
        jwt,
        loginCustodial,
        logoutCustodial,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};