import React from "react";
import { Recycle, Sparkles, Gamepad2 } from "lucide-react";

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage }) => {

  // Scroll suave a la sección del juego si existe
  const handleGameClick = () => {
    const section = document.getElementById("ecogame");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    } else {
      // Si no está en la página principal, navega y luego scroll (opcional)
      onNavigate("home");
      setTimeout(() => {
        const sec = document.getElementById("ecogame");
        if (sec) sec.scrollIntoView({ behavior: "smooth" });
      }, 300);
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
          <button
            className={`transition px-4 py-2 rounded-full font-semibold hover:bg-green-900/60 hover:scale-105 ${
              currentPage === "technical"
                ? "bg-green-900/40 shadow text-yellow-300 underline"
                : ""
            }`}
            onClick={() => onNavigate("technical")}
          >
            Detalles Técnicos
          </button>
          <button
            className={`transition px-4 py-2 rounded-full font-semibold hover:bg-green-900/60 hover:scale-105 ${
              currentPage === "about"
                ? "bg-green-900/40 shadow text-yellow-300 underline"
                : ""
            }`}
            onClick={() => onNavigate("about")}
          >
            Acerca de
          </button>
          <button
            className={`transition px-4 py-2 rounded-full font-semibold hover:bg-green-900/60 hover:scale-105 ${
              currentPage === "contact"
                ? "bg-green-900/40 shadow text-yellow-300 underline"
                : ""
            }`}
            onClick={() => onNavigate("contact")}
            title="Contacto"
          >
            Contacto
          </button>
          <button
            className="transition px-4 py-2 rounded-full font-semibold flex items-center gap-2 bg-gradient-to-r from-yellow-400/20 to-emerald-400/10 hover:bg-green-900/60 hover:scale-105"
            onClick={handleGameClick}
            title="EcoChain Game"
          >
            <Gamepad2 className="w-5 h-5 text-yellow-300" />
            Juego de EcoChain
          </button>
        </div>
      </div>
    </nav>
  );
};
