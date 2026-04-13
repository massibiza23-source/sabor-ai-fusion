import { FlavorProfile as IFlavorProfile, UserPreferences } from '../types';
import { cn } from '../lib/utils';

interface Props {
  flavor: IFlavorProfile;
  prefs: UserPreferences;
  excluded: string;
  allergies: string;
  onFlavorChange: (key: keyof IFlavorProfile, value: number) => void;
  onPrefsChange: (key: keyof UserPreferences) => void;
  onExcludedChange: (val: string) => void;
  onAllergiesChange: (val: string) => void;
}

export default function FlavorProfile({ 
  flavor, 
  prefs, 
  excluded, 
  allergies, 
  onFlavorChange, 
  onPrefsChange,
  onExcludedChange,
  onAllergiesChange
}: Props) {
  return (
    <div className="space-y-8">
      {/* Flavor Sliders */}
      <div className="space-y-6">
        <div className="border-b border-white/10 pb-2">
          <h2 className="text-xl font-medium text-stone-200">Perfil de Sabor</h2>
        </div>
        
        <div className="grid gap-6">
          {Object.entries(flavor).map(([key, value]) => (
            <div key={key} className="space-y-2">
              <div className="flex justify-between text-xs uppercase tracking-widest text-stone-400">
                <span>{translateFlavor(key as keyof IFlavorProfile)}</span>
                <span className="text-copper font-mono">{value}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={value}
                onChange={(e) => onFlavorChange(key as keyof IFlavorProfile, parseInt(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-copper"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Preferences */}
      <div className="space-y-4">
        <div className="border-b border-white/10 pb-2">
          <h2 className="text-xl font-medium text-stone-200">Preferencias</h2>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(prefs).map(([key, value]) => (
            <button
              key={key}
              onClick={() => onPrefsChange(key as keyof UserPreferences)}
              className={cn(
                "px-4 py-3 rounded-xl text-xs font-medium transition-all border text-left",
                value 
                  ? "bg-copper/20 border-copper text-copper" 
                  : "bg-chef-gray border-white/5 text-stone-500 hover:border-white/10"
              )}
            >
              {translatePref(key as keyof UserPreferences)}
            </button>
          ))}
        </div>
      </div>

      {/* Restrictions */}
      <div className="grid gap-4">
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest text-stone-500">Ingredientes no deseados</label>
          <input
            type="text"
            value={excluded}
            onChange={(e) => onExcludedChange(e.target.value)}
            placeholder="Ej: Cilantro, Cebolla..."
            className="w-full bg-chef-gray border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-copper/50 transition-colors"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest text-stone-500">Alergias</label>
          <input
            type="text"
            value={allergies}
            onChange={(e) => onAllergiesChange(e.target.value)}
            placeholder="Ej: Frutos secos, Gluten..."
            className="w-full bg-chef-gray border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-copper/50 transition-colors"
          />
        </div>
      </div>
    </div>
  );
}

function translateFlavor(key: keyof IFlavorProfile): string {
  const map: Record<keyof IFlavorProfile, string> = {
    spicy: 'Picante', herbal: 'Herbal', citric: 'Cítrico', sweet: 'Dulce', umami: 'Umami'
  };
  return map[key];
}

function translatePref(key: keyof UserPreferences): string {
  const map: Record<keyof UserPreferences, string> = {
    healthy: 'Saludable', 
    fast: 'Rápido (<30 min)', 
    gourmet: 'Gourmet', 
    budget: 'Económico',
    ensalada: 'Ensalada',
    sopa: 'Sopa',
    antipasto: 'Antipasto',
    pinchos: 'Pinchos'
  };
  return map[key];
}
