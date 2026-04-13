import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChefHat, ShoppingBag, Loader2, RefreshCw, Book, Download, Trash2, Search } from 'lucide-react';
import Header from './components/Header';
import IngredientSelector from './components/IngredientSelector';
import CulturalFusion from './components/CulturalFusion';
import FlavorProfile from './components/FlavorProfile';
import RecipeCard from './components/RecipeCard';
import ShoppingList from './components/ShoppingList';
import RecipeSearch from './components/RecipeSearch';
import { generateRecipe } from './services/geminiService';
import { generateCookbookHtml } from './lib/cookbook';
import { Ingredient, Culture, FlavorProfile as IFlavorProfile, UserPreferences, Recipe } from './types';
import { cn } from './lib/utils';

export default function App() {
  // State
  const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>([]);
  const [selectedCultures, setSelectedCultures] = useState<Culture[]>([]);
  const [flavor, setFlavor] = useState<IFlavorProfile>({
    spicy: 20, herbal: 40, citric: 30, sweet: 10, umami: 50
  });
  const [prefs, setPrefs] = useState<UserPreferences>({
    healthy: false, fast: false, gourmet: true, budget: false,
    ensalada: false, sopa: false, antipasto: false, pinchos: false
  });
  const [excluded, setExcluded] = useState('');
  const [allergies, setAllergies] = useState('');
  const [theme, setTheme] = useState<'default' | 'minimalist'>('default');
  
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [shoppingList, setShoppingList] = useState<string[]>([]);
  const [showShoppingList, setShowShoppingList] = useState(false);

  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [customIngredients, setCustomIngredients] = useState<Ingredient[]>([]);

  const [searchFilters, setSearchFilters] = useState({
    query: '',
    culture: 'Todas',
    maxTime: 120,
    minFlavor: null as { key: keyof IFlavorProfile; value: number } | null
  });

  // Load data
  useEffect(() => {
    const savedShopping = localStorage.getItem('flavor-engine-shopping');
    if (savedShopping) setShoppingList(JSON.parse(savedShopping));

    const savedCookbook = localStorage.getItem('flavor-engine-cookbook');
    if (savedCookbook) setSavedRecipes(JSON.parse(savedCookbook));

    const savedCustomIngs = localStorage.getItem('flavor-engine-custom-ingredients');
    if (savedCustomIngs) setCustomIngredients(JSON.parse(savedCustomIngs));
  }, []);

  // Save data
  useEffect(() => {
    localStorage.setItem('flavor-engine-shopping', JSON.stringify(shoppingList));
  }, [shoppingList]);

  useEffect(() => {
    localStorage.setItem('flavor-engine-cookbook', JSON.stringify(savedRecipes));
  }, [savedRecipes]);

  useEffect(() => {
    localStorage.setItem('flavor-engine-custom-ingredients', JSON.stringify(customIngredients));
  }, [customIngredients]);

  // Handlers
  const toggleIngredient = (ing: Ingredient) => {
    setSelectedIngredients(prev => 
      prev.some(s => s.id === ing.id) ? prev.filter(s => s.id !== ing.id) : [...prev, ing]
    );
  };

  const addCustomIngredient = (name: string, category: Ingredient['category']) => {
    const newIng: Ingredient = { id: Math.random().toString(36).substr(2, 9), name, category };
    setCustomIngredients(prev => [...prev, newIng]);
    setSelectedIngredients(prev => [...prev, newIng]);
  };

  const toggleCulture = (culture: Culture) => {
    setSelectedCultures(prev => 
      prev.includes(culture) ? prev.filter(c => c !== culture) : [...prev, culture].slice(0, 2)
    );
  };

  const handleSurprise = () => {
    const cultures: Culture[] = ['México', 'Japón', 'Italia', 'India', 'Tailandia', 'Francia', 'España', 'China', 'Corea', 'Perú', 'Marruecos', 'Grecia'];
    const random = [...cultures].sort(() => 0.5 - Math.random()).slice(0, 2);
    setSelectedCultures(random);
  };

  const handleGenerate = async () => {
    if (selectedIngredients.length === 0) {
      setError('Selecciona al menos un ingrediente.');
      return;
    }
    
    setLoading(true);
    setError(null);
    setRecipe(null);
    
    try {
      const result = await generateRecipe(
        selectedIngredients,
        selectedCultures,
        flavor,
        prefs,
        excluded,
        allergies
      );
      setRecipe(result);
      // Scroll to recipe
      setTimeout(() => {
        document.getElementById('recipe-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      setError('Error al conectar con el Chef IA. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const addToShoppingList = (items: string[]) => {
    setShoppingList(prev => {
      const newList = [...prev];
      items.forEach(item => {
        if (!newList.includes(item)) newList.push(item);
      });
      return newList;
    });
    setShowShoppingList(true);
  };

  const saveToCookbook = (r: Recipe) => {
    if (!savedRecipes.some(sr => sr.name === r.name)) {
      setSavedRecipes(prev => [...prev, r]);
    }
  };

  const downloadCookbook = () => {
    const html = generateCookbookHtml(savedRecipes);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Mi_Recetario_Gourmet.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearCookbook = () => {
    if (confirm('¿Estás seguro de que quieres vaciar tu recetario?')) {
      setSavedRecipes([]);
    }
  };

  const filteredRecipes = savedRecipes.filter(r => {
    // Search query
    const matchesQuery = !searchFilters.query || 
      r.name.toLowerCase().includes(searchFilters.query.toLowerCase()) ||
      r.mainIngredients?.some(i => i.toLowerCase().includes(searchFilters.query.toLowerCase())) ||
      r.ingredients.some(i => i.item.toLowerCase().includes(searchFilters.query.toLowerCase()));

    if (!matchesQuery) return false;

    // Culture
    if (searchFilters.culture !== 'Todas') {
      if (!r.cultures?.includes(searchFilters.culture as Culture)) return false;
    }

    // Prep Time
    if (searchFilters.maxTime < 120) {
      const timeMatch = r.prepTime.match(/(\d+)/);
      if (timeMatch) {
        const mins = parseInt(timeMatch[1]);
        if (mins > searchFilters.maxTime) return false;
      }
    }

    // Flavor
    if (searchFilters.minFlavor) {
      const { key, value } = searchFilters.minFlavor;
      if (!r.flavorProfile || (r.flavorProfile[key] || 0) < value) return false;
    }

    return true;
  });

  const availableCultures = Array.from(new Set(savedRecipes.flatMap(r => r.cultures || []))) as Culture[];

  return (
    <div className={cn(
      "min-h-screen pb-20 selection:bg-copper/30 transition-colors duration-700",
      theme === 'minimalist' ? "bg-[#050505] text-stone-300 minimalist" : "bg-chef-black text-stone-200"
    )}>
      <Header />

      <main className="max-w-4xl mx-auto px-6 space-y-12">
        {/* Theme Toggle / Settings */}
        <div className="flex justify-end">
          <button 
            onClick={() => setTheme(prev => prev === 'default' ? 'minimalist' : 'default')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full text-[10px] uppercase tracking-[0.2em] font-medium transition-all border",
              theme === 'minimalist' 
                ? "bg-copper/10 border-copper/40 text-copper" 
                : "bg-white/5 border-white/10 text-stone-500 hover:border-white/20"
            )}
          >
            {theme === 'minimalist' ? 'Tema: Gourmet Minimalista' : 'Cambiar a Minimalista'}
          </button>
        </div>

        {/* Step 1: Ingredients */}
        <section className="glass-panel rounded-3xl p-6 md:p-8 shadow-xl">
          <IngredientSelector 
            selected={selectedIngredients}
            onToggle={toggleIngredient}
            onAddCustom={addCustomIngredient}
            customIngredients={customIngredients}
          />
        </section>

        {/* Step 2: Culture & Flavor */}
        <div className="grid md:grid-cols-2 gap-8">
          <section className="glass-panel rounded-3xl p-6 md:p-8 shadow-xl">
            <CulturalFusion 
              selected={selectedCultures}
              onToggle={toggleCulture}
              onSurprise={handleSurprise}
              onAddCustomCulture={(c) => setSelectedCultures(prev => [...prev, c as Culture].slice(0, 2))}
            />
          </section>
          
          <section className="glass-panel rounded-3xl p-6 md:p-8 shadow-xl">
            <FlavorProfile 
              flavor={flavor}
              prefs={prefs}
              excluded={excluded}
              allergies={allergies}
              onFlavorChange={(k, v) => setFlavor(prev => ({ ...prev, [k]: v }))}
              onPrefsChange={(k) => setPrefs(prev => ({ ...prev, [k]: !prev[k] }))}
              onExcludedChange={setExcluded}
              onAllergiesChange={setAllergies}
            />
          </section>
        </div>

        {/* Action Button */}
        <div className="flex flex-col items-center gap-4 py-8">
          <button
            disabled={loading || selectedIngredients.length === 0}
            onClick={handleGenerate}
            className={cn(
              "group relative px-12 py-5 rounded-full font-display text-xl font-bold transition-all overflow-hidden",
              loading || selectedIngredients.length === 0 
                ? "bg-stone-800 text-stone-600 cursor-not-allowed" 
                : "copper-gradient text-white shadow-2xl shadow-copper/40 hover:scale-105 active:scale-95"
            )}
          >
            <span className="relative z-10 flex items-center gap-3">
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Orquestando Sabores...
                </>
              ) : (
                <>
                  <ChefHat className="w-6 h-6" />
                  Generar Receta Gourmet
                </>
              )}
            </span>
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          
          {error && (
            <motion.p 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="text-red-400 text-sm font-medium"
            >
              {error}
            </motion.p>
          )}
        </div>

        {/* Recipe Display */}
        <div id="recipe-section" className="min-h-[200px]">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20 space-y-6"
              >
                <div className="relative">
                  <div className="w-24 h-24 border-4 border-copper/10 border-t-copper rounded-full animate-spin" />
                  <ChefHat className="absolute inset-0 m-auto w-8 h-8 text-copper animate-pulse" />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-xl font-display text-white">El Chef IA está creando...</p>
                  <p className="text-sm text-stone-500 italic">"La cocina es un lenguaje mediante el cual se puede expresar armonía, creatividad, felicidad, belleza, poesía, complejidad, magia, humor, provocación, cultura."</p>
                </div>
              </motion.div>
            ) : recipe ? (
              <RecipeCard 
                recipe={recipe} 
                onAddToShoppingList={addToShoppingList}
                onSaveToCookbook={saveToCookbook}
                isSaved={savedRecipes.some(sr => sr.name === recipe.name)}
                onImageGenerated={(url) => setRecipe(prev => prev ? { ...prev, image: url } : null)}
              />
            ) : null}
          </AnimatePresence>
        </div>

        {/* Cookbook Management Section */}
        {savedRecipes.length > 0 && (
          <div className="space-y-8 pt-12 border-t border-white/5">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-1">
                <h2 className="text-3xl font-bold text-white">Tu Recetario</h2>
                <p className="text-stone-500 text-sm">Explora y filtra tus creaciones culinarias guardadas.</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={clearCookbook}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-stone-500 hover:text-red-400 hover:border-red-400/30 transition-all text-xs font-medium"
                >
                  <Trash2 className="w-4 h-4" /> Vaciar
                </button>
                <button
                  onClick={downloadCookbook}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-copper/10 border border-copper/30 text-copper font-medium hover:bg-copper hover:text-white transition-all text-xs"
                >
                  <Download className="w-4 h-4" /> Exportar HTML
                </button>
              </div>
            </div>

            <RecipeSearch 
              onFilterChange={(f) => setSearchFilters(f as any)} 
              availableCultures={availableCultures}
            />

            <div className="grid gap-8">
              <AnimatePresence mode="popLayout">
                {filteredRecipes.length > 0 ? (
                  filteredRecipes.map((r, idx) => (
                    <motion.div
                      key={r.name + idx}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                    >
                      <RecipeCard 
                        recipe={r}
                        onAddToShoppingList={addToShoppingList}
                        isSaved={true}
                      />
                    </motion.div>
                  ))
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-20 text-center glass-panel rounded-3xl border-dashed border-white/10"
                  >
                    <Search className="w-12 h-12 text-stone-700 mx-auto mb-4" />
                    <p className="text-stone-500">No se encontraron recetas que coincidan con los filtros.</p>
                    <button 
                      onClick={() => setSearchFilters({ query: '', culture: 'Todas', maxTime: 120, minFlavor: null })}
                      className="mt-4 text-copper text-sm hover:underline"
                    >
                      Limpiar todos los filtros
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </main>

      {/* Floating Buttons */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-4 z-40">
        {savedRecipes.length > 0 && (
          <button 
            onClick={() => document.getElementById('cookbook-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-16 h-16 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full shadow-2xl flex items-center justify-center text-copper hover:scale-110 transition-transform active:scale-95"
            title="Ver Recetario"
          >
            <Book className="w-7 h-7" />
          </button>
        )}
        
        <button 
          onClick={() => setShowShoppingList(true)}
          className="w-16 h-16 copper-gradient rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 transition-transform active:scale-95"
          title="Lista de la Compra"
        >
          <ShoppingBag className="w-7 h-7" />
          {shoppingList.length > 0 && (
            <span className="absolute -top-1 -right-1 w-6 h-6 bg-white text-chef-black text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg">
              {shoppingList.length}
            </span>
          )}
        </button>
      </div>

      {/* Shopping List Sidebar */}
      <AnimatePresence>
        {showShoppingList && (
          <ShoppingList 
            items={shoppingList}
            onRemove={(item) => setShoppingList(prev => prev.filter(i => i !== item))}
            onClear={() => setShoppingList([])}
            onClose={() => setShowShoppingList(false)}
          />
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="mt-20 py-12 border-t border-white/5 text-center px-6">
        <p className="text-stone-600 text-xs uppercase tracking-widest">
          AI Flavor Engine &copy; 2026 &mdash; Alta Cocina Computacional
        </p>
      </footer>
    </div>
  );
}
