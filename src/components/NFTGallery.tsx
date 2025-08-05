import React, { useEffect, useState } from "react";
import { Image } from "lucide-react";
import { useWallet } from "../context/WalletContext";
import { TransferNFTForm } from "./TransferNFTForm";

interface NFT {
  id: string;
  image: string;
  name: string;
  description: string;
}

export const NFTGallery: React.FC = () => {
  const { account, loginType, jwt } = useWallet();
  const [nfts, setNfts] = useState<NFT[]>([]);

  useEffect(() => {
    if (!account) return;
    const fetchNFTs = async () => {
      const headers: Record<string, string> = {};
      if (loginType === "custodial" && jwt) {
        headers["Authorization"] = `Bearer ${jwt}`;
      }
      const res = await fetch(`/api/nfts/user/${account}`, { headers });
      const data = await res.json();
      setNfts(data);
    };
    fetchNFTs();
  }, [account, loginType, jwt]);

  // Ejemplo de transferencia de NFT
  const handleTransfer = async (nftId: string, toAddress: string) => {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (loginType === "custodial" && jwt) {
      headers["Authorization"] = `Bearer ${jwt}`;
    }
    const res = await fetch("/api/nfts/transfer", {
      method: "POST",
      headers,
      body: JSON.stringify({ nft_id: nftId, from_wallet: account, to_wallet: toAddress }),
    });
    const data = await res.json();
    // Maneja el resultado...
  };

  return (
    <section className="bg-gradient-to-br from-green-50 via-emerald-100 to-green-200 rounded-2xl p-8 shadow-xl mb-8 animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <Image className="h-8 w-8 text-green-500 animate-pulse" />
        <h2 className="text-2xl font-bold text-green-700 drop-shadow">Tus NFTs</h2>
      </div>
      {nfts.length === 0 ? (
        <div className="text-center text-gray-500 py-8">No tienes NFTs aún</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {nfts.map((nft) => (
            <div key={nft.id} className="bg-white rounded-xl shadow p-4 flex flex-col items-center hover:shadow-emerald-200 transition-shadow">
              <img src={nft.image} alt={nft.name} className="w-32 h-32 object-cover rounded-lg mb-2 border border-green-100 shadow" />
              <div className="font-bold text-green-700">{nft.name}</div>
              <div className="text-sm text-gray-500 text-center">{nft.description}</div>
              {/* Transfer UI */}
              <TransferNFTForm nftId={nft.id} onTransfer={handleTransfer} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};