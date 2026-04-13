import React, { useState } from 'react';
import { Plus, X, Search } from 'lucide-react';
import { Ingredient } from '../types';
import { CATEGORIES, DEFAULT_INGREDIENTS } from '../constants';
import { cn } from '../lib/utils';

interface Props {
  selected: Ingredient[];
  onToggle: (ingredient: Ingredient) => void;
  onAddCustom: (name: string, category: Ingredient['category']) => void;
  customIngredients?: Ingredient[];
}

export default function IngredientSelector({ selected, onToggle, onAddCustom, customIngredients = [] }: Props) {
  const [customName, setCustomName] = useState('');
  const [activeCategory, setActiveCategory] = useState<Ingredient['category']>('Proteínas');

  const allIngredients = [
    ...DEFAULT_INGREDIENTS.filter(i => i.category === activeCategory),
    ...customIngredients.filter(i => i.category === activeCategory)
  ];

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (customName.trim()) {
      onAddCustom(customName.trim(), activeCategory);
      setCustomName('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <h2 className="text-xl font-medium text-stone-200">Despensa de Ingredientes</h2>
        <span className="text-xs text-copper uppercase tracking-widest">{selected.length} seleccionados</span>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "px-4 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap border",
              activeCategory === cat 
                ? "bg-copper border-copper text-white" 
                : "bg-white/5 border-white/10 text-stone-400 hover:border-white/20"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Ingredient Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {allIngredients.map((ing) => {
          const isSelected = selected.some(s => s.id === ing.id);
          return (
            <button
              key={ing.id}
              onClick={() => onToggle(ing)}
              className={cn(
                "flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all border",
                isSelected 
                  ? "bg-copper/20 border-copper text-copper" 
                  : "bg-chef-gray border-white/5 text-stone-400 hover:border-white/10"
              )}
            >
              {ing.name}
              {isSelected ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3 opacity-50" />}
            </button>
          );
        })}
      </div>

      {/* Custom Input */}
      <form onSubmit={handleAddCustom} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
          <input
            type="text"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            placeholder="Añadir ingrediente personalizado..."
            className="w-full bg-chef-gray border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-copper/50 transition-colors"
          />
        </div>
        <button 
          type="submit"
          className="bg-copper hover:bg-copper/90 text-white p-2 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
