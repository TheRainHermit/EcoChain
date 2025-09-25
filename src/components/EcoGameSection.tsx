import React from "react";
import { Gamepad2, MapPin, Gift } from "lucide-react";

const EcoGameSection: React.FC = () => (
  <section id="ecogame" className="py-16 bg-gradient-to-br from-green-900 via-emerald-900 to-emerald-800 text-white text-center">
    <div className="max-w-4xl mx-auto px-4">
      <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
        <Gamepad2 className="inline w-8 h-8 text-yellow-300" />
        ¡Próximamente: Juego Móvil de EcoChain!
      </h2>
      <p className="text-lg mb-8">
        Un juego móvil donde podrás explorar tu ciudad, encontrar puntos de reciclaje y depositar residuos para ganar <span className="font-bold text-emerald-200">NFTs ecológicos</span> y <span className="font-bold text-yellow-200">EcoCoins ($EC0)</span>.
      </p>
      <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
        <div className="flex flex-col items-center">
          <MapPin className="w-10 h-10 text-emerald-400 mb-2" />
          <span className="font-semibold">Explora y encuentra puntos EcoChain</span>
        </div>
        <div className="hidden md:block w-12 h-1 bg-gradient-to-r from-emerald-400 to-green-300 rounded-full mx-4" />
        <div className="flex flex-col items-center">
          <Gift className="w-10 h-10 text-yellow-300 mb-2" />
          <span className="font-semibold">Deposita residuos y gana recompensas NFT</span>
        </div>
      </div>
      <div className="mt-10 font-extrabold text-emerald-100 italic">
        ¡Convierte el reciclaje en una aventura y compite con tus amigos!
      </div>
    </div>
  </section>
);

export default EcoGameSection;