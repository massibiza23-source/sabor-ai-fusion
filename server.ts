import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

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

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "AI Flavor Engine API is running" });
  });

  app.post("/api/generate-recipe", async (req, res) => {
    const { ingredients, cultures, flavor, prefs, excluded, allergies } = req.body;
    
    const ingredientsList = ingredients.map((i: any) => i.name).join(", ");
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

      res.json(JSON.parse(response.text));
    } catch (error: any) {
      console.error("Error generating recipe:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/generate-image", async (req, res) => {
    const { recipeName, history } = req.body;
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
          return res.json({ url: `data:image/png;base64,${part.inlineData.data}` });
        }
      }
      throw new Error("No se generó ninguna imagen");
    } catch (error: any) {
      console.error("Error generating image:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
