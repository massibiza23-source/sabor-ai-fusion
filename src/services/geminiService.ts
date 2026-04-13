import { GoogleGenAI, Type } from "@google/genai";
import { Recipe, Ingredient, Culture, FlavorProfile, UserPreferences } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const RECIPE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    history: { type: Type.STRING },
    ingredients: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          item: { type: Type.STRING },
          amount: { type: Type.STRING },
          alternative: { type: Type.STRING },
        },
        required: ["item", "amount"],
      },
    },
    instructions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    prepTime: { type: Type.STRING },
    nutrition: {
      type: Type.OBJECT,
      properties: {
        calories: { type: Type.STRING },
        protein: { type: Type.STRING },
        carbs: { type: Type.STRING },
        fat: { type: Type.STRING },
      },
      required: ["calories", "protein", "carbs", "fat"],
    },
    chefTips: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    cultures: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    flavorProfile: {
      type: Type.OBJECT,
      properties: {
        spicy: { type: Type.NUMBER },
        herbal: { type: Type.NUMBER },
        citric: { type: Type.NUMBER },
        sweet: { type: Type.NUMBER },
        umami: { type: Type.NUMBER },
      },
      required: ["spicy", "herbal", "citric", "sweet", "umami"],
    },
    mainIngredients: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
  },
  required: ["name", "history", "ingredients", "instructions", "prepTime", "nutrition", "chefTips", "cultures", "flavorProfile", "mainIngredients"],
};

export async function generateRecipe(
  ingredients: Ingredient[],
  cultures: Culture[],
  flavor: FlavorProfile,
  prefs: UserPreferences,
  excluded: string,
  allergies: string
): Promise<Recipe> {
  const ingredientsList = ingredients.map(i => i.name).join(", ");
  const culturesList = cultures.join(" y ");
  const prefsList = Object.entries(prefs)
    .filter(([_, v]) => v)
    .map(([k, _]) => k)
    .join(", ");

  const prompt = `
    Actúa como un Chef Ejecutivo de estrella Michelin especializado en cocina de fusión.
    Tu misión es crear una receta gourmet única basada en los siguientes parámetros:

    - Ingredientes base disponibles: ${ingredientsList}
    - Fusión cultural o regional: ${culturesList}
    - Perfil de sabor deseado (0-100):
      * Picante: ${flavor.spicy}
      * Herbal: ${flavor.herbal}
      * Cítrico: ${flavor.citric}
      * Dulce: ${flavor.sweet}
      * Umami: ${flavor.umami}
    - Preferencias: ${prefsList}
    - Evitar estos ingredientes: ${excluded}
    - Alergias a considerar: ${allergies}

    REGLAS CRÍTICAS:
    1. Creatividad Extrema: No des recetas genéricas. Busca combinaciones audaces pero equilibradas.
    2. Realismo: La receta debe ser cocinable en una cocina doméstica bien equipada.
    3. Estética: El nombre del plato debe sonar sofisticado.
    4. Historia: Explica brevemente cómo la fusión de las culturas o regiones seleccionadas inspiró este plato. Si se menciona una ciudad específica, incorpora su esencia.
    5. Instrucciones: Deben ser claras, técnicas y profesionales.
    6. Versatilidad: Puedes generar cualquier tipo de plato: Entrantes, Platos Principales, Ensaladas Gourmet, Sopas Sofisticadas o Postres de Autor.
    7. Tips de Chef: Incluye consejos sobre emplatado, técnica o maridaje.

    Genera la respuesta estrictamente en formato JSON siguiendo el esquema proporcionado.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: RECIPE_SCHEMA,
      },
    });

    if (!response.text) {
      throw new Error("No se pudo generar la receta.");
    }

    return JSON.parse(response.text) as Recipe;
  } catch (error) {
    console.error("Error generating recipe:", error);
    throw error;
  }
}

export async function generateRecipeImage(recipeName: string, history: string): Promise<string> {
  const prompt = `Una fotografía profesional de alta cocina (fine dining) del plato: ${recipeName}. 
  Contexto: ${history}. 
  Estética: Iluminación dramática, estilo minimalista, emplatado artístico, fondo oscuro cálido, calidad 4k, fotografía gastronómica de revista.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: [{ text: prompt }],
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No se generó ninguna imagen");
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
}

