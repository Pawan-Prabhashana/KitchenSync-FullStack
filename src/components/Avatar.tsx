import React from 'react';
import { Role } from '../types';
import { CHIP, roleRing, nameToAccent, initials } from '../lib/ui';

interface AvatarProps {
  name: string;
  role?: Role;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showRing?: boolean;
  className?: string;
}

const SIZES: Record<NonNullable<AvatarProps['size']>, string> = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base'
};

/**
 * Initials avatar on a soft tinted circle (color derived deterministically from
 * the name), with an optional thin role-colored ring. No external image requests.
 */
export const Avatar: React.FC<AvatarProps> = ({
  name,
  role,
  size = 'md',
  showRing = true,
  className = ''
}) => {
  const accent = nameToAccent(name || '?');
  return (
    <div
      className={`shrink-0 rounded-full flex items-center justify-center font-semibold select-none ${CHIP[accent]} ${SIZES[size]} ${
        showRing ? `ring-2 ring-offset-1 ring-offset-surface ${roleRing(role)}` : ''
      } ${className}`}
      title={name}
      aria-hidden="true"
    >
      {initials(name)}
    </div>
  );
};

export default Avatar;
