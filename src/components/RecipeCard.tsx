import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Clock, 
  ChefHat, 
  Info, 
  ShoppingCart, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp,
  Flame,
  Scale,
  Camera,
  Loader2,
  BookmarkPlus,
  Check
} from 'lucide-react';
import { Recipe } from '../types';
import { cn } from '../lib/utils';
import { generateRecipeImage } from '../services/geminiService';

interface Props {
  recipe: Recipe;
  onAddToShoppingList: (items: string[]) => void;
  onSaveToCookbook?: (recipe: Recipe) => void;
  isSaved?: boolean;
  onImageGenerated?: (url: string) => void;
}

export default function RecipeCard({ recipe, onAddToShoppingList, onSaveToCookbook, isSaved, onImageGenerated }: Props) {
  const [expanded, setExpanded] = useState<string | null>('instructions');
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [generatedImage, setGeneratedImage] = useState<string | null>(recipe.image || null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const toggleStep = (index: number) => {
    setCompletedSteps(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const handleAddAll = () => {
    onAddToShoppingList(recipe.ingredients.map(i => i.item));
  };

  const handleGenerateImage = async () => {
    setIsGeneratingImage(true);
    try {
      const imageUrl = await generateRecipeImage(recipe.name, recipe.history);
      setGeneratedImage(imageUrl);
      if (onImageGenerated) onImageGenerated(imageUrl);
    } catch (error) {
      console.error("Failed to generate image", error);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel rounded-3xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10"
    >
      {/* Hero Section - Image Only */}
      <div className="relative h-72 bg-chef-gray flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <AnimatePresence mode="wait">
            {generatedImage ? (
              <motion.img 
                key="generated"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={generatedImage} 
                alt={recipe.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <motion.img 
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.2 }}
                src={`https://picsum.photos/seed/${recipe.name}/800/400`} 
                alt={recipe.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            )}
          </AnimatePresence>
        </div>
        
        {/* Image Generation Button */}
        {!generatedImage && (
          <button
            onClick={handleGenerateImage}
            disabled={isGeneratingImage}
            className="absolute top-4 right-4 z-20 bg-chef-black/60 backdrop-blur-md border border-white/10 p-2 rounded-full text-copper hover:bg-copper hover:text-white transition-all disabled:opacity-50"
            title="Generar foto real con IA"
          >
            {isGeneratingImage ? <Loader2 className="w-5 h-5 animate-spin" /> : <Camera className="w-5 h-5" />}
          </button>
        )}
      </div>

      {/* Title & Meta Section - Below Photo */}
      <div className="px-6 py-8 border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              {recipe.name}
            </h2>
            <div className="flex items-center gap-4 text-xs text-copper uppercase tracking-widest font-medium">
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {recipe.prepTime}</span>
              <span className="flex items-center gap-1"><Flame className="w-3 h-3" /> Gourmet</span>
            </div>
            {recipe.cultures && recipe.cultures.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {recipe.cultures.map(c => (
                  <span key={c} className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[9px] text-stone-400 uppercase tracking-tighter">
                    {c}
                  </span>
                ))}
              </div>
            )}
          </div>
          
          {onSaveToCookbook && (
            <button
              onClick={() => onSaveToCookbook(recipe)}
              disabled={isSaved}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all border",
                isSaved 
                  ? "bg-green-500/10 border-green-500/50 text-green-500" 
                  : "bg-copper/10 border-copper/50 text-copper hover:bg-copper hover:text-white"
              )}
            >
              {isSaved ? (
                <><Check className="w-4 h-4" /> Guardado</>
              ) : (
                <><BookmarkPlus className="w-4 h-4" /> Guardar en Recetario</>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-8">
        {/* History */}
        <div className="bg-white/5 rounded-2xl p-4 border border-white/5 italic text-sm text-stone-400 leading-relaxed">
          <Info className="w-4 h-4 text-copper mb-2 not-italic" />
          "{recipe.history}"
        </div>

        {/* Ingredients */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-copper" /> Ingredientes
            </h3>
            <button 
              onClick={handleAddAll}
              className="text-[10px] uppercase tracking-widest text-copper hover:underline"
            >
              Añadir todo a la lista
            </button>
          </div>
          <div className="grid gap-2">
            {recipe.ingredients.map((ing, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 border-b border-white/5 text-sm">
                <span className="text-stone-300">{ing.item}</span>
                <div className="text-right">
                  <span className="text-stone-500 font-mono text-xs">{ing.amount}</span>
                  {ing.alternative && (
                    <p className="text-[10px] text-stone-600 italic">Alt: {ing.alternative}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Instructions */}
        <section className="space-y-4">
          <button 
            onClick={() => setExpanded(expanded === 'instructions' ? null : 'instructions')}
            className="w-full flex items-center justify-between text-lg font-medium group"
          >
            <span className="flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-copper" /> Preparación
            </span>
            {expanded === 'instructions' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
          <AnimatePresence>
            {expanded === 'instructions' && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="space-y-4 pt-2">
                  {recipe.instructions.map((step, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => toggleStep(idx)}
                      className={cn(
                        "flex gap-4 p-3 rounded-xl transition-all cursor-pointer border",
                        completedSteps.includes(idx) 
                          ? "bg-copper/5 border-copper/20 opacity-50" 
                          : "bg-white/5 border-transparent hover:border-white/10"
                      )}
                    >
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-copper/20 text-copper flex items-center justify-center text-xs font-bold">
                        {completedSteps.includes(idx) ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                      </div>
                      <p className={cn("text-sm leading-relaxed", completedSteps.includes(idx) && "line-through")}>
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Nutrition & Tips */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-chef-gray rounded-2xl p-4 border border-white/5 space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-stone-500 flex items-center gap-2">
              <Scale className="w-3 h-3" /> Nutrición
            </h4>
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
              <div className="flex flex-col">
                <span className="text-stone-600">CAL</span>
                <span className="text-stone-300">{recipe.nutrition.calories}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-stone-600">PROT</span>
                <span className="text-stone-300">{recipe.nutrition.protein}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-stone-600">CARB</span>
                <span className="text-stone-300">{recipe.nutrition.carbs}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-stone-600">FAT</span>
                <span className="text-stone-300">{recipe.nutrition.fat}</span>
              </div>
            </div>
          </div>

          <div className="bg-copper/10 rounded-2xl p-4 border border-copper/20 space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-copper flex items-center gap-2">
              <ChefHat className="w-3 h-3" /> Chef Tips
            </h4>
            <ul className="text-[11px] text-stone-400 space-y-2 list-disc pl-4">
              {recipe.chefTips.map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Flavor Profile Summary */}
        {recipe.flavorProfile && (
          <div className="flex items-center justify-between px-4 py-3 bg-white/5 rounded-2xl border border-white/5">
            <span className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">Perfil de Sabor</span>
            <div className="flex gap-4">
              {Object.entries(recipe.flavorProfile).map(([key, value]) => (
                <div key={key} className="flex flex-col items-center">
                  <div className="w-1 h-8 bg-white/10 rounded-full overflow-hidden relative">
                    <div 
                      className="absolute bottom-0 left-0 w-full bg-copper transition-all duration-1000" 
                      style={{ height: `${value}%` }} 
                    />
                  </div>
                  <span className="text-[8px] text-stone-600 mt-1 uppercase">{key.slice(0, 3)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
