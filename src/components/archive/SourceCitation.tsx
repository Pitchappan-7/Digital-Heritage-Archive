import type { SourceCitation as Citation } from '../../types/source';

export interface SourceCitationProps {
  citations: Citation[];
  emptyMessage?: string;
}

/**
 * Renders RAG / research source citations. Never invents sources.
 */
export function SourceCitationList({
  citations,
  emptyMessage = 'No source citations available.',
}: SourceCitationProps) {
  if (!citations.length) {
    return <p className="text-sm text-[#554242]">{emptyMessage}</p>;
  }

  return (
    <ol className="space-y-3">
      {citations.map((citation, index) => (
        <li
          key={`${citation.documentId}-${citation.chunkId ?? index}`}
          className="border-l-2 border-[#540414] pl-3"
        >
          <p className="text-sm font-medium text-[#1d1b18]">
            {index + 1}. {citation.documentTitle}
          </p>
          {citation.excerpt ? (
            <p className="mt-1 text-sm italic text-[#554242]">&ldquo;{citation.excerpt}&rdquo;</p>
          ) : null}
          <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-[#554242]">
            {[
              citation.repository,
              citation.catalogReference,
              citation.pageNumber != null ? `p. ${citation.pageNumber}` : null,
            ]
              .filter(Boolean)
              .join(' · ') || 'Archival source'}
          </p>
        </li>
      ))}
    </ol>
  );
}

/** Component name matching the project structure. */
export { SourceCitationList as SourceCitation };
