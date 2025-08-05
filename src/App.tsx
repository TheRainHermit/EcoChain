import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { DepositPanel } from './components/DepositPanel';
import { BalanceCard } from './components/BalanceCard';
import { AchievementsCard } from './components/AchievementsCard';
import { NFTGallery } from './components/NFTGallery';
import { TransactionHistory } from './components/TransactionHistory';
import { Footer } from './components/Footer';
import { WalletProvider } from './context/WalletContext';
import { Web3Provider } from './context/Web3Context';
import RecommendationsSection from './components/RecomendationsSection';
import EcoPointsDashboard from './components/EcoPointsDashboard';
import ChatbotWidget from './components/ChatbotWidget';
import MarketplacePage from './components/MarketplacePage';

function App() {
  // Suponiendo que tienes el userAddress en el estado global/contexto
  const userAddress = "0x..."; // Reemplaza por el valor real

  // SPA navigation state
  const [currentPage, setCurrentPage] = useState<"home" | "marketplace">("home");

  return (
    <WalletProvider>
      <Web3Provider>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900">
          <Navbar onNavigate={(page: string) => setCurrentPage(page as "home" | "marketplace")} currentPage={currentPage} />
          {currentPage === "home" ? (
            <>
              <HeroSection />
              <main className="max-w-8x1 mx-auto py-8 px-4">
                <RecommendationsSection />
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column - Deposit and History */}
                  <div className="lg:col-span-2 space-y-8">
                    <EcoPointsDashboard userAddress={userAddress} />
                    <DepositPanel />
                    <TransactionHistory />
                  </div>
                  {/* Right Column - Balance, Achievements, NFTs */}
                  <div className="space-y-8">
                    <BalanceCard />
                    <AchievementsCard />
                    <NFTGallery />
                  </div>
                </div>
              </main>
              <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded">
                ¿Quieres intercambiar o comprar NFTs?
                <button
                  className="ml-2 underline text-green-700 font-semibold"
                  onClick={() => setCurrentPage("marketplace")}
                >
                  Visita el Marketplace
                </button>
              </div>
              <Footer />
              <ChatbotWidget />
            </>
          ) : (
            <>
              <MarketplacePage />
              <button
                className="mt-6 ml-6 underline text-green-700 font-semibold"
                onClick={() => setCurrentPage("home")}
              >
                Volver al Inicio
              </button>
            </>
          )}
        </div>
      </Web3Provider>
    </WalletProvider>
  );
}

export default App;