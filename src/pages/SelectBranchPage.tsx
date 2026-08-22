import React from 'react';
import { motion } from 'motion/react';
import { MapPin, ArrowRight, Store } from 'lucide-react';
import { Branch, User } from '../types';
import { BRANCHES } from '../data/branches';

interface SelectBranchPageProps {
  currentUser: User | null;
  activeBranchId: string | null;
  onSelect: (branch: Branch) => void;
}

export const SelectBranchPage: React.FC<SelectBranchPageProps> = ({
  currentUser,
  activeBranchId,
  onSelect
}) => {
  const firstName = currentUser?.name?.split(' ')[0];

  return (
    <div className="min-h-screen bg-canvas flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface border border-hairline text-[11px] font-semibold text-muted shadow-soft mb-4">
            <Store className="w-3.5 h-3.5 text-green-ink" />
            KitchenSync Branches
          </div>
          <h1 className="text-3xl font-bold text-ink">
            {firstName ? `Welcome, ${firstName}. Choose your branch` : 'Choose your branch'}
          </h1>
          <p className="text-sm text-muted mt-2">
            Each location keeps its own kitchen and delivery boards. You can switch anytime from the header.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {BRANCHES.map((branch, i) => {
            const isActive = branch.id === activeBranchId;
            return (
              <motion.button
                key={branch.id}
                type="button"
                onClick={() => onSelect(branch)}
                aria-label={`Open ${branch.name}`}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22, delay: 0.03 * i }}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                className={`group text-left rounded-card bg-surface border p-5 shadow-soft hover:shadow-soft-lg transition-[box-shadow,border-color] focus:outline-none focus-visible:ring-2 focus-visible:ring-green-dot ${
                  isActive ? 'border-green-dot ring-2 ring-green-dot/40' : 'border-hairline hover:border-green-dot/60'
                }`}
              >
                <div className="flex items-start justify-between mb-6">
                  <span className="w-10 h-10 rounded-full bg-green-chip text-green-ink flex items-center justify-center">
                    <MapPin className="w-5 h-5" />
                  </span>
                  <ArrowRight className="w-4 h-4 text-faint opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                </div>
                <div className="text-lg font-bold text-ink">{branch.city}</div>
                <div className="text-xs text-muted mt-0.5">{branch.name}</div>
                <div className="mt-4 pt-3 border-t border-hairline text-[11px] font-medium text-faint">
                  Kitchen &middot; Delivery
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SelectBranchPage;
