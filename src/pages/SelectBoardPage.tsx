import React from 'react';
import { motion } from 'motion/react';
import { ChefHat, Bike, ArrowRight, MapPin } from 'lucide-react';
import { BoardType, Branch, User } from '../types';

interface SelectBoardPageProps {
  currentUser: User | null;
  branch?: Branch;
  onSelect: (board: BoardType) => void;
}

interface BoardCard {
  type: BoardType;
  title: string;
  description: string;
  icon: React.ElementType;
  iconBox: string;
  accentText: string;
  hoverBorder: string;
}

const CARDS: BoardCard[] = [
  {
    type: 'kitchen',
    title: 'Kitchen',
    description:
      'Live orders from floor to pass. Waiters send orders, chefs cook and advance them through New → Cooking → Ready → Served.',
    icon: ChefHat,
    iconBox: 'bg-green-chip text-green-ink',
    accentText: 'text-green-ink',
    hoverBorder: 'hover:border-green-dot/60'
  },
  {
    type: 'delivery',
    title: 'Delivery',
    description:
      'Track delivery orders from kitchen to doorstep. Dispatch, assign riders, and follow each drop from Preparing to Delivered.',
    icon: Bike,
    iconBox: 'bg-sky-chip text-sky-ink',
    accentText: 'text-sky-ink',
    hoverBorder: 'hover:border-sky-dot/60'
  }
];

export const SelectBoardPage: React.FC<SelectBoardPageProps> = ({ currentUser, branch, onSelect }) => {
  const firstName = currentUser?.name?.split(' ')[0];

  return (
    <div className="min-h-screen bg-canvas flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="text-center mb-10"
        >
          {branch && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface border border-hairline text-[11px] font-semibold text-muted shadow-soft mb-4">
              <MapPin className="w-3.5 h-3.5 text-green-ink" />
              {branch.city}
            </div>
          )}
          <h1 className="text-3xl font-bold text-ink">
            {firstName ? `Which board, ${firstName}?` : 'Choose your board'}
          </h1>
          <p className="text-sm text-muted mt-2">
            Pick a board to open. You can switch anytime from the header.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {CARDS.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.button
                key={card.type}
                type="button"
                onClick={() => onSelect(card.type)}
                aria-label={`Open ${card.title} board`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0.05 + i * 0.08 }}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
                className={`group text-left rounded-card border border-hairline bg-surface p-6 shadow-soft hover:shadow-soft-lg ${card.hoverBorder} transition-[box-shadow,border-color] focus:outline-none focus-visible:ring-2 focus-visible:ring-green-dot`}
              >
                <div className="flex items-start justify-between mb-5">
                  <div className={`w-14 h-14 rounded-2xl ${card.iconBox} flex items-center justify-center`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <ArrowRight className={`w-5 h-5 ${card.accentText} opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all`} />
                </div>

                <h2 className="text-xl font-bold text-ink mb-1.5">{card.title}</h2>
                <p className="text-sm text-muted leading-relaxed min-h-[60px]">{card.description}</p>

                <div className="mt-5 pt-4 border-t border-hairline flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-faint">Board</span>
                  <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${card.accentText}`}>
                    Tap to open
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SelectBoardPage;
