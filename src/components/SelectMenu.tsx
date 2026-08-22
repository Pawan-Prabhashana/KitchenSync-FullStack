import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface Option {
  value: string;
  label: string;
  meta?: React.ReactNode;
}

interface SelectMenuProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  openUp?: boolean;
  renderItem?: (opt: Option) => React.ReactNode;
  className?: string;
  size?: 'sm' | 'md';
}

export const SelectMenu: React.FC<SelectMenuProps> = ({
  options,
  value,
  onChange,
  placeholder,
  openUp = false,
  renderItem,
  className,
  size = 'md'
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  const selected = options.find(o => o.value === value);

  const sizeBtn = size === 'sm' ? 'px-2 py-1 text-[11px] rounded-lg' : 'px-3 py-2 text-xs rounded-xl';

  return (
    <div className={`relative ${className || ''}`} ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className={`w-full text-left bg-canvas border border-hairline text-ink flex items-center justify-between ${sizeBtn}`}
      >
        <div className="flex items-center gap-2">
          {selected ? (
            <span className="text-sm font-medium">{selected.label}</span>
          ) : (
            <span className="text-xs text-muted">{placeholder}</span>
          )}
        </div>
        <ChevronDown className="w-4 h-4 text-faint" />
      </button>

      {open && (
        <ul className={`absolute left-0 right-0 ${openUp ? 'bottom-full mb-2' : 'mt-2'} bg-surface border border-hairline rounded-lg shadow-lg max-h-56 overflow-y-auto z-40`}>
          {options.map(opt => (
            <li key={opt.value}>
              <button
                type="button"
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className="w-full text-left px-3 py-2 text-xs hover:bg-canvas flex items-center gap-2"
              >
                {renderItem ? renderItem(opt) : <span className="flex-1">{opt.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SelectMenu;
