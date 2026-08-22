import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Plus, Minus, PackageCheck, MapPin } from 'lucide-react';
import { User, PaymentMethod } from '../types';
import { MENU_ITEMS, DEMO_RIDERS, PAYMENT_METHODS } from '../data/menu';
import SelectMenu from './SelectMenu';
import { Avatar } from './Avatar';

interface NewDeliveryOrderModalProps {
  currentUser: User | null;
  onClose: () => void;
  onSubmit: (data: {
    customerName: string;
    address: string;
    distanceKm: number;
    items: Array<{ id: string; name: string; quantity: number }>;
    paymentMethod: PaymentMethod;
    specialNotes: string;
    riderName?: string;
  }) => void;
}

interface SelectedItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export const NewDeliveryOrderModal: React.FC<NewDeliveryOrderModalProps> = ({ onClose, onSubmit }) => {
  const [customerName, setCustomerName] = useState('');
  const [address, setAddress] = useState('');
  const [distanceKm, setDistanceKm] = useState('3.0');
  const [activeCategory, setActiveCategory] = useState<'Mains' | 'Appetizers' | 'Drinks' | 'Desserts'>('Mains');
  const [selectedItems, setSelectedItems] = useState<Record<string, SelectedItem>>({});
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Online');
  const [specialNotes, setSpecialNotes] = useState('');
  const [riderName, setRiderName] = useState('');

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const categories: Array<'Mains' | 'Appetizers' | 'Drinks' | 'Desserts'> = ['Mains', 'Appetizers', 'Drinks', 'Desserts'];
  const filteredMenuItems = MENU_ITEMS.filter(item => item.category === activeCategory);

  const handleAddItem = (item: typeof MENU_ITEMS[0]) => {
    setSelectedItems(prev => {
      const existing = prev[item.id];
      return {
        ...prev,
        [item.id]: existing
          ? { ...existing, quantity: existing.quantity + 1 }
          : { id: item.id, name: item.name, quantity: 1, price: item.price }
      };
    });
  };

  const handleDecreaseItem = (itemId: string) => {
    setSelectedItems(prev => {
      const existing = prev[itemId];
      if (!existing) return prev;
      if (existing.quantity > 1) return { ...prev, [itemId]: { ...existing, quantity: existing.quantity - 1 } };
      const next = { ...prev };
      delete next[itemId];
      return next;
    });
  };

  const selectedList = Object.values(selectedItems) as SelectedItem[];
  const total = selectedList.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const itemsArray = selectedList.map(({ id, name, quantity }) => ({ id, name, quantity }));
    if (!customerName.trim() || !address.trim()) {
      alert('Please enter a customer name and delivery address');
      return;
    }
    if (itemsArray.length === 0) {
      alert('Please add at least one item to the order');
      return;
    }
    onSubmit({
      customerName: customerName.trim(),
      address: address.trim(),
      distanceKm: Number(distanceKm) || 0,
      items: itemsArray,
      paymentMethod,
      specialNotes,
      riderName: riderName || undefined
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Create new delivery order"
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
            <div className="p-2 bg-sky-chip text-sky-ink rounded-xl">
              <PackageCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-ink">Create New Delivery Order</h2>
              <p className="text-xs text-muted">Customer, address, items and payment</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-faint hover:text-ink hover:bg-slate-200 rounded-lg" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Customer + address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-ink mb-1">Customer Name</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Amaya Wijesinghe"
                className="w-full text-xs p-2.5 bg-canvas border border-hairline rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-dot/40 focus:border-sky-dot"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-ink mb-1">Distance (km)</label>
              <input
                type="number"
                min={0}
                step={0.1}
                value={distanceKm}
                onChange={(e) => setDistanceKm(e.target.value)}
                className="w-full text-xs p-2.5 bg-canvas border border-hairline rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-sky-dot/40 focus:border-sky-dot"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-ink mb-1">Delivery Address</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-faint absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. 42/1 Horton Place, Colombo 07"
                className="w-full pl-9 pr-3 text-xs p-2.5 bg-canvas border border-hairline rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-dot/40 focus:border-sky-dot"
              />
            </div>
          </div>

          {/* Payment + rider */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-ink mb-1">Payment Method</label>
              <SelectMenu
                options={PAYMENT_METHODS.map(p => ({ value: p, label: p }))}
                value={paymentMethod}
                onChange={(v) => setPaymentMethod(v as PaymentMethod)}
                placeholder="Payment"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-ink mb-1">Assign Rider (Optional)</label>
              <SelectMenu
                options={[{ value: '', label: 'Auto / Select Rider' }, ...DEMO_RIDERS.map(r => ({ value: r.name, label: r.name }))]}
                value={riderName}
                onChange={(v) => setRiderName(v)}
                placeholder="Assign rider"
                size="sm"
                renderItem={(opt) => {
                  const rider = DEMO_RIDERS.find(u => u.name === opt.label);
                  return (
                    <div className="flex items-center gap-2">
                      <Avatar name={opt.label} role="rider" size="xs" showRing={false} />
                      <span className="text-sm font-medium text-ink">{opt.label}</span>
                    </div>
                  );
                }}
              />
            </div>
          </div>

          {/* Menu */}
          <div>
            <div className="flex items-center gap-1.5 border-b border-hairline pb-2 mb-3">
              {categories.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    activeCategory === cat ? 'bg-indigo-600 text-white shadow-soft' : 'text-muted hover:bg-canvas'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
              {filteredMenuItems.map(item => {
                const selected = selectedItems[item.id];
                return (
                  <div
                    key={item.id}
                    onClick={() => handleAddItem(item)}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between ${
                      selected ? 'border-indigo-500 bg-sky-chip/40 ring-1 ring-sky-dot' : 'border-hairline hover:border-hairline bg-canvas/30'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-ink">{item.name}</div>
                      <div className="text-[10px] text-faint font-mono">${item.price.toFixed(2)}</div>
                    </div>
                    {selected ? (
                      <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
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

          {/* Summary */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-ink">Order Items ({Object.keys(selectedItems).length})</h3>
              <span className="text-xs font-mono font-bold text-sky-ink">Total ${total.toFixed(2)}</span>
            </div>
            {selectedList.length === 0 ? (
              <div className="p-3 text-center text-xs text-faint border border-dashed border-hairline rounded-xl">
                Click menu items above to add to order
              </div>
            ) : (
              <div className="space-y-1.5 max-h-36 overflow-y-auto border border-hairline rounded-xl p-2.5 bg-canvas">
                {selectedList.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-xs bg-surface p-2 rounded-lg border border-hairline shadow-soft">
                    <span className="font-semibold text-ink">{item.name}</span>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => handleDecreaseItem(item.id)} className="p-1 text-muted hover:bg-canvas rounded-md">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-bold text-ink w-4 text-center">{item.quantity}</span>
                      <button type="button" onClick={() => handleAddItem(MENU_ITEMS.find(i => i.id === item.id)!)} className="p-1 text-muted hover:bg-canvas rounded-md">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-ink mb-1">Delivery Notes (e.g. "Ring bell twice")</label>
            <textarea
              rows={2}
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
              placeholder="e.g. Leave with security. Apartment 4B."
              className="w-full text-xs p-2.5 bg-canvas border border-hairline rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-dot/40"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-hairline text-muted hover:bg-canvas font-semibold text-xs rounded-xl">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2 bg-charcoal hover:bg-charcoal-hover text-white font-bold text-xs rounded-xl shadow-soft">
              Dispatch Order
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
