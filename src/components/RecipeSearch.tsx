import { useState, useEffect } from 'react';
import { Search, Filter, X, SlidersHorizontal, Clock, ChefHat, Flame, Droplets } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Culture, FlavorProfile } from '../types';
import { cn } from '../lib/utils';

interface SearchFilters {
  query: string;
  culture: Culture | 'Todas';
  maxTime: number; // in minutes
  minFlavor: {
    key: keyof FlavorProfile;
    value: number;
  } | null;
}

interface Props {
  onFilterChange: (filters: SearchFilters) => void;
  availableCultures: Culture[];
}

export default function RecipeSearch({ onFilterChange, availableCultures }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    culture: 'Todas',
    maxTime: 120,
    minFlavor: null
  });

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const flavorIcons: Record<keyof FlavorProfile, any> = {
    spicy: Flame,
    herbal: Droplets,
    citric: Droplets,
    sweet: Droplets,
    umami: ChefHat
  };

  const flavorLabels: Record<keyof FlavorProfile, string> = {
    spicy: 'Picante',
    herbal: 'Herbal',
    citric: 'Cítrico',
    sweet: 'Dulce',
    umami: 'Umami'
  };

  return (
    <div className="space-y-4">
      <div className="relative flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-500" />
          <input
            type="text"
            placeholder="Buscar por nombre o ingrediente..."
            value={filters.query}
            onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-stone-600 focus:outline-none focus:ring-2 focus:ring-copper/50 transition-all"
          />
          {filters.query && (
            <button 
              onClick={() => setFilters(prev => ({ ...prev, query: '' }))}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "p-4 rounded-2xl border transition-all flex items-center gap-2",
            isOpen || Object.values(filters).some(v => v !== '' && v !== 'Todas' && v !== 120 && v !== null)
              ? "bg-copper/20 border-copper/50 text-copper"
              : "bg-white/5 border-white/10 text-stone-400 hover:border-white/20"
          )}
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span className="hidden md:inline text-sm font-medium">Filtros</span>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="glass-panel rounded-3xl p-6 border border-white/10 grid md:grid-cols-3 gap-8">
              {/* Culture Filter */}
              <div className="space-y-3">
                <label className="text-xs uppercase tracking-widest text-stone-500 font-bold flex items-center gap-2">
                  <ChefHat className="w-3 h-3" /> Cultura / Cocina
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Todas', ...availableCultures].map((c) => (
                    <button
                      key={c}
                      onClick={() => setFilters(prev => ({ ...prev, culture: c as Culture | 'Todas' }))}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-[10px] font-medium transition-all border",
                        filters.culture === c
                          ? "bg-copper text-white border-copper"
                          : "bg-white/5 border-white/10 text-stone-400 hover:border-white/20"
                      )}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Filter */}
              <div className="space-y-3">
                <label className="text-xs uppercase tracking-widest text-stone-500 font-bold flex items-center gap-2">
                  <Clock className="w-3 h-3" /> Tiempo Máximo
                </label>
                <div className="space-y-4">
                  <input
                    type="range"
                    min="15"
                    max="120"
                    step="15"
                    value={filters.maxTime}
                    onChange={(e) => setFilters(prev => ({ ...prev, maxTime: parseInt(e.target.value) }))}
                    className="w-full accent-copper"
                  />
                  <div className="flex justify-between text-[10px] text-stone-500 font-mono">
                    <span>15 min</span>
                    <span className="text-copper font-bold">{filters.maxTime} min</span>
                    <span>120 min</span>
                  </div>
                </div>
              </div>

              {/* Flavor Filter */}
              <div className="space-y-3">
                <label className="text-xs uppercase tracking-widest text-stone-500 font-bold flex items-center gap-2">
                  <Flame className="w-3 h-3" /> Perfil de Sabor
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['spicy', 'herbal', 'citric', 'sweet', 'umami'] as (keyof FlavorProfile)[]).map((f) => {
                    const Icon = flavorIcons[f];
                    const isActive = filters.minFlavor?.key === f;
                    return (
                      <button
                        key={f}
                        onClick={() => setFilters(prev => ({
                          ...prev,
                          minFlavor: isActive ? null : { key: f, value: 50 }
                        }))}
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 rounded-xl text-[10px] font-medium transition-all border",
                          isActive
                            ? "bg-copper/20 border-copper/50 text-copper"
                            : "bg-white/5 border-white/10 text-stone-400 hover:border-white/20"
                        )}
                      >
                        <Icon className="w-3 h-3" />
                        {flavorLabels[f]}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
