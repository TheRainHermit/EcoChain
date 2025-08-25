import React from "react";

const goals = [
  {
    value: "+10,000 kg",
    label: "Materiales reciclados",
    color: "text-emerald-300",
    desc: "Meta: Ayudar a reciclar más de 10 toneladas de residuos en el primer año.",
  },
  {
    value: "+1,000",
    label: "Usuarios activos",
    color: "text-yellow-200",
    desc: "Meta: Crear una comunidad de más de 1,000 personas comprometidas.",
  },
  {
    value: "+500",
    label: "NFTs ecológicos entregados",
    color: "text-green-200",
    desc: "Meta: Recompensar a los usuarios con más de 500 NFTs únicos.",
  },
];

const ImpactSection: React.FC = () => (
  <section className="py-16 bg-gradient-to-br from-emerald-800 via-emerald-900 to-green-900 text-white text-center">
    <h2 className="text-3xl font-bold mb-8">Nuestros objetivos</h2>
    <div className="flex flex-col md:flex-row justify-center gap-12 mb-8 p-4">
      {goals.map((goal, i) => (
        <div
          key={i}
          className="flex flex-col items-center bg-emerald-950/60 rounded-xl p-8 shadow-lg min-w-[200px] hover:scale-105 transition-transform"
        >
          <div className={`text-4xl font-extrabold mb-2 ${goal.color}`}>
            {goal.value}
          </div>
          <div className="text-lg font-semibold mb-2">{goal.label}</div>
          <div className="text-emerald-100 text-base">{goal.desc}</div>
        </div>
      ))}
    </div>
    <blockquote className="italic font-extrabold text-emerald-100 max-w-4xl mx-auto mt-6">
      “EcoChain busca inspirar a miles de personas a reciclar y premiar su
      compromiso con el planeta.”
    </blockquote>
  </section>
);

export default ImpactSection;