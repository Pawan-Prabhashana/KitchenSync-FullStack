import React from 'react';
import { Wifi, Users, Clock, RefreshCcw } from 'lucide-react';

interface BottomStatusBarProps {
  isConnected: boolean;
  activeUsersCount: number;
  lastUpdatedUser?: string;
  lastUpdatedTime?: string;
}

export const BottomStatusBar: React.FC<BottomStatusBarProps> = ({
  isConnected,
  activeUsersCount,
  lastUpdatedUser,
  lastUpdatedTime
}) => {
  return (
    <footer className="bg-surface border-t border-hairline px-4 py-2 text-xs text-muted flex flex-wrap items-center justify-between gap-3 sticky bottom-0 z-20 shadow-soft">
      {/* Left: Socket connectivity status */}
      <div className="flex items-center gap-2 font-medium">
        <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-chip/500 animate-pulse' : 'bg-red-500'}`} />
        <span className="text-ink font-semibold">{isConnected ? 'Connected' : 'Disconnected'}</span>
      </div>

      {/* Center: Active users count & Last updated info */}
      <div className="flex items-center gap-6 font-medium">
        <div className="flex items-center gap-1.5 text-muted">
          <Users className="w-3.5 h-3.5 text-faint" />
          <span>Active Users: <strong className="text-ink font-mono">{activeUsersCount}</strong></span>
        </div>

        {lastUpdatedUser && (
          <div className="hidden sm:flex items-center gap-1.5 text-muted">
            <Clock className="w-3.5 h-3.5 text-faint" />
            <span>Updated by <strong className="text-ink">{lastUpdatedUser}</strong></span>
            <span className="text-faint text-[11px]">({lastUpdatedTime || 'just now'})</span>
          </div>
        )}
      </div>

      {/* Right: Live Sync Badge */}
      <div className="flex items-center gap-1.5 text-green-ink bg-green-chip/50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-semibold text-[11px]">
        <RefreshCcw className="w-3 h-3 animate-spin text-green-ink" />
        <span>Live Sync</span>
      </div>
    </footer>
  );
};
