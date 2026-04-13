import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getFlag(culture: string): string {
  const flags: Record<string, string> = {
    'México': '🇲🇽',
    'Japón': '🇯🇵',
    'Italia': '🇮🇹',
    'India': '🇮🇳',
    'Tailandia': '🇹🇭',
    'Francia': '🇫🇷',
    'España': '🇪🇸',
    'China': '🇨🇳',
    'Corea': '🇰🇷',
    'Perú': '🇵🇪',
    'Marruecos': '🇲🇦',
    'Grecia': '🇬🇷'
  };
  return flags[culture] || '📍';
}
