import { type FormEvent, useState } from 'react';
import type { SearchMode } from '../../types/search';

export interface SearchBarProps {
  initialQuery?: string;
  mode?: SearchMode;
  onSearch: (query: string, mode: SearchMode) => void;
  disabled?: boolean;
}

/**
 * Foundation search bar. Uses existing archive colors; not wired into ExploreView.
 */
export function SearchBar({
  initialQuery = '',
  mode = 'keyword',
  onSearch,
  disabled = false,
}: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const [searchMode, setSearchMode] = useState<SearchMode>(mode);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSearch(query.trim(), searchMode);
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-2 sm:flex-row sm:items-center">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search the archive…"
        disabled={disabled}
        className="min-w-0 flex-1 border border-[#ede7e2] bg-[#fff8f3] px-3 py-2 text-sm text-[#1d1b18] outline-none focus:border-[#540414]"
      />
      <select
        value={searchMode}
        onChange={(e) => setSearchMode(e.target.value as SearchMode)}
        disabled={disabled}
        className="border border-[#ede7e2] bg-[#fff8f3] px-3 py-2 text-sm text-[#1d1b18]"
      >
        <option value="keyword">Keyword</option>
        <option value="semantic">Semantic</option>
        <option value="hybrid">Hybrid</option>
      </select>
      <button
        type="submit"
        disabled={disabled}
        className="bg-[#540414] px-4 py-2 text-sm text-[#fff8f3] disabled:opacity-50"
      >
        Search
      </button>
    </form>
  );
}
