import { Stage, DeliveryStage, BoardType } from '../types';

/** Ordered kitchen stages and the forward transition between them. */
export const KITCHEN_STAGES: Stage[] = ['New', 'Cooking', 'Ready', 'Served'];
export const DELIVERY_STAGES: DeliveryStage[] = [
  'Preparing',
  'Ready for Pickup',
  'Out for Delivery',
  'Delivered'
];

export const getNextKitchenStage = (current: Stage): Stage | null => {
  const idx = KITCHEN_STAGES.indexOf(current);
  return idx >= 0 && idx < KITCHEN_STAGES.length - 1 ? KITCHEN_STAGES[idx + 1] : null;
};

export const getNextDeliveryStage = (current: DeliveryStage): DeliveryStage | null => {
  const idx = DELIVERY_STAGES.indexOf(current);
  return idx >= 0 && idx < DELIVERY_STAGES.length - 1 ? DELIVERY_STAGES[idx + 1] : null;
};

/**
 * Per-board accent theming. Tailwind v4 only emits classes it can see as
 * literal strings, so every accent variant is spelled out in full here rather
 * than composed dynamically. Kitchen keeps the existing emerald direction;
 * Delivery uses a distinct indigo accent.
 */
export interface BoardAccent {
  label: string;
  subtitle: string;
  /** Primary solid action buttons. */
  solidBtn: string;
  /** Small square logo / icon box. */
  logoBox: string;
  /** Active sidebar nav item background + text. */
  navActive: string;
  navIcon: string;
  /** "Live" status pill in the header. */
  livePill: string;
  liveDot: string;
  /** Fallback avatar chip. */
  avatarFallback: string;
  /** Soft chip used by the board switcher. */
  switcherChip: string;
  /** Accent focus ring for inputs. */
  focusInput: string;
}

export const BOARD_ACCENTS: Record<BoardType, BoardAccent> = {
  kitchen: {
    label: 'Kitchen',
    subtitle: 'Real-time Kitchen Board',
    solidBtn: 'bg-charcoal hover:bg-charcoal-hover text-white',
    logoBox: 'bg-green-chip text-green-ink',
    navActive: 'bg-charcoal text-white',
    navIcon: 'text-green-ink',
    livePill: 'bg-green-chip text-green-ink',
    liveDot: 'bg-green-dot',
    avatarFallback: 'bg-green-chip text-green-ink',
    switcherChip: 'bg-green-chip text-green-ink hover:brightness-95',
    focusInput: 'focus:ring-green-dot/40 focus:border-green-dot'
  },
  delivery: {
    label: 'Delivery',
    subtitle: 'Live Delivery Dispatch',
    solidBtn: 'bg-charcoal hover:bg-charcoal-hover text-white',
    logoBox: 'bg-sky-chip text-sky-ink',
    navActive: 'bg-charcoal text-white',
    navIcon: 'text-sky-ink',
    livePill: 'bg-sky-chip text-sky-ink',
    liveDot: 'bg-sky-dot',
    avatarFallback: 'bg-sky-chip text-sky-ink',
    switcherChip: 'bg-sky-chip text-sky-ink hover:brightness-95',
    focusInput: 'focus:ring-sky-dot/40 focus:border-sky-dot'
  }
};
