import { ShoppingBag, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  items: string[];
  onRemove: (item: string) => void;
  onClear: () => void;
  onClose: () => void;
}

export default function ShoppingList({ items, onRemove, onClear, onClose }: Props) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className="fixed inset-y-0 right-0 w-full max-w-sm bg-chef-black border-l border-white/10 shadow-2xl z-50 flex flex-col"
    >
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <h2 className="text-xl font-medium flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-copper" /> Lista de Compra
        </h2>
        <button onClick={onClose} className="text-stone-500 hover:text-white transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-2">
        <AnimatePresence initial={false}>
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-stone-600 space-y-4">
              <ShoppingBag className="w-12 h-12 opacity-20" />
              <p className="text-sm italic">Tu lista está vacía</p>
            </div>
          ) : (
            items.map((item, idx) => (
              <motion.div 
                key={item + idx}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 group"
              >
                <span className="text-sm text-stone-300">{item}</span>
                <button 
                  onClick={() => onRemove(item)}
                  className="text-stone-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {items.length > 0 && (
        <div className="p-6 border-t border-white/10 bg-chef-gray/50">
          <button 
            onClick={onClear}
            className="w-full py-3 rounded-xl border border-white/10 text-stone-400 text-sm hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" /> Vaciar lista
          </button>
        </div>
      )}
    </motion.div>
  );
}
