import React, { useState } from "react";
import { useWallet } from "../context/WalletContext";

interface CustodialLoginFormProps {
  onClose: () => void;
}

export const CustodialLoginForm: React.FC<CustodialLoginFormProps> = ({ onClose }) => {
  const { loginCustodial } = useWallet();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const success = await loginCustodial(email, password);
    setLoading(false);
    if (success) {
      onClose();
    } else {
      setError("Credenciales incorrectas o error de conexión.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-black">
      <label className="font-semibold text-black">Correo electrónico</label>
      <input
        type="email"
        className="border rounded px-3 py-2"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        autoFocus
      />
      <label className="font-semibold text-black">Contraseña</label>
      <input
        type="password"
        className="border rounded px-3 py-2"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <button
        type="submit"
        className="bg-emerald-600 text-white rounded px-4 py-2 font-semibold mt-2"
        disabled={loading}
      >
        {loading ? "Accediendo..." : "Acceder"}
      </button>
      <button
        type="button"
        className="text-gray-500 underline mt-2"
        onClick={onClose}
      >
        Cancelar
      </button>
    </form>
  );
};