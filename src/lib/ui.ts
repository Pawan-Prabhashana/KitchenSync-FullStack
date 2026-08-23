import { Role } from '../types';

/** The soft accent families in the design system. */
export type Accent = 'green' | 'peach' | 'coral' | 'sky' | 'lilac';

/** Full literal class strings (Tailwind v4 needs to see these verbatim). */
export const CHIP: Record<Accent, string> = {
  green: 'bg-green-chip text-green-ink',
  peach: 'bg-peach-chip text-peach-ink',
  coral: 'bg-coral-chip text-coral-ink',
  sky: 'bg-sky-chip text-sky-ink',
  lilac: 'bg-lilac-chip text-lilac-ink'
};

export const DOT: Record<Accent, string> = {
  green: 'bg-green-dot',
  peach: 'bg-peach-dot',
  coral: 'bg-coral-dot',
  sky: 'bg-sky-dot',
  lilac: 'bg-lilac-dot'
};

export const RING: Record<Accent, string> = {
  green: 'ring-green-dot',
  peach: 'ring-peach-dot',
  coral: 'ring-coral-dot',
  sky: 'ring-sky-dot',
  lilac: 'ring-lilac-dot'
};

const ACCENTS: Accent[] = ['green', 'peach', 'coral', 'sky', 'lilac'];

/** Stable hash so a given name always maps to the same accent. */
export function nameToAccent(name: string): Accent {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return ACCENTS[h % ACCENTS.length];
}

/** Ring color encodes role. */
export function roleRing(role: Role | undefined): string {
  switch (role) {
    case 'chef': return 'ring-green-dot';
    case 'waiter': return 'ring-peach-dot';
    case 'rider': return 'ring-sky-dot';
    default: return 'ring-charcoal'; // admin / unknown
  }
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
