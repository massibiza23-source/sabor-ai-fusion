import React, { useState } from 'react';
import { Sparkles, MapPin } from 'lucide-react';
import { Culture } from '../types';
import { CULTURES } from '../constants';
import { cn, getFlag } from '../lib/utils';

interface Props {
  selected: Culture[];
  onToggle: (culture: Culture) => void;
  onSurprise: () => void;
  onAddCustomCulture: (culture: string) => void;
}

export default function CulturalFusion({ selected, onToggle, onSurprise, onAddCustomCulture }: Props) {
  const [customCulture, setCustomCulture] = useState('');

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (customCulture.trim()) {
      onAddCustomCulture(customCulture.trim());
      setCustomCulture('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <h2 className="text-xl font-medium text-stone-200">Fusión Cultural</h2>
        <button 
          onClick={onSurprise}
          className="flex items-center gap-1.5 text-[10px] text-copper uppercase tracking-widest hover:opacity-80 transition-opacity"
        >
          <Sparkles className="w-3 h-3" />
          Surprise Me
        </button>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
        {CULTURES.map((culture) => {
          const isSelected = selected.includes(culture);
          const isDisabled = !isSelected && selected.length >= 2;
          
          return (
            <button
              key={culture}
              disabled={isDisabled}
              onClick={() => onToggle(culture)}
              className={cn(
                "px-1 py-2 rounded-lg text-[10px] font-medium transition-all border flex flex-col items-center gap-1",
                isSelected 
                  ? "bg-copper/20 border-copper text-copper" 
                  : "bg-chef-gray border-white/5 text-stone-500 hover:border-white/10",
                isDisabled && "opacity-30 cursor-not-allowed"
              )}
            >
              <span className="text-base">
                {getFlag(culture)}
              </span>
              <span className="truncate w-full text-center px-1">{culture}</span>
            </button>
          );
        })}
      </div>

      {/* Custom Region/City Search */}
      <form onSubmit={handleAddCustom} className="flex gap-2">
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
          <input
            type="text"
            value={customCulture}
            onChange={(e) => setCustomCulture(e.target.value)}
            placeholder="Buscar ciudad o región (ej: Oaxaca, Kioto...)"
            className="w-full bg-chef-gray border border-white/10 rounded-lg pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-copper/50 transition-colors"
          />
        </div>
        <button 
          type="submit"
          className="bg-copper/20 hover:bg-copper/30 text-copper px-3 rounded-lg transition-colors text-xs font-medium border border-copper/30"
        >
          Añadir
        </button>
      </form>
      
      {selected.length === 0 && (
        <p className="text-[10px] text-stone-500 italic text-center">
          Selecciona hasta 2 culturas o regiones para crear una fusión única.
        </p>
      )}
    </div>
  );
}
