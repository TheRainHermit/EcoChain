import React from "react";
import { Server, Database, ShieldCheck, Bot, Cpu, Gamepad2, MapPin, Wallet } from "lucide-react";

const techs = [
  {
    icon: <Server className="w-12 h-12 text-emerald-400 mb-2" />,
    title: "Backend Python",
    desc: "API RESTful, lógica de negocio y conexión con PostgreSQL.",
  },
  {
    icon: <Database className="w-12 h-12 text-yellow-300 mb-2" />,
    title: "PostgreSQL",
    desc: "Base de datos robusta y escalable para usuarios, transacciones y NFTs.",
  },
  {
    icon: <ShieldCheck className="w-12 h-12 text-emerald-300 mb-2" />,
    title: "Seguridad Blockchain",
    desc: "Gestión de wallets, firmas y trazabilidad de acciones.",
  },
  {
    icon: <Bot className="w-12 h-12 text-green-200 mb-2" />,
    title: "IA Integrada",
    desc: "Reconocimiento de materiales y recomendaciones inteligentes.",
  },
];

const TechnicalDetails: React.FC = () => (
  <main className="max-w-5xl mx-auto py-16 px-4 text-white">
    <h2 className="text-4xl font-extrabold mb-8 text-center text-emerald-300 drop-shadow-lg">
      Detalles Técnicos
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-12">
      {techs.map((t, i) => (
        <div
          key={i}
          className="bg-gradient-to-br from-emerald-900 via-green-900 to-emerald-800 rounded-xl shadow-lg p-6 flex flex-col items-center hover:scale-105 transition-transform"
        >
          {t.icon}
          <h3 className="font-bold text-lg mb-2">{t.title}</h3>
          <p className="text-emerald-100 text-center">{t.desc}</p>
        </div>
      ))}
    </div>
    <div className="bg-emerald-950/70 rounded-xl p-8 shadow-lg text-center text-emerald-100 mb-12">
      <p>
        EcoChain utiliza tecnología blockchain y contratos inteligentes para
        registrar y recompensar acciones de reciclaje, permitiendo a los usuarios
        obtener EcoCoins y NFTs por su contribución al medio ambiente. El sistema
        es seguro, transparente y escalable.
      </p>
    </div>

    {/* Sección de planos y hardware */}
    <section className="mt-16">
      <h3 className="text-2xl font-bold mb-4 flex items-center justify-center gap-2 text-emerald-200">
        <Cpu className="w-7 h-7 text-yellow-300" />
        Futuro Hardware y Planos de EcoChain
      </h3>
      <div className="flex flex-col md:flex-row items-center gap-8 bg-emerald-950/70 rounded-xl p-8 shadow-lg">
        <img
          src="/src/assets/planoecochainhardware.jpg"
          alt="Plano hardware EcoChain"
          className="w-full md:w-1/2 rounded-lg shadow-lg border-2 border-emerald-400"
        />
        <div className="md:w-1/2 mt-6 md:mt-0 text-emerald-100 text-lg">
          <p>
            Estamos desarrollando un prototipo de hardware para puntos de reciclaje inteligentes,
            capaces de identificar materiales, registrar depósitos y conectar con la blockchain de EcoChain.
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2 text-emerald-200">
            <li>Identificación automática de residuos</li>
            <li>Registro seguro de transacciones</li>
            <li>Interfaz amigable para usuarios</li>
            <li>Integración directa con EcoCoins y NFTs</li>
          </ul>
          <p className="mt-4 italic text-emerald-300">
            ¡Pronto compartiremos más detalles y avances sobre el hardware EcoChain!
          </p>
        </div>
      </div>
    </section>

    {/* Sección del desarrollo del juego */}
    <section className="mt-16">
      <h3 className="text-2xl font-bold mb-4 flex items-center justify-center gap-2 text-emerald-200">
        <Gamepad2 className="w-7 h-7 text-yellow-300" />
        Desarrollo del Juego EcoChain GO
      </h3>
      <div className="flex flex-col md:flex-row items-center gap-8 bg-emerald-950/70 rounded-xl p-8 shadow-lg">
        <div className="md:w-1/2 text-emerald-100 text-lg">
          <p>
            EcoChain GO será un juego móvil desarrollado con el motor <span className="font-bold text-emerald-300">Unity</span>, integrando módulos de <span className="font-bold text-yellow-200">realidad aumentada</span> y <span className="font-bold text-emerald-200">geolocalización</span>.
            Los usuarios podrán explorar su ciudad, encontrar puntos de reciclaje y depositar residuos para ganar <span className="font-bold text-emerald-200">NFTs ecológicos</span> y <span className="font-bold text-yellow-200">EcoCoins</span>.
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2 text-emerald-200">
            <li className="flex items-center gap-2"><MapPin className="w-5 h-5" /> Geolocalización de puntos EcoChain</li>
            <li className="flex items-center gap-2"><Gamepad2 className="w-5 h-5" /> Realidad aumentada para interacción con residuos</li>
            <li className="flex items-center gap-2"><Wallet className="w-5 h-5" /> Integración con wallet Web3 y recompensas NFT</li>
          </ul>
          <p className="mt-4 italic text-emerald-300">
            ¡Convierte el reciclaje en una aventura y compite con tus amigos!
          </p>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <img
            src="/src/assets/ecochain-preview.png"
            alt="Preview EcoChain GO"
            className="w-full max-w-xs rounded-lg shadow-lg border-2 border-emerald-400"
          />
        </div>
      </div>
    </section>
  </main>
);

export default TechnicalDetails;