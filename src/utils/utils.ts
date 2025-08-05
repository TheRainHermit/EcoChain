import { WasteType } from './types';

export const wasteTypes: WasteType[] = [
  {
    id: 'plastic',
    name: 'Plástico',
    icon: 'Recycle',
    pointsPerUnit: 10,
    color: 'from-blue-400 to-blue-600',
    description: 'Botellas, envases, bolsas'
  },
  {
    id: 'paper',
    name: 'Papel',
    icon: 'FileText',
    pointsPerUnit: 5,
    color: 'from-orange-400 to-orange-600',
    description: 'Periódicos, revistas, cartón'
  },
  {
    id: 'glass',
    name: 'Vidrio',
    icon: 'Wine',
    pointsPerUnit: 15,
    color: 'from-green-400 to-green-600',
    description: 'Botellas, frascos'
  },
  {
    id: 'metal',
    name: 'Metal',
    icon: 'Zap',
    pointsPerUnit: 20,
    color: 'from-gray-400 to-gray-600',
    description: 'Latas, aluminio'
  },
  {
    id: 'electronic',
    name: 'Electrónico',
    icon: 'Smartphone',
    pointsPerUnit: 50,
    color: 'from-purple-400 to-purple-600',
    description: 'Dispositivos, baterías'
  }
];
