import React, { useState } from "react";
import { useWallet } from "../context/WalletContext";

interface CustodialRegisterFormProps {
  onClose: () => void;
}

export const CustodialRegisterForm: React.FC<CustodialRegisterFormProps> = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mnemonic, setMnemonic] = useState(""); // Para importar
  const [mode, setMode] = useState<"register" | "import">("register");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.mnemonic) {
        setSuccess("Wallet creada exitosamente. Guarda tu frase secreta:");
        setMnemonic(data.mnemonic);
      } else {
        setError(data.error || "Error al crear la wallet.");
      }
    } catch (err) {
        console.error("Error al registrar:", err);
      setError("Error de conexión.");
    }
    setLoading(false);
  };

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch("/api/auth/import", {
        method: "POST",
        body: JSON.stringify({ email, password, mnemonic }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.token && data.wallet_address) {
        setSuccess("Wallet importada correctamente.");
        // Puedes hacer login automático aquí si quieres
        // await loginCustodial(email, password);
        onClose();
      } else {
        setError(data.error || "Error al importar la wallet.");
      }
    } catch (err) {
        console.error("Error al importar:", err);
      setError("Error de conexión.");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2 mb-2">
        <button
          className={`px-3 py-1 rounded ${mode === "register" ? "bg-emerald-600 text-white" : "bg-gray-200"}`}
          onClick={() => setMode("register")}
        >
          Crear Wallet
        </button>
        <button
          className={`px-3 py-1 rounded ${mode === "import" ? "bg-emerald-600 text-white" : "bg-gray-200"}`}
          onClick={() => setMode("import")}
        >
          Importar Wallet
        </button>
      </div>
      {mode === "register" ? (
        <form onSubmit={handleRegister} className="flex flex-col gap-3 text-black">
          <label className="font-semibold">Correo electrónico</label>
          <input
            type="email"
            className="border rounded px-3 py-2"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <label className="font-semibold">Contraseña</label>
          <input
            type="password"
            className="border rounded px-3 py-2"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {success && (
            <div className="bg-green-100 text-green-800 p-2 rounded text-sm">
              {success}
              <div className="mt-2 font-mono break-all">{mnemonic}</div>
            </div>
          )}
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button
            type="submit"
            className="bg-emerald-600 text-white rounded px-4 py-2 font-semibold mt-2"
            disabled={loading}
          >
            {loading ? "Creando..." : "Crear Wallet"}
          </button>
          <button
            type="button"
            className="text-gray-500 underline mt-2"
            onClick={onClose}
          >
            Cancelar
          </button>
        </form>
      ) : (
        <form onSubmit={handleImport} className="flex flex-col gap-3">
          <label className="font-semibold">Correo electrónico</label>
          <input
            type="email"
            className="border rounded px-3 py-2"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <label className="font-semibold">Contraseña</label>
          <input
            type="password"
            className="border rounded px-3 py-2"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <label className="font-semibold">Frase secreta (mnemonic)</label>
          <textarea
            className="border rounded px-3 py-2"
            value={mnemonic}
            onChange={e => setMnemonic(e.target.value)}
            required
            rows={2}
          />
          {success && (
            <div className="bg-green-100 text-green-800 p-2 rounded text-sm">
              {success}
            </div>
          )}
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button
            type="submit"
            className="bg-emerald-600 text-white rounded px-4 py-2 font-semibold mt-2"
            disabled={loading}
          >
            {loading ? "Importando..." : "Importar Wallet"}
          </button>
          <button
            type="button"
            className="text-gray-500 underline mt-2"
            onClick={onClose}
          >
            Cancelar
          </button>
        </form>
      )}
    </div>
  );
};