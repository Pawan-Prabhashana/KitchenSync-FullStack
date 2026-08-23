import { useEffect, useRef, useState } from 'react';

/**
 * Returns `true` briefly whenever `version` increases, so a card can flash a
 * gentle highlight when it (or a teammate) updates it live. Skips the initial
 * mount so freshly rendered cards don't flash.
 */
export function useUpdateFlash(version: number, durationMs = 900): boolean {
  const prev = useRef<number | null>(null);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    if (prev.current !== null && version > prev.current) {
      setFlash(true);
      const t = setTimeout(() => setFlash(false), durationMs);
      prev.current = version;
      return () => clearTimeout(t);
    }
    prev.current = version;
  }, [version, durationMs]);

  return flash;
}
