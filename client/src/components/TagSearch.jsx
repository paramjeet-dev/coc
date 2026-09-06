'use client';

import { useState } from 'react';
import { MagnifyingGlass, ArrowRight } from '@phosphor-icons/react';

/**
 * TagSearch
 * Isolated client leaf. Owns its own input state and focus ring only,
 * no global state needed for a single uncontrolled-feeling search field.
 */
export default function TagSearch() {
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className={`flex items-center gap-3 border bg-zinc-950 px-4 py-3 transition-colors duration-200 ${
        focused ? 'border-emerald-500/60' : 'border-slate-800'
      }`}
    >
      <MagnifyingGlass size={18} strokeWidth={1.5} className="shrink-0 text-zinc-500" />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="#PLAYERTAG"
        className="w-full bg-transparent font-mono text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none"
      />
      <button
        type="submit"
        className="flex shrink-0 items-center gap-1.5 bg-emerald-500 px-3 py-1.5 font-mono text-xs font-medium text-zinc-950 transition-colors hover:bg-emerald-400"
      >
        Pull
        <ArrowRight size={14} strokeWidth={1.5} />
      </button>
    </form>
  );
}