import React from 'react';
import { Recycle, Mail, Twitter, Instagram, CheckCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  const acceptedMaterials = [
    'Plásticos',
    'Papel y cartón', 
    'Vidrio',
    'Electrónicos'
  ];

  return (
    <footer className="bg-gray-800 text-white py-12 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Recycle className="h-8 w-8 text-green-400" />
              <span className="text-xl font-bold">EcoChain</span>
            </div>
            <p className="text-gray-300">
              Incentivando el reciclaje a través de tecnología blockchain.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-gray-300">ecochainsystem@gmail.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Twitter className="h-4 w-4 text-gray-400" />
                <a href="https://twitter.com/EcoChainCali" target="_blank" rel="noopener noreferrer">
                  <span className="text-gray-300">@EcoChainCali</span>
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Instagram className="h-4 w-4 text-gray-400" />
                <a href="https://www.instagram.com/ecochaincali" target="_blank" rel="noopener noreferrer">
                  <span className="text-gray-300">@ecochaincali</span>
                </a>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Materiales aceptados</h3>
            <div className="space-y-2">
              {acceptedMaterials.map((material, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-gray-300">{material}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 EcoChain. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};