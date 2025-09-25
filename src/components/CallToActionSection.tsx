import React from "react";

const CallToActionSection: React.FC = () => {
  
  return (
    <section className="py-16 bg-gradient-to-r from-emerald-600 to-green-900 text-white text-center">
      <h2 className="text-3xl font-bold mb-4">Únete a la revolución del reciclaje</h2>
      <p className="mb-8 text-lg">Comienza a ganar EcoCoins ($EC0) y NFTs por ayudar al planeta.</p>
      <img src="/ecochainlogosinfondo.png" alt="EcoChain Logo" className="mx-auto mt-8" />
    </section>
  );
};

export default CallToActionSection;