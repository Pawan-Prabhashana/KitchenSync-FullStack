import { useState, useCallback } from 'react';
import { ConflictInfo, Versioned } from '../types';

/**
 * Optimistic-concurrency conflict guard.
 *
 * Tracks the `version` a user last "saw" for each order they've opened (the
 * baseline). Before applying a mutation we compare the order's current version
 * in state against that baseline — if state has moved ahead, someone else edited
 * the order first and we must NOT silently overwrite. Instead we surface a
 * conflict and hold the user's change.
 *
 * This is deliberately transport-agnostic: today the "someone else edited it"
 * signal comes from the demo `raise()` call (Simulate teammate edit), but swapping
 * that for a real Socket.io `order:updated` event is a drop-in change — the
 * version-comparison logic here stays identical.
 */
export function useConflictGuard<T extends Versioned>() {
  // Baseline version per order id = the version the current user last acknowledged.
  const [baseVersions, setBaseVersions] = useState<Record<string, number>>({});
  const [conflict, setConflict] = useState<ConflictInfo | null>(null);

  /** Record the version a user is now looking at (call when a drawer opens). */
  const track = useCallback((order: T) => {
    setBaseVersions(prev => ({ ...prev, [order.id]: order.version }));
    // Opening/refreshing an order means the user has now seen its latest state.
    setConflict(prev => (prev && prev.orderId === order.id ? null : prev));
  }, []);

  /**
   * Gate a mutation. Returns `true` when it's safe to apply, or `false` when a
   * newer version exists — in which case a conflict is raised and the caller
   * must abort the mutation.
   */
  const guard = useCallback((current: T): boolean => {
    const base = baseVersions[current.id];
    if (base !== undefined && current.version > base) {
      setConflict({
        orderId: current.id,
        updatedBy: current.lastUpdatedBy,
        updatedAt: current.lastUpdatedAt
      });
      return false;
    }
    return true;
  }, [baseVersions]);

  /** Advance the baseline after the current user's own successful mutation. */
  const commit = useCallback((order: T) => {
    setBaseVersions(prev => ({ ...prev, [order.id]: order.version }));
  }, []);

  /** Manually raise a conflict (demo "teammate edit" / future socket event). */
  const raise = useCallback((info: ConflictInfo) => {
    setConflict(info);
  }, []);

  /** User accepted the newer version: adopt it as the new baseline and clear. */
  const resolve = useCallback((order: T) => {
    setBaseVersions(prev => ({ ...prev, [order.id]: order.version }));
    setConflict(null);
  }, []);

  const clear = useCallback(() => setConflict(null), []);

  return { conflict, track, guard, commit, raise, resolve, clear };
}
