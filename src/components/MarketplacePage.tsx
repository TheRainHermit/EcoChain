import React, { useEffect, useState } from "react";
import { useWallet } from "../context/WalletContext";

interface NFTListing {
  id: number;
  tokenId: string;
  metadata: any;
  price_eth: number;
  seller: string;
  status: string;
}

export const MarketplacePage: React.FC = () => {
  const { account, loginType, jwt, isConnected } = useWallet();
  const [nfts, setNfts] = useState<any[]>([]);

  useEffect(() => {
    const fetchNFTs = async () => {
      const headers: Record<string, string> = {};
      if (loginType === "custodial" && jwt) {
        headers["Authorization"] = `Bearer ${jwt}`;
      }
      const res = await fetch("/api/marketplace/listings", { headers });
      const data = await res.json();
      setNfts(data);
    };
    fetchNFTs();
  }, [loginType, jwt]);

  // Ejemplo de compra de NFT
  const handleBuy = async (nftId: string) => {
    if (!account) return;
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (loginType === "custodial" && jwt) {
      headers["Authorization"] = `Bearer ${jwt}`;
    }
    const res = await fetch("/api/marketplace/buy", {
      method: "POST",
      headers,
      body: JSON.stringify({ nft_id: nftId, buyer_address: account }),
    });
    const data = await res.json();
    // Muestra feedback al usuario...
  };

  return (
    <section className="bg-gradient-to-br from-green-50 via-emerald-100 to-green-200 rounded-2xl p-8 shadow-2xl mb-8">
      <h2 className="text-3xl font-extrabold mb-8 text-green-700 flex items-center gap-2 drop-shadow">
        <span role="img" aria-label="market" className="animate-pulse">
          🛒
        </span>{" "}
        Marketplace de NFTs
      </h2>
      {nfts.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          <span role="img" aria-label="empty" className="text-3xl">
            😕
          </span>
          <div className="mt-2">No hay NFTs disponibles en este momento.</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {nfts.map((nft) => (
            <div key={nft.id} className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
              <img src={nft.metadata?.image} alt="NFT" className="w-32 h-32 object-cover rounded-lg mb-2" />
              <div className="font-bold text-green-700">{nft.metadata?.name}</div>
              <div className="text-sm text-gray-500 text-center">{nft.metadata?.description}</div>
              <div className="text-emerald-700 font-bold mt-2">{nft.price_eth} ETH</div>
              <div className="mb-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold shadow ${
                    nft.status === "active"
                      ? "bg-green-100 text-green-700"
                      : nft.status === "sold"
                      ? "bg-gray-200 text-gray-500"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {nft.status === "active"
                    ? "Disponible"
                    : nft.status === "sold"
                    ? "Vendido"
                    : "No disponible"}
                </span>
              </div>
              <button
                onClick={() => handleBuy(nft.id)}
                className={`mt-auto bg-gradient-to-r from-emerald-500 to-green-600 text-white px-4 py-2 rounded-full font-semibold shadow hover:scale-105 hover:bg-green-700 transition-transform ${
                  nft.status !== "active"
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                disabled={nft.status !== "active"}
              >
                Comprar NFT
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default MarketplacePage;