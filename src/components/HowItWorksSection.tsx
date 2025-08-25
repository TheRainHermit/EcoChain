import React from "react";

const steps = [
  "Lleva tus materiales a un punto de reciclaje.",
  "Registra tu acción en EcoChain.",
  "Obtén EcoCoins y NFTs como recompensa.",
  "Ingresa al Marketplace y canjea tus logros.",
];

const HowItWorksSection: React.FC = () => (
  <section className="py-20 bg-gradient-to-br from-emerald-900 via-emerald-800 to-green-900 text-white">
    <div className="max-w-5xl mx-auto text-center px-4">
      <h2 className="text-4xl font-extrabold mb-12 tracking-tight">¿Cómo funciona?</h2>
      <div className="flex flex-col md:flex-row items-center justify-center gap-8">
        {steps.map((step, i) => (
          <React.Fragment key={i}>
            <div className="flex flex-col items-center min-w-[200px]">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 text-white text-3xl font-bold shadow-xl mb-4 border-4 border-emerald-700">
                {i + 1}
              </div>
              <p className="text-lg font-semibold max-w-xs">{step}</p>
            </div>
            {i < steps.length - 1 && (
              <div className="hidden md:flex flex-1 h-1 bg-gradient-to-r from-emerald-400 to-green-300 mx-2 animate-pulse rounded" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorksSection;