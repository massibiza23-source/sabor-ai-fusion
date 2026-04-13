import { Recipe } from '../types';

export function generateCookbookHtml(recipes: Recipe[]): string {
  const recipesHtml = recipes.map(recipe => `
    <article class="recipe-card">
      ${recipe.image ? `<div class="recipe-image-container"><img src="${recipe.image}" class="recipe-image" alt="${recipe.name}"></div>` : ''}
      <div class="recipe-header">
        <h1>${recipe.name}</h1>
        <div class="meta">
          <span>⏱ ${recipe.prepTime}</span>
          <span>🔥 GOURMET</span>
          ${recipe.cultures ? `<span style="margin-left: 10px; opacity: 0.7;">🌍 ${recipe.cultures.join(', ')}</span>` : ''}
        </div>
      </div>
      
      ${recipe.flavorProfile ? `
        <div style="display: flex; gap: 15px; margin-bottom: 20px; font-size: 0.7rem; color: var(--stone-400); text-transform: uppercase;">
          ${Object.entries(recipe.flavorProfile).map(([k, v]) => `
            <div>
              <div style="height: 4px; width: 30px; background: rgba(255,255,255,0.1); border-radius: 2px; margin-bottom: 4px;">
                <div style="height: 100%; width: ${v}%; background: var(--copper); border-radius: 2px;"></div>
              </div>
              ${k}
            </div>
          `).join('')}
        </div>
      ` : ''}

      <div class="history">
        <p>"${recipe.history}"</p>
      </div>

      <div class="grid">
        <section>
          <h3>🛒 Ingredientes</h3>
          <ul>
            ${recipe.ingredients.map(ing => `
              <li>
                <strong>${ing.item}</strong> - ${ing.amount}
                ${ing.alternative ? `<br><small>Alt: ${ing.alternative}</small>` : ''}
              </li>
            `).join('')}
          </ul>
        </section>

        <section>
          <h3>👨‍🍳 Preparación</h3>
          <ol>
            ${recipe.instructions.map(step => `<li>${step}</li>`).join('')}
          </ol>
        </section>
      </div>

      <div class="footer-grid">
        <div class="nutrition">
          <h4>📊 Nutrición</h4>
          <p>CAL: ${recipe.nutrition.calories} | PROT: ${recipe.nutrition.protein} | CARB: ${recipe.nutrition.carbs} | FAT: ${recipe.nutrition.fat}</p>
        </div>
        <div class="tips">
          <h4>💡 Chef Tips</h4>
          <ul>
            ${recipe.chefTips.map(tip => `<li>${tip}</li>`).join('')}
          </ul>
        </div>
      </div>
    </article>
  `).join('<hr class="page-break">');

  return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mi Recetario Gourmet - AI Flavor Engine</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
    <style>
        :root {
            --copper: #B87333;
            --chef-black: #0C0C0C;
            --chef-gray: #1A1A1A;
            --stone-200: #e7e5e4;
            --stone-400: #a8a29e;
        }
        body {
            font-family: 'Inter', sans-serif;
            background-color: var(--chef-black);
            color: var(--stone-200);
            margin: 0;
            padding: 40px 20px;
            line-height: 1.6;
        }
        .container { max-width: 800px; margin: 0 auto; }
        header { text-align: center; margin-bottom: 60px; }
        header h1 { font-family: 'Playfair Display', serif; font-size: 3rem; color: white; margin: 0; }
        header p { color: var(--copper); text-transform: uppercase; letter-spacing: 2px; font-size: 0.8rem; }
        
        .recipe-card {
            background: var(--chef-gray);
            border: 1px solid rgba(255,255,255,0.05);
            border-radius: 24px;
            padding: 40px;
            margin-bottom: 40px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
            overflow: hidden;
        }
        .recipe-image-container {
            margin: -40px -40px 30px -40px;
            height: 300px;
            overflow: hidden;
        }
        .recipe-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .recipe-header h1 { font-family: 'Playfair Display', serif; font-size: 2.5rem; margin-bottom: 10px; }
        .meta { color: var(--copper); font-size: 0.8rem; font-weight: 600; letter-spacing: 1px; margin-bottom: 20px; }
        
        .history { 
            background: rgba(255,255,255,0.03); 
            padding: 20px; 
            border-radius: 16px; 
            font-style: italic; 
            color: var(--stone-400);
            margin-bottom: 30px;
        }
        
        .grid { display: grid; grid-template-columns: 1fr 1.5fr; gap: 40px; }
        @media (max-width: 600px) { .grid { grid-template-columns: 1fr; } }
        
        h3 { color: var(--copper); border-bottom: 1px solid rgba(184, 115, 51, 0.3); padding-bottom: 10px; }
        ul, ol { padding-left: 20px; }
        li { margin-bottom: 15px; }
        
        .footer-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 40px; }
        .nutrition, .tips { background: rgba(255,255,255,0.02); padding: 20px; border-radius: 16px; }
        h4 { color: var(--stone-400); text-transform: uppercase; font-size: 0.7rem; margin-top: 0; }
        
        .page-break { border: 0; border-top: 1px dashed rgba(255,255,255,0.1); margin: 60px 0; }
        
        @media print {
            body { background: white; color: black; }
            .recipe-card { box-shadow: none; border: 1px solid #eee; background: white; page-break-inside: avoid; }
            .recipe-header h1, h3, .meta { color: #804000; }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>Mi Recetario Gourmet</h1>
            <p>AI Flavor Engine — Arquitectura Culinaria</p>
        </header>
        ${recipesHtml}
    </div>
</body>
</html>
  `;
}
