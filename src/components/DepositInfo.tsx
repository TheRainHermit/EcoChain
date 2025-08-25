import React from "react";
import { wasteTypes } from "../utils/utils";
import * as Icons from "lucide-react";

export const DepositInfo: React.FC = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
      {wasteTypes.map((waste) => {
        const IconComponent = Icons[
          waste.icon as keyof typeof Icons
        ] as React.ComponentType<any>;
        return (
          <div
            key={waste.id}
            className="relative p-6 rounded-2xl transition-all duration-300 bg-white shadow hover:shadow-xl"
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${waste.color} rounded-2xl opacity-90`}
            />
            <div className="relative text-white text-center">
              <IconComponent size={32} className="mx-auto mb-2" />
              <h3 className="font-bold text-sm">{waste.name}</h3>
              <p className="text-xs opacity-90 mt-1">
                {waste.pointsPerUnit} pts/unidad
              </p>
              <p className="text-xs opacity-75 mt-1">{waste.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
