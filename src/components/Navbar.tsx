import React, { useState } from "react";
import { Recycle, Sparkles, Wallet, CheckCircle, LogOut } from "lucide-react";
import { useWallet } from "../context/WalletContext";
import { CustodialLoginForm } from "./CustodialLoginForm";
import { CustodialRegisterForm } from "./CustodialRegisterForm";

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage }) => {
  const {
    account,
    isConnected,
    connectWallet,
    disconnectWallet,
    loginType,
    logoutCustodial,
  } = useWallet();

  const [showCustodialLogin, setShowCustodialLogin] = useState(false);
  const [showCustodialRegister, setShowCustodialRegister] = useState(false);

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
    } catch (error) {
      console.error("Error conectando la wallet:", error);
      alert("Error conectando la wallet. Verifica MetaMask.");
    }
  };

  const handleDisconnect = () => {
    if (loginType === "web3") {
      disconnectWallet();
    } else if (loginType === "custodial") {
      logoutCustodial();
    }
  };

  return (
    <nav className="bg-gradient-to-r from-green-700 via-emerald-600 to-green-800 text-white shadow-lg">
      <div className="container mx-auto px-4 flex justify-between items-center h-16">
        <div className="flex items-center space-x-3 gap-2">
          <div className="relative">
            <Recycle size={36} className="text-emerald-400 drop-shadow-lg" />
            <Sparkles
              size={20}
              className="absolute -top-2 -right-2 text-yellow-400 animate-pulse"
            />
          </div>
          <span className="font-bold text-2xl tracking-wide drop-shadow-lg">
            EcoChain
          </span>
        </div>
        <div className="flex gap-6">
          <button
            className={`transition px-4 py-2 rounded-full font-semibold hover:bg-green-900/60 hover:scale-105 ${
              currentPage === "home"
                ? "bg-green-900/40 shadow text-yellow-300 underline"
                : ""
            }`}
            onClick={() => onNavigate("home")}
          >
            Inicio
          </button>
          <button
            className={`transition px-4 py-2 rounded-full font-semibold hover:bg-green-900/60 hover:scale-105 ${
              currentPage === "marketplace"
                ? "bg-green-900/40 shadow text-yellow-300 underline"
                : ""
            }`}
            onClick={() => onNavigate("marketplace")}
          >
            Marketplace
          </button>
        </div>
        <div className="flex items-center">
          {!isConnected ? (
            <>
              <button
                onClick={handleConnectWallet}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-600 rounded-full bg-white/10 hover:bg-white/20 transition-colors font-semibold"
              >
                <Wallet className="h-4 w-4" />
                <span>Conectar Wallet</span>
              </button>
              <button
                onClick={() => setShowCustodialLogin(true)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-600 rounded-full bg-white/10 hover:bg-white/20 transition-colors font-semibold"
              >
                <Wallet className="h-4 w-4" />
                <span>Acceder con Wallet EcoChain</span>
              </button>
              <button
                onClick={() => setShowCustodialRegister(true)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-600 rounded-full bg-white/10 hover:bg-white/20 transition-colors font-semibold"
              >
                <Wallet className="h-4 w-4" />
                <span>Crear/Importar Wallet EcoChain</span>
              </button>
              {/* Aquí puedes mostrar un modal o formulario para login custodial */}
              {showCustodialLogin && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
                  <div className="bg-white p-6 rounded shadow">
                    <h2 className="mb-4 text-lg font-bold text-black">Login EcoChain</h2>
                    <CustodialLoginForm onClose={() => setShowCustodialLogin(false)} />
                  </div>
                </div>
              )}
              {/* Modal para registro/importación de wallet custodial */}
              {showCustodialRegister && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
                  <div className="bg-white p-6 rounded shadow">
                    <h2 className="mb-4 text-lg font-bold text-black">
                      Crear o Importar Wallet EcoChain
                    </h2>
                    <CustodialRegisterForm onClose={() => setShowCustodialRegister(false)} />
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center gap-2">
              <CheckCircle className="text-green-500" />
              <span className="font-mono text-xs">
                {account?.slice(0, 6)}...{account?.slice(-4)}
                {loginType === "custodial" && " (EcoChain)"}
              </span>
              <button onClick={handleDisconnect} className="btn">
                <LogOut className="inline" /> Salir
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
