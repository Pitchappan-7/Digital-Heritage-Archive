import type { SearchResult } from '../../types/search';
import { DocumentCard } from './DocumentCard';

export interface SearchResultsProps {
  result: SearchResult | null;
  loading?: boolean;
  error?: string | null;
  onSelectDocument?: (documentId: string) => void;
}

/**
 * Foundation search results list. Shows empty/error states — never fake hits.
 */
export function SearchResults({
  result,
  loading = false,
  error = null,
  onSelectDocument,
}: SearchResultsProps) {
  if (loading) {
    return <p className="text-sm text-[#554242]">Searching the archive…</p>;
  }

  if (error) {
    return <p className="text-sm text-[#540414]">{error}</p>;
  }

  if (!result) {
    return <p className="text-sm text-[#554242]">Enter a query to search the archive.</p>;
  }

  if (result.hits.length === 0) {
    return (
      <p className="text-sm text-[#554242]">
        No results for &ldquo;{result.query}&rdquo; ({result.mode} search).
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <p className="font-mono text-[10px] uppercase tracking-wider text-[#554242]">
        {result.total} result{result.total === 1 ? '' : 's'} · {result.mode}
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {result.hits.map((hit) => (
          <DocumentCard
            key={hit.document.id}
            document={hit.document}
            onSelect={
              onSelectDocument ? (doc) => onSelectDocument(doc.id) : undefined
            }
          />
        ))}
      </div>
    </div>
  );
}
