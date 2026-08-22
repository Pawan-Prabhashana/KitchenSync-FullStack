import React, { useState, useEffect, useRef } from 'react';
import {
  LayoutGrid, ClipboardList, Users, Clock, BarChart3, Settings, Plus, Filter, Bike, LogOut, ChevronsUpDown
} from 'lucide-react';
import { FilterOptions, BoardType, User } from '../types';
import { DEMO_USERS, DEMO_RIDERS, TABLES, PAYMENT_METHODS } from '../data/menu';
import { BOARD_ACCENTS } from '../lib/boardConfig';
import { Avatar } from './Avatar';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  filters: FilterOptions;
  setFilters: React.Dispatch<React.SetStateAction<FilterOptions>>;
  onOpenNewOrder: () => void;
  boardType: BoardType;
  currentUser: User | null;
  onLogout: () => void;
  onOpenAuth: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  filters,
  setFilters,
  onOpenNewOrder,
  boardType,
  currentUser,
  onLogout,
  onOpenAuth
}) => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const accent = BOARD_ACCENTS[boardType];
  const isDelivery = boardType === 'delivery';

  const chefRef = useRef<HTMLDivElement | null>(null);
  const tableRef = useRef<HTMLDivElement | null>(null);
  const [chefOpen, setChefOpen] = useState(false);
  const [tableOpen, setTableOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (chefRef.current && !chefRef.current.contains(e.target as Node)) setChefOpen(false);
      if (tableRef.current && !tableRef.current.contains(e.target as Node)) setTableOpen(false);
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  const navItems = [
    { id: 'board', label: 'Board', icon: LayoutGrid },
    { id: 'orders', label: 'Orders', icon: ClipboardList },
    { id: 'chefs', label: isDelivery ? 'Riders' : 'Chefs', icon: isDelivery ? Bike : Users },
    { id: 'history', label: 'History', icon: Clock },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const assignees = isDelivery ? DEMO_RIDERS : DEMO_USERS.filter(u => u.role === 'chef');
  const assigneeLabel = isDelivery ? 'Rider' : 'Chef';
  const secondaryLabel = isDelivery ? 'Payment' : 'Table';
  const secondaryOptions = isDelivery ? PAYMENT_METHODS : TABLES;
  const hasFilters = filters.chef !== 'all' || filters.table !== 'all' || !!filters.search;

  const clearFilters = () => setFilters(prev => ({ ...prev, chef: 'all', table: 'all', search: '' }));

  const timeStr = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  const dateStr = currentTime.toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' });

  return (
    <aside className="fixed left-0 top-[57px] w-64 bg-surface border-r border-hairline flex flex-col h-[calc(100vh-57px-44px)] shrink-0 p-3 justify-between z-25">
      <div className="space-y-5 overflow-y-auto ks-scroll pr-0.5">
        {/* Profile */}
        <button
          onClick={onOpenAuth}
          className="w-full flex items-center gap-3 p-2.5 rounded-2xl border border-hairline hover:bg-canvas transition-colors text-left"
        >
          {currentUser
            ? <Avatar name={currentUser.name} role={currentUser.role} size="md" />
            : <Avatar name="?" size="md" showRing={false} />}
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-ink truncate">{currentUser?.name ?? 'Guest'}</div>
            <div className="text-[11px] text-muted capitalize">{currentUser?.role ?? 'Not signed in'}</div>
          </div>
          <ChevronsUpDown className="w-4 h-4 text-faint shrink-0" />
        </button>

        {/* Nav */}
        <nav className="space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive ? `${accent.navActive}` : 'text-muted hover:text-ink hover:bg-canvas'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-faint'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Filters */}
        <div className="border-t border-hairline pt-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold tracking-wide text-faint uppercase">Filters</span>
            {hasFilters && (
              <button onClick={clearFilters} className="text-[11px] font-medium text-muted hover:text-ink transition-colors">
                Clear all
              </button>
            )}
          </div>

          {/* Assignee filter */}
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-muted">By {assigneeLabel}</label>
            <div className="relative" ref={chefRef}>
              <button
                onClick={() => { setChefOpen(v => !v); setTableOpen(false); }}
                className={`w-full text-left text-xs bg-canvas border border-hairline rounded-xl px-2 py-1.5 text-ink focus:outline-none focus:ring-2 transition-all flex items-center justify-between ${accent.focusInput}`}
              >
                <span className="flex items-center gap-2 min-w-0">
                  {filters.chef === 'all'
                    ? <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-canvas border border-hairline text-[10px] font-semibold text-muted">All</span>
                    : <Avatar name={filters.chef} size="xs" showRing={false} />}
                  <span className="text-xs truncate">{filters.chef === 'all' ? `All ${assigneeLabel}s` : filters.chef}</span>
                </span>
                <Filter className="w-3.5 h-3.5 text-faint shrink-0" />
              </button>

              {chefOpen && (
                <ul className="absolute left-0 right-0 bottom-full mb-2 bg-surface border border-hairline rounded-2xl shadow-pop p-1.5 max-h-52 overflow-y-auto z-30 ks-scroll">
                  <li>
                    <button onClick={() => { setFilters(prev => ({ ...prev, chef: 'all' })); setChefOpen(false); }}
                      className="w-full text-left px-2.5 py-2 rounded-lg text-xs hover:bg-canvas">All {assigneeLabel}s</button>
                  </li>
                  {assignees.map(a => (
                    <li key={a.id}>
                      <button onClick={() => { setFilters(prev => ({ ...prev, chef: a.name })); setChefOpen(false); }}
                        className="w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-center gap-2 hover:bg-canvas">
                        <Avatar name={a.name} role={a.role} size="xs" />
                        <div className="min-w-0">
                          <div className="text-xs font-medium text-ink truncate">{a.name}</div>
                          <div className="text-[10px] text-muted capitalize">{a.role}</div>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Secondary filter */}
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-muted">By {secondaryLabel}</label>
            <div className="relative" ref={tableRef}>
              <button
                onClick={() => { setTableOpen(v => !v); setChefOpen(false); }}
                className={`w-full text-left text-xs bg-canvas border border-hairline rounded-xl px-2 py-1.5 text-ink focus:outline-none focus:ring-2 transition-all flex items-center justify-between ${accent.focusInput}`}
              >
                <span className="flex items-center gap-2 min-w-0">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-canvas border border-hairline text-[10px] font-semibold text-muted">
                    {filters.table === 'all' ? '#' : filters.table.charAt(0)}
                  </span>
                  <span className="truncate">{filters.table === 'all' ? `All ${secondaryLabel}s` : filters.table}</span>
                </span>
                <Filter className="w-3.5 h-3.5 text-faint shrink-0" />
              </button>

              {tableOpen && (
                <ul className="absolute left-0 right-0 bottom-full mb-2 bg-surface border border-hairline rounded-2xl shadow-pop p-1.5 max-h-52 overflow-y-auto z-30 ks-scroll">
                  <li>
                    <button onClick={() => { setFilters(prev => ({ ...prev, table: 'all' })); setTableOpen(false); }}
                      className="w-full text-left px-2.5 py-2 rounded-lg text-xs hover:bg-canvas">All {secondaryLabel}s</button>
                  </li>
                  {secondaryOptions.map(opt => (
                    <li key={opt}>
                      <button onClick={() => { setFilters(prev => ({ ...prev, table: opt })); setTableOpen(false); }}
                        className="w-full text-left px-2.5 py-2 rounded-lg text-xs hover:bg-canvas font-medium text-ink">{opt}</button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <button
            onClick={onOpenNewOrder}
            className={`w-full flex items-center justify-center gap-2 mt-3 px-4 py-2.5 font-semibold text-xs rounded-xl transition-all active:scale-[0.98] ${accent.solidBtn}`}
          >
            <Plus className="w-4 h-4" />
            <span>{isDelivery ? 'New Delivery' : 'New Order'}</span>
          </button>
        </div>
      </div>

      {/* Bottom: clock + logout */}
      <div className="space-y-2 pt-2">
        <div className="rounded-2xl border border-hairline p-3 flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isDelivery ? 'bg-sky-chip text-sky-ink' : 'bg-green-chip text-green-ink'}`}>
            <Clock className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-wide font-semibold text-faint">
              {isDelivery ? 'Dispatch Time' : 'Kitchen Time'}
            </div>
            <div className="text-sm font-bold font-mono text-ink tracking-tight">{timeStr}</div>
            <div className="text-[10px] text-muted">{dateStr}</div>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-muted hover:text-coral-ink hover:bg-coral-chip/50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
};
