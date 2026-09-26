import type { ArchiveDocument } from '../../types/document';
import { formatArchiveDate } from '../../utils/formatDate';

export interface DocumentCardProps {
  document: ArchiveDocument;
  onSelect?: (document: ArchiveDocument) => void;
}

/**
 * Foundation document card — uses existing archive palette.
 * Not wired into App views yet; safe to adopt later without redesigning ExploreView.
 */
export function DocumentCard({ document, onSelect }: DocumentCardProps) {
  return (
    <article
      className="border border-[#ede7e2] bg-[#fff8f3] p-4 text-left transition hover:border-[#540414]/40"
      role={onSelect ? 'button' : undefined}
      tabIndex={onSelect ? 0 : undefined}
      onClick={() => onSelect?.(document)}
      onKeyDown={(e) => {
        if (onSelect && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onSelect(document);
        }
      }}
    >
      <p className="font-mono text-[10px] uppercase tracking-wider text-[#554242]">
        {document.document_type || 'Document'}
        {document.language ? ` · ${document.language}` : ''}
      </p>
      <h3 className="mt-1 text-base font-medium text-[#1d1b18]">{document.title}</h3>
      {document.description ? (
        <p className="mt-2 line-clamp-3 text-sm text-[#554242]">{document.description}</p>
      ) : null}
      <p className="mt-3 font-mono text-[10px] text-[#554242]">
        {formatArchiveDate(document.date_created) || 'Date unknown'}
        {document.verification_status ? ` · ${document.verification_status}` : ''}
      </p>
    </article>
  );
}
