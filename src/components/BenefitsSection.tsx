import React from "react";
import { Leaf, Gift, ShieldCheck, Globe2 } from "lucide-react";

const benefits = [
  {
    icon: <Leaf className="w-10 h-10 text-emerald-400" />,
    title: "Recicla y gana",
    desc: "Obtén recompensas reales por tus acciones ecológicas.",
  },
  {
    icon: <Gift className="w-10 h-10 text-yellow-300" />,
    title: "EcoCoins & NFTs",
    desc: "Recibe tokens y NFTs únicos por participar.",
  },
  {
    icon: <ShieldCheck className="w-10 h-10 text-emerald-300" />,
    title: "Transparencia",
    desc: "Blockchain para trazabilidad y seguridad total.",
  },
  {
    icon: <Globe2 className="w-10 h-10 text-green-200" />,
    title: "Impacto real",
    desc: "Contribuye a un planeta más limpio y sostenible.",
  },
];

const BenefitsSection: React.FC = () => (
  <section className="py-16 bg-emerald-950 text-white">
    <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 px-4">
      {benefits.map((b, i) => (
        <div
          key={b.title}
          className="bg-gradient-to-br from-emerald-900 to-green-800 rounded-xl shadow-lg p-6 flex flex-col items-center hover:scale-105 transition-transform duration-300"
        >
          <div className="mb-3">{b.icon}</div>
          <h3 className="font-bold text-lg mb-2">{b.title}</h3>
          <p className="text-emerald-100 text-center">{b.desc}</p>
        </div>
      ))}
    </div>
  </section>
);

export default BenefitsSection;