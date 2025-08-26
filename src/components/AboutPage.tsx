import React from "react";
import { Users, Target, HeartHandshake } from "lucide-react";

const team = [
  { name: "Darlyn Eduardo Carabalí", role: "CEO/Especialista Blockchain" },
  { name: "Miguel Angel Fabra", role: "Desarrollador Full Stack/Videojuegos" },
  { name: "José Rodriguez", role: "Desarrollador Hardware, IA y Machine Learning" },
  { name: "Daniel Cuartas", role: "Desarrollador Full Stack/Redes Sociales" },
  { name: "Miguel Ángel Muñoz Castaño", role: "Contador" },
];

const AboutPage: React.FC = () => (
  <main className="max-w-4xl mx-auto py-12 px-4 text-white">
    <h2 className="text-4xl font-extrabold mb-8 text-center text-emerald-300 drop-shadow-lg">
      Acerca de EcoChain
    </h2>
    <div className="flex flex-col md:flex-row gap-10 mb-12 justify-center">
      <div className="flex-1 bg-gradient-to-br from-emerald-900 via-green-900 to-emerald-800 rounded-xl shadow-lg p-8 flex flex-col items-center">
        <Users className="w-10 h-10 text-emerald-400 mb-2" />
        <h3 className="font-bold text-lg mb-2">Nuestro equipo</h3>
        <ul className="text-emerald-100 text-center">
          {team.map((m, i) => (
            <li key={i} className="mb-1">
              <span className="font-semibold">{m.name}</span> – {m.role}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-1 bg-gradient-to-br from-green-900 via-emerald-900 to-green-800 rounded-xl shadow-lg p-8 flex flex-col items-center">
        <Target className="w-10 h-10 text-yellow-300 mb-2" />
        <h3 className="font-bold text-lg mb-2">Nuestro objetivo</h3>
        <p className="text-emerald-100 text-center mb-4">
          Incentivar el reciclaje y la economía circular usando blockchain y NFTs,
          premiando a quienes cuidan el planeta.
        </p>
        <HeartHandshake className="w-10 h-10 text-pink-300 mb-2" />
        <h3 className="font-bold text-lg mb-2">Nuestros valores</h3>
        <p className="text-emerald-100 text-center">
          Sostenibilidad, innovación, transparencia y comunidad.
        </p>
      </div>
    </div>
    <div className="bg-gradient-to-br from-emerald-900 to-green-900 rounded-xl shadow-lg p-8">
      <h3 className="text-xl font-bold mb-4 text-center">
        Únete a nuestra misión
      </h3>
      <p className="text-emerald-100 mb-4">
        En EcoChain, creemos que cada acción cuenta. Al unirte a nuestra plataforma,
        no solo contribuyes a un futuro más sostenible, sino que también te
        conviertes en parte de una comunidad global comprometida con el cambio.
      </p>
      <p className="text-emerald-100 mb-4">
        Descubre cómo nuestra tecnología basada en blockchain está revolucionando
        el mundo del reciclaje y la economía circular. Juntos, podemos hacer una
        diferencia real y duradera.
      </p>
      <div className="flex justify-center">
        <p
          className="bg-gradient-to-r from-emerald-400 to-green-300 text-transparent bg-clip-text font-extrabold text-2xl"
        >
          ¡Comienza tu viaje ecológico hoy!
        </p>
      </div>
    </div>
  </main>
);

export default AboutPage;