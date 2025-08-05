import React, { useEffect, useState } from "react";

const recommendations = [
  "¡Impulsa el Cambio, Gana EcoCoins!",
  "¡Transforma tus residuos en EcoCoins!",
  "Reduce tu huella, aumenta tus EcoCoins.",
  "El futuro es Web3, el futuro son EcoCoins.",
  "EcoCoins: Tu moneda para un mañana más verde.",
  "¡Maximiza tus ganancias reciclando más!",
  "Conoce los beneficios de tus EcoCoins.",
  "Más allá del reciclaje: Un paso hacia la innovación financiera.",
  "Únete a la comunidad de EcoChain.",
  "Apoya energías renovables y tecnologías limpias.",
];

const ROTATION_INTERVAL = 10000; // 10 seconds

const RecommendationsSection: React.FC = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % recommendations.length);
    }, ROTATION_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-gradient-to-r from-green-50 via-emerald-100 to-green-200 rounded-xl p-4 shadow-lg flex items-center gap-3 mb-6 animate-fade-in">
      <span className="text-green-600 text-3xl animate-pulse">🌱</span>
      <div>
        <h2 className="text-lg font-semibold mb-1 text-green-700">Recomendación</h2>
        <p className="text-gray-800">{recommendations[current]}</p>
      </div>
    </section>
  );
};

export default RecommendationsSection;