import React, { useState } from "react";

interface TransferNFTFormProps {
  nftId: string;
  onTransfer: (nftId: string, toAddress: string) => Promise<void>;
}

export const TransferNFTForm: React.FC<TransferNFTFormProps> = ({ nftId, onTransfer }) => {
  const [toAddress, setToAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      await onTransfer(nftId, toAddress);
      setMsg("Transferencia enviada.");
      setToAddress("");
    } catch {
      setMsg("Error al transferir NFT.");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full mt-2 flex flex-col items-center gap-2">
      <input
        type="text"
        placeholder="Dirección destino"
        value={toAddress}
        onChange={e => setToAddress(e.target.value)}
        className="border px-2 py-1 rounded w-full text-xs"
        required
      />
      <button
        type="submit"
        disabled={loading || !toAddress}
        className="bg-emerald-600 text-white px-3 py-1 rounded text-xs font-semibold"
      >
        {loading ? "Transfiriendo..." : "Transferir NFT"}
      </button>
      {msg && <div className="text-xs text-green-700">{msg}</div>}
    </form>
  );
};