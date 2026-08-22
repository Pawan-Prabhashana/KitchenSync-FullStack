import { Branch } from '../types';

/** The 8 KitchenSync restaurant branches across Sri Lanka. */
export const BRANCHES: Branch[] = [
  { id: 'br-colombo', name: 'KitchenSync Colombo', city: 'Colombo' },
  { id: 'br-galle', name: 'KitchenSync Galle', city: 'Galle' },
  { id: 'br-kandy', name: 'KitchenSync Kandy', city: 'Kandy' },
  { id: 'br-jaffna', name: 'KitchenSync Jaffna', city: 'Jaffna' },
  { id: 'br-negombo', name: 'KitchenSync Negombo', city: 'Negombo' },
  { id: 'br-kurunegala', name: 'KitchenSync Kurunegala', city: 'Kurunegala' },
  { id: 'br-anuradhapura', name: 'KitchenSync Anuradhapura', city: 'Anuradhapura' },
  { id: 'br-batticaloa', name: 'KitchenSync Batticaloa', city: 'Batticaloa' }
];

export const DEFAULT_BRANCH_ID = BRANCHES[0].id;

export function findBranch(id: string | null | undefined): Branch | null {
  return BRANCHES.find(b => b.id === id) ?? null;
}
