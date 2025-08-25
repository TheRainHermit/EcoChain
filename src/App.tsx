import React, { useState } from "react";
import { Navbar } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";
import { Footer } from "./components/Footer";
import ChatbotWidget from "./components/ChatbotWidget";
import MarketplacePage from "./components/MarketplacePage";
import TechnicalDetails from "./components/TechnicalDetails";
import AboutPage from "./components/AboutPage";
import ContactPage from "./components/ContactPage";

function App() {
  // SPA navigation state
  const [currentPage, setCurrentPage] = useState<
    "home" | "marketplace" | "technical" | "about" | "contact"
  >("home");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900">
      <Navbar
        onNavigate={(page: string) =>
          setCurrentPage(
            page as "home" | "marketplace" | "technical" | "about" | "contact"
          )
        }
        currentPage={currentPage}
      />
      <ChatbotWidget />
      {currentPage === "home" && (
        <>
          <HeroSection />
          <Footer />
        </>
      )}
      {currentPage === "marketplace" && (
        <>
          <MarketplacePage />
          <Footer />
        </>
      )}
      {currentPage === "technical" && (
        <>
          <TechnicalDetails />
          <Footer />
        </>
      )}
      {currentPage === "about" && (
        <>
          <AboutPage />
          <Footer />
        </>
      )}
      {currentPage === "contact" && (
        <>
          <ContactPage />
          <Footer />
        </>
      )}
    </div>
  );
}

export default App;
