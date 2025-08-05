import React, { useState, useEffect } from "react";
import {
  ArrowDownCircle,
  Calculator,
  Upload,
  AlertCircle,
  Camera,
} from "lucide-react";
import { wasteTypes } from '../utils/utils';
import * as Icons from 'lucide-react';
import { useWallet } from "../context/WalletContext";
import { useWeb3 } from "../context/Web3Context";
import { MaterialRecognition } from "./MaterialRecognition";

const MATERIAL_OPTIONS = [
  { value: "plastic", label: "Plástico (PET)" },
  { value: "paper", label: "Papel/Cartón" },
  { value: "glass", label: "Vidrio" },
  { value: "aluminum", label: "Aluminio" },
  { value: "electronic", label: "Electrónicos" },
];

export const DepositPanel: React.FC = () => {
  const { account, loginType, jwt, isConnected } = useWallet();
  const { depositMaterial, getRewardAmount } = useWeb3();
  const [materialType, setMaterialType] = useState("plastic");
  const [weight, setWeight] = useState<string>("");
  const [calculatedReward, setCalculatedReward] = useState<number | null>(null);
  const [ethPrice, setEthPrice] = useState(3500);
  const [isDepositing, setIsDepositing] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [detectedMaterial, setDetectedMaterial] = useState<{
    material: string;
    confidence: number;
  } | null>(null);
  const [material, setMaterial] = useState<string>("");
  const [materialName, setMaterialName] = useState<string>("");
  const [confidence, setConfidence] = useState<number>(0);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    // Fetch ETH price (simulated)
    const fetchEthPrice = async () => {
      try {
        setEthPrice(3500);
      } catch (error) {
        console.error("Error fetching ETH price:", error);
      }
    };

    fetchEthPrice();
    const interval = setInterval(fetchEthPrice, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleCalculate = () => {
    const weightNum = parseFloat(weight);
    if (weightNum && weightNum > 0) {
      const reward = getRewardAmount(weightNum);
      setCalculatedReward(reward);
    } else {
      alert("Please enter a valid weight");
    }
  };

  // ADAPTADO: Manejo de depósito para ambos modos de acceso
  const handleDeposit = async () => {
    if (!account) return;
    setIsDepositing(true);
    setMessage(null);

    // Simulación de obtención de datos reales
    const ecoPoints = calculatedReward ? calculatedReward * 1000 : 0; // Ejemplo
    const ecoCoins = calculatedReward || 0;

    const depositData = {
      wallet_address: account,
      material_type: materialType,
      weight_kg: weight,
      eco_points: ecoPoints,
      eco_coins: ecoCoins,
      // Puedes agregar más campos según tu backend
    };

    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (loginType === "custodial" && jwt) {
      headers["Authorization"] = `Bearer ${jwt}`;
    }

    try {
      const res = await fetch("/api/recycling/deposit", {
        method: "POST",
        headers,
        body: JSON.stringify(depositData),
      });
      const data = await res.json();
      if (data.success) {
        setMessage("Depósito registrado correctamente.");
        setWeight("");
        setCalculatedReward(null);
      } else {
        setMessage(data.error || "Error desconocido");
      }
    } catch (error) {
      console.error("Error en el depósito:", error);
      setMessage("Error en el depósito. Inténtalo de nuevo más tarde.");
    } finally {
      setIsDepositing(false);
    }
  };

  const handleMaterialDetected = (material: string, confidence: number) => {
    setMaterialType(material);
    setDetectedMaterial({ material, confidence });
    setShowCamera(false);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setFile(e.target.files[0]);
    setLoading(true);

    const formData = new FormData();
    formData.append("image", e.target.files[0]);

    const response = await fetch(
      "http://localhost:5000/api/recognize-material",
      {
        method: "POST",
        body: formData,
      }
    );
    const result = await response.json();
    setLoading(false);

    if (result.success) {
      setMaterial(result.material_name);
      setConfidence(result.confidence);
    } else {
      alert(result.message || "No se pudo reconocer el material.");
    }
  };

  return (
    <>
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
      {wasteTypes.map((waste) => {
        const IconComponent = Icons[waste.icon as keyof typeof Icons] as React.ComponentType<any>;
        return (
          <div
            key={waste.id}
            className="relative p-6 rounded-2xl transition-all duration-300 bg-white shadow hover:shadow-xl"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${waste.color} rounded-2xl opacity-90`} />
            <div className="relative text-white text-center">
              <IconComponent size={32} className="mx-auto mb-2" />
              <h3 className="font-bold text-sm">{waste.name}</h3>
              <p className="text-xs opacity-90 mt-1">{waste.pointsPerUnit} pts/unidad</p>
              <p className="text-xs opacity-75 mt-1">{waste.description}</p>
            </div>
          </div>
        );
      })}
    </div>
    <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
      <div className="flex items-center space-x-3 mb-6">
        <ArrowDownCircle className="h-8 w-8 text-green-500" />
        <h2 className="text-2xl font-bold text-gray-800">Depositar material</h2>
      </div>

  {
    /* AI Recognition Button */
  }
  
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-800 mb-1">Reconocimiento automático</h4>
            <p className="text-sm text-gray-600">Usa la cámara para identificar el material automáticamente</p>
          </div>
          <button
            onClick={() => setShowCamera(true)}
            className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Camera className="h-4 w-4" />
            <span>Escanear</span>
          </button>
        </div>
      </div>
      

  {
    /* Detection Result */
  }
  {detectedMaterial && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <div>
              <span className="text-green-800 font-medium">
                Material detectado por IA: {MATERIAL_OPTIONS.find(opt => opt.value === detectedMaterial.material)?.label}
              </span>
              <span className="text-green-600 text-sm ml-2">
                ({(detectedMaterial.confidence * 100).toFixed(1)}% confianza)
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de material
          </label>
          <select
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            value={materialType}
            onChange={(e) => setMaterialType(e.target.value)}
          >
            {MATERIAL_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Peso (kg)
          </label>
          <input
            type="number"
            step="0.01"
            placeholder="0.00"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-between items-center mb-6 p-4 bg-gray-50 rounded-lg">
        <div>
          <h3 className="font-medium text-gray-800 mb-1">Tasa de cambio:</h3>
          <p className="text-sm text-gray-600">
            1 kg = 0.001 ETH ≈ ${(0.001 * ethPrice).toFixed(2)}
          </p>
        </div>
        <button
          onClick={handleCalculate}
          className="flex items-center space-x-2 bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition-colors font-medium"
        >
          <Calculator className="h-4 w-4" />
          <span>Calcular</span>
        </button>
      </div>

      {calculatedReward !== null && (
        <div className="flex items-center space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
          <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0" />
          <div>
            <span className="text-blue-800">
              Recibirás: <strong>{calculatedReward.toFixed(4)} ETH</strong> (
              ${(calculatedReward * ethPrice).toFixed(2)})
            </span>
          </div>
        </div>
      )}

      <button
        onClick={handleDeposit}
        disabled={!isConnected || !weight || isDepositing}
        className="w-full flex items-center justify-center space-x-2 bg-green-500 text-white py-4 rounded-lg hover:bg-green-600 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        <Upload className="h-5 w-5" />
        <span>
          {isDepositing 
            ? 'Procesando...' 
            : 'Depositar y recibir pago'
          }
        </span>
      </button>
    </div>
  
  {
    /* Material Recognition Modal */
  }
   {showCamera && (
      <MaterialRecognition
        onMaterialDetected={handleMaterialDetected}
        onClose={() => setShowCamera(false)}
      />
    )}
    </>
    
  );
  
};