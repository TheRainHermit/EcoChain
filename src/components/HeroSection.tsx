import React from 'react';
import { ArrowRight, Info } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 text-white py-16">
      {/* Animated background particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Main green blob */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-gradient-to-br from-emerald-400 via-green-400 to-teal-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        {/* Smaller floating blobs with different delays and colors */}
        <div className="absolute -bottom-24 left-1/4 w-64 h-64 bg-gradient-to-tr from-green-300 via-emerald-200 to-green-400 rounded-full mix-blend-multiply filter blur-2xl opacity-25 animate-bounce-slow"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-gradient-to-bl from-teal-300 via-green-200 to-emerald-300 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-bounce-slower"></div>
        <div className="absolute bottom-1/4 right-1/3 w-40 h-40 bg-gradient-to-br from-yellow-200 via-green-200 to-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-bounce-slowest"></div>
      </div>
      <div className="container mx-auto px-4 text-center relative z-10">
        <h1 className="text-4xl md:text-6xl py-4 font-extrabold mb-6 bg-gradient-to-r from-green-300 via-emerald-400 to-teal-400 bg-clip-text text-transparent drop-shadow-lg animate-fade-in">
          Recicla y gana criptomonedas
        </h1>
        <p className="text-xl md:text-2xl mb-8 opacity-95 max-w-2xl mx-auto text-green-50 font-medium drop-shadow">
          Deposita materiales reciclables y recibe pagos instantáneos en{' '}
          <span className="font-bold text-yellow-200 underline decoration-wavy">
            ETH
          </span>
          . ¡Gana{' '}
          <span className="font-bold text-emerald-200 underline decoration-wavy">
            NFTs exclusivos
          </span>{' '}
          por ser ecológico!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          <button className="flex items-center justify-center space-x-2 bg-white/90 text-green-700 px-8 py-3 rounded-full font-semibold shadow hover:bg-green-100 hover:scale-105 transition-transform border border-green-200">
            <Info className="h-5 w-5 animate-spin-slow" />
            <span>Cómo funciona</span>
          </button>
          <button className="flex items-center justify-center space-x-2 border-2 border-white text-white px-8 py-3 rounded-full font-semibold shadow hover:bg-white hover:text-green-700 hover:scale-105 transition-transform bg-gradient-to-r from-emerald-500 to-green-600">
            <span>Empezar ahora</span>
            <ArrowRight className="h-5 w-5 animate-bounce-x" />
          </button>
        </div>
      </div>
    </section>
  );
};