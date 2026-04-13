export interface Ingredient {
  id: string;
  name: string;
  category: 'Proteínas' | 'Verduras' | 'Frutas' | 'Granos' | 'Lácteos' | 'Otros';
}

export type Culture = 
  | 'México' | 'Japón' | 'Italia' | 'India' | 'Tailandia' 
  | 'Francia' | 'España' | 'China' | 'Corea' | 'Perú' 
  | 'Marruecos' | 'Grecia';

export interface FlavorProfile {
  spicy: number;
  herbal: number;
  citric: number;
  sweet: number;
  umami: number;
}

export interface UserPreferences {
  healthy: boolean;
  fast: boolean;
  gourmet: boolean;
  budget: boolean;
  ensalada: boolean;
  sopa: boolean;
  antipasto: boolean;
  pinchos: boolean;
}

export interface Recipe {
  name: string;
  history: string;
  ingredients: {
    item: string;
    amount: string;
    alternative?: string;
  }[];
  instructions: string[];
  prepTime: string;
  nutrition: {
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
  };
  chefTips: string[];
  image?: string;
  cultures?: Culture[];
  flavorProfile?: FlavorProfile;
  mainIngredients?: string[];
}
