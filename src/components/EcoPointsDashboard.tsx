import React, { useEffect, useState } from "react";

interface EcoPointsDashboardProps {
  userAddress: string;
}

const EcoPointsDashboard: React.FC<EcoPointsDashboardProps> = ({ userAddress }) => {
  const [ecoPoints, setEcoPoints] = useState<number>(0);
  const [ecoCoins, setEcoCoins] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchEcoData() {
      setLoading(true);
      try {
        // Simulación de llamada a API backend
        const pointsRes = await fetch(`/api/ecopoints/${userAddress}`);
        const coinsRes = await fetch(`/api/ecocoins/${userAddress}`);
        const pointsData = await pointsRes.json();
        const coinsData = await coinsRes.json();
        setEcoPoints(pointsData.ecoPoints);
        setEcoCoins(coinsData.ecoCoins);
      } catch (error) {
        console.error("Error al obtener datos de EcoPoints/EcoCoins:", error);
        setEcoPoints(0);
        setEcoCoins(0);
      }
      setLoading(false);
    }
    if (userAddress) fetchEcoData();
  }, [userAddress]);

  const handleConvert = async () => {
    setLoading(true);
    try {
      // Simulación de conversión EcoPoints -> EcoCoins
      const res = await fetch(`/api/ecopoints/convert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userAddress, ecoPoints }),
      });
      const data = await res.json();
      setEcoPoints(data.remainingEcoPoints);
      setEcoCoins(data.newEcoCoins);
    } catch (error) {
      console.error("Error al convertir EcoPoints:", error);
      setEcoPoints(0);
      setEcoCoins(0);
    }
    setLoading(false);
  };

  return (
    <section className="bg-gradient-to-br from-green-100 via-emerald-50 to-green-200 rounded-2xl p-8 shadow-xl mb-8 flex flex-col gap-4 animate-fade-in">
      <h2 className="text-2xl font-extrabold mb-2 text-green-700 flex items-center gap-2 drop-shadow">
        <span role="img" aria-label="points" className="animate-pulse">🏅</span> EcoPoints Dashboard
      </h2>
      <div className="flex justify-between items-center text-lg">
        <span className="font-semibold">EcoPoints:</span>
        <span className="text-green-700 font-bold bg-green-100 px-4 py-1 rounded-full shadow">{ecoPoints}</span>
      </div>
      <div className="flex justify-between items-center mb-4 text-lg">
        <span className="font-semibold">EcoCoins (ETH):</span>
        <span className="text-yellow-600 font-bold bg-yellow-100 px-4 py-1 rounded-full shadow">{ecoCoins}</span>
      </div>
      <button
        className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-3 rounded-full font-semibold shadow hover:scale-105 hover:bg-green-700 transition-transform"
        onClick={handleConvert}
        disabled={ecoPoints === 0 || loading}
      >
        {loading ? "Convirtiendo..." : "Convertir EcoPoints a EcoCoins"}
      </button>
    </section>
  );
};

export default EcoPointsDashboard;