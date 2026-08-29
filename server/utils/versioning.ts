import { Versioned, Actor } from '../models/types';
import { makeHistoryId } from './ids';

/** Current time formatted like the frontend stamps (`12:42 PM`). */
export function nowTime(): string {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/** A history row — kitchen and delivery share this exact shape. */
interface HistoryRow {
  id: string;
  stage: string;
  timestamp: string;
  user: string;
  role: string;
}

/**
 * Apply a patch to a versioned, staged entity: merge the changes, bump `version`,
 * stamp `lastUpdatedBy`/`lastUpdatedAt`, and append a history entry when the stage
 * changes. This is the shared mutation rule used by every repository so the
 * Mongoose implementation in M3 behaves identically.
 */
export function bumpVersion<T extends Versioned & { stage: string; history: HistoryRow[] }>(
  current: T,
  patch: Partial<T>,
  actor: Actor
): T {
  const now = nowTime();
  const stageChanged = patch.stage !== undefined && patch.stage !== current.stage;

  const history: HistoryRow[] = stageChanged
    ? [
        ...current.history,
        {
          id: makeHistoryId('h'),
          stage: patch.stage as string,
          timestamp: now,
          user: actor.name,
          role: actor.role
        }
      ]
    : current.history;

  return {
    ...current,
    ...patch,
    version: current.version + 1,
    lastUpdatedBy: actor.name,
    lastUpdatedAt: now,
    history: history as T['history']
  };
}
