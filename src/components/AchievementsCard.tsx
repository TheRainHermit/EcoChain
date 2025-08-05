import React from 'react';
import { Award, Lightbulb } from 'lucide-react';

export const AchievementsCard: React.FC = () => {
  const progress = 50; // 5/10 kg
  const nextMilestone = 10;
  const currentProgress = 5;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
      <div className="flex items-center space-x-3 mb-6">
        <Award className="h-8 w-8 text-green-500" />
        <h2 className="text-2xl font-bold text-gray-800">Tus logros</h2>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Próximo NFT</span>
            <span className="text-sm text-gray-600">{currentProgress}/{nextMilestone} kg</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-green-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Lightbulb className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-green-800">
              ¡Recicla {nextMilestone - currentProgress} kg más para ganar un NFT especial!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-gray-800">12</div>
            <div className="text-sm text-gray-600">Total depositado (kg)</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-gray-800">3</div>
            <div className="text-sm text-gray-600">NFTs ganados</div>
          </div>
        </div>
      </div>
    </div>
  );
};