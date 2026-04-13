import { UtensilsCrossed } from 'lucide-react';

export default function Header() {
  return (
    <header className="py-8 px-6 flex flex-col items-center text-center space-y-2">
      <div className="w-16 h-16 copper-gradient rounded-full flex items-center justify-center mb-4 shadow-lg shadow-copper/20">
        <UtensilsCrossed className="text-white w-8 h-8" />
      </div>
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
        AI <span className="text-copper">Flavor</span> Engine
      </h1>
      <p className="text-stone-400 max-w-md text-sm md:text-base font-light tracking-wide uppercase">
        Arquitectura Culinaria & Fusión Inteligente
      </p>
      <div className="w-24 h-px bg-copper/30 mt-4" />
    </header>
  );
}
