import { Recipe, Ingredient, Culture, FlavorProfile, UserPreferences } from "../types";

export async function generateRecipe(
  ingredients: Ingredient[],
  cultures: Culture[],
  flavor: FlavorProfile,
  prefs: UserPreferences,
  excluded: string,
  allergies: string
): Promise<Recipe> {
  try {
    const response = await fetch("/api/generate-recipe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ingredients,
        cultures,
        flavor,
        prefs,
        excluded,
        allergies,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al generar la receta");
    }

    return await response.json();
  } catch (error) {
    console.error("Error generating recipe:", error);
    throw error;
  }
}

export async function generateRecipeImage(recipeName: string, history: string): Promise<string> {
  try {
    const response = await fetch("/api/generate-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recipeName,
        history,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al generar la imagen");
    }

    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
}

