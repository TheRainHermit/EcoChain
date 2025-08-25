import React from "react";

const mockNFTs = [
  { id: 1, name: "EcoArt #1", image: "./src/assets/nft1.png", description: "NFT ecológico de ejemplo." },
  { id: 2, name: "EcoArt #2", image: "./src/assets/nft2.png", description: "NFT ecológico de ejemplo." },
  { id: 3, name: "EcoArt #3", image: "./src/assets/nft3.png", description: "NFT ecológico de ejemplo." },
  { id: 4, name: "EcoArt #4", image: "./src/assets/nft4.png", description: "NFT ecológico de ejemplo." },
  { id: 5, name: "EcoArt #5", image: "./src/assets/nft5.png", description: "NFT ecológico de ejemplo." },
  { id: 6, name: "EcoArt #6", image: "./src/assets/nft6.png", description: "NFT ecológico de ejemplo." },
  { id: 7, name: "EcoArt #7", image: "./src/assets/nft7.png", description: "NFT ecológico de ejemplo." },
  { id: 8, name: "EcoArt #8", image: "./src/assets/nft8.png", description: "NFT ecológico de ejemplo." },
  { id: 9, name: "EcoArt #9", image: "./src/assets/nft9.png", description: "NFT ecológico de ejemplo." },
  { id: 10, name: "EcoArt #10", image: "./src/assets/nft10.png", description: "NFT ecológico de ejemplo." },
  { id: 11, name: "EcoArt #11", image: "./src/assets/nft11.png", description: "NFT ecológico de ejemplo." },
  { id: 12, name: "EcoArt #12", image: "./src/assets/nft12.png", description: "NFT ecológico de ejemplo." },
  { id: 13, name: "EcoArt #13", image: "./src/assets/nft13.png", description: "NFT ecológico de ejemplo." },
  { id: 14, name: "EcoArt #14", image: "./src/assets/nft14.png", description: "NFT ecológico de ejemplo." },
  { id: 15, name: "EcoArt #15", image: "./src/assets/nft15.png", description: "NFT ecológico de ejemplo." },
];

const MarketplacePage: React.FC = () => (
  <main className="max-w-6xl mx-auto py-16 px-4">
    <h2 className="text-4xl font-extrabold mb-8 text-center text-emerald-300 drop-shadow-lg">
      Marketplace de NFTs
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
      {mockNFTs.map(nft => (
        <div
          key={nft.id}
          className="bg-gradient-to-br from-emerald-900 via-green-900 to-emerald-800 rounded-2xl shadow-xl p-6 flex flex-col items-center hover:scale-105 transition-transform duration-300"
        >
          <img
            src={nft.image}
            alt={nft.name}
            className="w-40 h-40 object-cover rounded-xl mb-4 border-4 border-emerald-400 shadow-lg"
          />
          <h3 className="font-bold text-xl text-white mb-2">{nft.name}</h3>
          <p className="text-emerald-100 text-center">{nft.description}</p>
        </div>
      ))}
    </div>
    <div className="mt-12 text-center text-emerald-200 italic">
      Pronto podrás mintear, intercambiar y coleccionar NFTs ecológicos únicos.
    </div>
  </main>
);

export default MarketplacePage;