import React, { useEffect, useRef, useState } from 'react';
import { ChefHat, Bike, Search, RotateCcw, ChevronDown, MapPin, Check, Plus } from 'lucide-react';
import { User, FilterOptions, BoardType, Branch } from '../types';
import { BOARD_ACCENTS } from '../lib/boardConfig';
import { Avatar } from './Avatar';

interface HeaderProps {
  currentUser: User | null;
  activeUsersCount: number;
  filters: FilterOptions;
  setFilters: React.Dispatch<React.SetStateAction<FilterOptions>>;
  onOpenAuth: () => void;
  onOpenNewOrder: () => void;
  onUndo: () => void;
  canUndo: boolean;
  activeTab: string;
  boardType: BoardType;
  onSwitchBoard: () => void;
  activeBranch: Branch | null;
  branches: Branch[];
  onSwitchBranch: (branch: Branch) => void;
  onChangeBranch: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  filters,
  setFilters,
  onOpenAuth,
  onOpenNewOrder,
  onUndo,
  canUndo,
  activeTab,
  boardType,
  onSwitchBoard,
  activeBranch,
  branches,
  onSwitchBranch
}) => {
  const accent = BOARD_ACCENTS[boardType];
  const BoardIcon = boardType === 'kitchen' ? ChefHat : Bike;

  const [branchOpen, setBranchOpen] = useState(false);
  const branchRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (branchRef.current && !branchRef.current.contains(e.target as Node)) setBranchOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  return (
    <header className="bg-surface border-b border-hairline px-4 py-2.5 sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3">
      {/* Brand + switchers */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 rounded-2xl ${accent.logoBox} flex items-center justify-center`}>
            <BoardIcon className="w-5 h-5" />
          </div>
          <div className="hidden sm:block leading-none">
            <span className="font-bold text-ink text-[15px] tracking-tight">KitchenSync</span>
            <p className="text-[11px] text-muted mt-0.5">{accent.subtitle}</p>
          </div>
        </div>

        <div className="h-6 w-px bg-hairline hidden sm:block" />

        {/* Branch switcher */}
        <div className="relative" ref={branchRef}>
          <button
            onClick={() => setBranchOpen(v => !v)}
            aria-label="Switch branch"
            aria-haspopup="listbox"
            aria-expanded={branchOpen}
            className="inline-flex items-center gap-1.5 pl-2 pr-2.5 py-1.5 rounded-full text-xs font-semibold bg-canvas border border-hairline text-ink hover:border-faint transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-muted" />
            <span>{activeBranch?.city ?? 'Branch'}</span>
            <ChevronDown className="w-3 h-3 text-faint" />
          </button>

          {branchOpen && (
            <ul
              role="listbox"
              className="absolute left-0 mt-2 w-60 bg-surface border border-hairline rounded-2xl shadow-pop p-1.5 z-40 max-h-80 overflow-y-auto ks-scroll"
            >
              <li className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-faint">
                Branches
              </li>
              {branches.map(b => {
                const active = b.id === activeBranch?.id;
                return (
                  <li key={b.id}>
                    <button
                      role="option"
                      aria-selected={active}
                      onClick={() => { onSwitchBranch(b); setBranchOpen(false); }}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left transition-colors ${
                        active ? 'bg-canvas' : 'hover:bg-canvas'
                      }`}
                    >
                      <span className="w-7 h-7 rounded-full bg-green-chip text-green-ink flex items-center justify-center shrink-0">
                        <MapPin className="w-3.5 h-3.5" />
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-xs font-semibold text-ink truncate">{b.city}</span>
                        <span className="block text-[10px] text-muted truncate">{b.name}</span>
                      </span>
                      {active && <Check className="w-4 h-4 text-green-ink shrink-0" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Board switcher */}
        <button
          onClick={onSwitchBoard}
          aria-label={`Current board: ${accent.label}. Click to switch boards.`}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold transition-all ${accent.switcherChip}`}
        >
          <BoardIcon className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{accent.label}</span>
          <ChevronDown className="w-3 h-3 opacity-60" />
        </button>

        <div className="hidden lg:flex items-center gap-2 pl-1">
          <h1 className="text-sm font-semibold text-ink capitalize">{activeTab}</h1>
          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold ${accent.livePill}`}>
            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${accent.liveDot}`} />
            Live
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 flex-1 max-w-2xl justify-end">
        <div className="relative flex-1 max-w-xs">
          <Search className="w-4 h-4 text-faint absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={boardType === 'delivery' ? 'Search deliveries…' : 'Search orders…'}
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className={`w-full pl-9 pr-3 py-2 text-xs bg-canvas border border-hairline rounded-xl text-ink placeholder-faint focus:outline-none focus:ring-2 transition-all ${accent.focusInput}`}
          />
        </div>

        <div className="hidden md:flex items-center bg-canvas p-0.5 rounded-xl text-xs font-medium border border-hairline">
          {(['all', 'mine'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setFilters(prev => ({ ...prev, viewMode: mode }))}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                filters.viewMode === mode ? 'bg-surface text-ink shadow-soft font-semibold' : 'text-muted hover:text-ink'
              }`}
            >
              {mode === 'all' ? 'All' : 'Mine'}
            </button>
          ))}
        </div>

        <button
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo last card move"
          aria-label="Undo last move"
          className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-medium border transition-all ${
            canUndo
              ? 'bg-surface border-hairline text-ink hover:border-faint active:scale-95'
              : 'bg-canvas border-hairline text-faint cursor-not-allowed'
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Undo</span>
        </button>

        <button
          onClick={onOpenNewOrder}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-charcoal hover:bg-charcoal-hover text-white transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New</span>
        </button>

        <button
          onClick={onOpenAuth}
          aria-label="Account and role"
          className="flex items-center gap-2 pl-1 pr-2.5 py-1 bg-canvas hover:border-faint border border-hairline rounded-full transition-all text-left"
        >
          {currentUser
            ? <Avatar name={currentUser.name} role={currentUser.role} size="sm" />
            : <Avatar name="?" size="sm" showRing={false} />}
          <div className="hidden sm:block leading-tight">
            <div className="text-xs font-semibold text-ink">{currentUser?.name ?? 'Select User'}</div>
            <div className="text-[10px] text-muted capitalize">{currentUser?.role ?? 'Guest'}</div>
          </div>
        </button>
      </div>
    </header>
  );
};
