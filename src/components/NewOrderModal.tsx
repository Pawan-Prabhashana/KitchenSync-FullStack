import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { User } from '../types';
import { MENU_ITEMS, TABLES, DEMO_USERS } from '../data/menu';
import SelectMenu from './SelectMenu';
import { Avatar } from './Avatar';

interface NewOrderModalProps {
  currentUser: User | null;
  onClose: () => void;
  onSubmit: (orderData: {
    tableNumber: string;
    items: Array<{ id: string; name: string; quantity: number }>;
    specialNotes: string;
    waiterName: string;
    chefName?: string;
  }) => void;
}

interface SelectedItem {
  id: string;
  name: string;
  quantity: number;
}

export const NewOrderModal: React.FC<NewOrderModalProps> = ({
  currentUser,
  onClose,
  onSubmit
}) => {
  const [selectedTable, setSelectedTable] = useState<string>(TABLES[0]);
  const [activeCategory, setActiveCategory] = useState<'Mains' | 'Appetizers' | 'Drinks' | 'Desserts'>('Mains');
  const [selectedItems, setSelectedItems] = useState<Record<string, SelectedItem>>({});
  const [specialNotes, setSpecialNotes] = useState<string>('');
  const [waiterName, setWaiterName] = useState<string>(currentUser?.name || 'Nimal');
  const [selectedChef, setSelectedChef] = useState<string>('');

  const categories: Array<'Mains' | 'Appetizers' | 'Drinks' | 'Desserts'> = ['Mains', 'Appetizers', 'Drinks', 'Desserts'];

  const filteredMenuItems = MENU_ITEMS.filter(item => item.category === activeCategory);

  const handleAddItem = (item: typeof MENU_ITEMS[0]) => {
    setSelectedItems(prev => {
      const existing = prev[item.id];
      return {
        ...prev,
        [item.id]: existing
          ? { ...existing, quantity: existing.quantity + 1 }
          : { id: item.id, name: item.name, quantity: 1 }
      };
    });
  };

  const handleDecreaseItem = (itemId: string) => {
    setSelectedItems(prev => {
      const existing = prev[itemId];
      if (!existing) return prev;
      if (existing.quantity > 1) {
        return {
          ...prev,
          [itemId]: { ...existing, quantity: existing.quantity - 1 }
        };
      } else {
        const next = { ...prev };
        delete next[itemId];
        return next;
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const itemsArray = Object.values(selectedItems);
    if (itemsArray.length === 0) {
      alert('Please add at least one item to the order');
      return;
    }

    onSubmit({
      tableNumber: selectedTable,
      items: itemsArray,
      specialNotes,
      waiterName,
      chefName: selectedChef || undefined
    });
    onClose();
  };

  const chefs = DEMO_USERS.filter(u => u.role === 'chef');
  const waiters = DEMO_USERS.filter(u => u.role === 'waiter');

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Create new kitchen order"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.18 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-surface rounded-2xl max-w-2xl w-full shadow-2xl border border-hairline overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-4 px-6 border-b border-hairline flex items-center justify-between bg-canvas">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-green-chip text-green-ink rounded-xl">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-ink">Create New Kitchen Order</h2>
              <p className="text-xs text-muted">Select table, items, and punch in notes</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-faint hover:text-ink hover:bg-slate-200 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Table & Waiter selection */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-ink mb-1">Table Number</label>
              <SelectMenu
                options={TABLES.map(t => ({ value: t, label: t }))}
                value={selectedTable}
                onChange={(v) => setSelectedTable(v)}
                placeholder="Select table"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-ink mb-1">Waiter Name</label>
              <SelectMenu
                options={waiters.map(w => ({ value: w.name, label: w.name }))}
                value={waiterName}
                onChange={(v) => setWaiterName(v)}
                placeholder="Select waiter"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-ink mb-1">Assign Chef (Optional)</label>
              <SelectMenu
                options={[{ value: '', label: 'Auto / Select Chef' }, ...chefs.map(c => ({ value: c.name, label: c.name }))]}
                value={selectedChef}
                onChange={(v) => setSelectedChef(v)}
                placeholder="Assign chef"
                size="sm"
                renderItem={(opt) => {
                  const chef = DEMO_USERS.find(u => u.name === opt.label);
                  return (
                    <div className="flex items-center gap-2">
                      <Avatar name={opt.label} role="chef" size="xs" showRing={false} />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-ink">{opt.label}</div>
                      </div>
                    </div>
                  );
                }}
              />
            </div>
          </div>

          {/* Menu Category Selection */}
          <div>
            <div className="flex items-center gap-1.5 border-b border-hairline pb-2 mb-3">
              {categories.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    activeCategory === cat
                      ? 'bg-emerald-600 text-white shadow-soft'
                      : 'text-muted hover:bg-canvas'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Menu Items Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
              {filteredMenuItems.map(item => {
                const selected = selectedItems[item.id];
                return (
                  <div
                    key={item.id}
                    onClick={() => handleAddItem(item)}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between ${
                      selected ? 'border-emerald-500 bg-green-chip/40 ring-1 ring-green-dot' : 'border-hairline hover:border-hairline bg-canvas/30'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-ink">{item.name}</div>
                      <div className="text-[10px] text-faint font-mono">${item.price.toFixed(2)}</div>
                    </div>

                    {selected ? (
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        {selected.quantity}
                      </span>
                    ) : (
                      <Plus className="w-4 h-4 text-faint" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Items Summary List */}
          <div>
            <h3 className="text-xs font-bold text-ink mb-2">Order Items Summary ({Object.keys(selectedItems).length})</h3>
            {Object.keys(selectedItems).length === 0 ? (
              <div className="p-3 text-center text-xs text-faint border border-dashed border-hairline rounded-xl">
                Click menu items above to add to order
              </div>
            ) : (
              <div className="space-y-1.5 max-h-36 overflow-y-auto border border-hairline rounded-xl p-2.5 bg-canvas">
                {(Object.values(selectedItems) as SelectedItem[]).map((item: SelectedItem) => (
                  <div key={item.id} className="flex items-center justify-between text-xs bg-surface p-2 rounded-lg border border-hairline shadow-soft">
                    <span className="font-semibold text-ink">{item.name}</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleDecreaseItem(item.id)}
                        className="p-1 text-muted hover:bg-canvas rounded-md"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-bold text-ink w-4 text-center">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => handleAddItem(MENU_ITEMS.find(i => i.id === item.id)!)}
                        className="p-1 text-muted hover:bg-canvas rounded-md"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Special Notes & Allergies */}
          <div>
            <label className="block text-xs font-bold text-ink mb-1">
              Special Notes / Allergies (e.g. "No onions, Allergy: Nuts")
            </label>
            <textarea
              rows={2}
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
              placeholder="e.g. No onions in the salad. Allergy: Nuts"
              className="w-full text-xs p-2.5 bg-canvas border border-hairline rounded-xl focus:outline-none focus:ring-2 focus:ring-green-dot/40"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-hairline text-muted hover:bg-canvas font-semibold text-xs rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-charcoal hover:bg-charcoal-hover text-white font-bold text-xs rounded-xl shadow-soft"
            >
              Punch Order Live
            </button>
          </div>
        </form>

      </motion.div>
    </div>
  );
};
