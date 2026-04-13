import { Ingredient, Culture } from './types';

export const CATEGORIES = ['Proteínas', 'Verduras', 'Frutas', 'Granos', 'Lácteos', 'Otros'] as const;

export const DEFAULT_INGREDIENTS: Ingredient[] = [
  // Proteínas
  { id: '1', name: 'Pollo', category: 'Proteínas' },
  { id: '2', name: 'Salmón', category: 'Proteínas' },
  { id: '3', name: 'Tofu', category: 'Proteínas' },
  { id: 'p1', name: 'Ternera', category: 'Proteínas' },
  { id: 'p2', name: 'Cordero', category: 'Proteínas' },
  { id: 'p3', name: 'Gambas', category: 'Proteínas' },
  { id: 'p4', name: 'Pato', category: 'Proteínas' },
  { id: 'p5', name: 'Huevos', category: 'Proteínas' },
  { id: 'p6', name: 'Cerdo', category: 'Proteínas' },
  
  // Verduras
  { id: '4', name: 'Brócoli', category: 'Verduras' },
  { id: '5', name: 'Espinacas', category: 'Verduras' },
  { id: '6', name: 'Zanahoria', category: 'Verduras' },
  { id: 'v1', name: 'Berenjena', category: 'Verduras' },
  { id: 'v2', name: 'Calabacín', category: 'Verduras' },
  { id: 'v3', name: 'Espárragos', category: 'Verduras' },
  { id: 'v4', name: 'Champiñones', category: 'Verduras' },
  { id: 'v5', name: 'Pimiento', category: 'Verduras' },
  { id: 'v6', name: 'Coliflor', category: 'Verduras' },
  { id: 'v7', name: 'Tomate', category: 'Verduras' },

  // Frutas
  { id: 'f1', name: 'Manzana', category: 'Frutas' },
  { id: 'f2', name: 'Mango', category: 'Frutas' },
  { id: 'f3', name: 'Frutos Rojos', category: 'Frutas' },
  { id: 'f4', name: 'Limón', category: 'Frutas' },
  { id: 'f5', name: 'Naranja', category: 'Frutas' },
  { id: 'f6', name: 'Pera', category: 'Frutas' },
  { id: 'f7', name: 'Aguacate', category: 'Frutas' },
  
  // Granos
  { id: '7', name: 'Arroz', category: 'Granos' },
  { id: '8', name: 'Quinoa', category: 'Granos' },
  { id: '9', name: 'Pasta', category: 'Granos' },
  { id: 'g1', name: 'Cuscús', category: 'Granos' },
  { id: 'g2', name: 'Lentejas', category: 'Granos' },
  { id: 'g3', name: 'Garbanzos', category: 'Granos' },
  { id: 'g4', name: 'Avena', category: 'Granos' },
  { id: 'g5', name: 'Farro', category: 'Granos' },
  
  // Lácteos
  { id: '10', name: 'Queso', category: 'Lácteos' },
  { id: '11', name: 'Yogur', category: 'Lácteos' },
  { id: '12', name: 'Mantequilla', category: 'Lácteos' },
  { id: 'l1', name: 'Leche de Coco', category: 'Lácteos' },
  { id: 'l2', name: 'Nata', category: 'Lácteos' },
  { id: 'l3', name: 'Queso Feta', category: 'Lácteos' },
  { id: 'l4', name: 'Mascarpone', category: 'Lácteos' },
  
  // Otros
  { id: '13', name: 'Ajo', category: 'Otros' },
  { id: '14', name: 'Jengibre', category: 'Otros' },
  { id: '15', name: 'Miel', category: 'Otros' },
  { id: 'o1', name: 'Salsa de Soja', category: 'Otros' },
  { id: 'o2', name: 'Lima', category: 'Otros' },
  { id: 'o3', name: 'Albahaca', category: 'Otros' },
  { id: 'o4', name: 'Cilantro', category: 'Otros' },
  { id: 'o5', name: 'Miso', category: 'Otros' },
  { id: 'o6', name: 'Chile', category: 'Otros' },
  { id: 'o7', name: 'Vino Blanco', category: 'Otros' },
  { id: 'o8', name: 'Aceite de Oliva', category: 'Otros' },
];

export const CULTURES: Culture[] = [
  'México', 'Japón', 'Italia', 'India', 'Tailandia', 
  'Francia', 'España', 'China', 'Corea', 'Perú', 
  'Marruecos', 'Grecia'
];
