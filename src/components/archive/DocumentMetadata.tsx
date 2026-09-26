import type { ArchiveDocument, DocumentMetadataRow } from '../../types/document';
import { formatArchiveDate } from '../../utils/formatDate';

export interface DocumentMetadataProps {
  document: ArchiveDocument;
  metadata?: DocumentMetadataRow[];
}

/**
 * Foundation metadata panel for archival records.
 */
export function DocumentMetadata({ document, metadata = [] }: DocumentMetadataProps) {
  const rows: Array<{ label: string; value: string }> = [
    { label: 'Type', value: document.document_type || '—' },
    { label: 'Language', value: document.language || '—' },
    { label: 'Created', value: formatArchiveDate(document.date_created) || '—' },
    { label: 'Digitized', value: formatArchiveDate(document.date_digitized) || '—' },
    { label: 'Status', value: document.status || '—' },
    { label: 'Verification', value: document.verification_status || '—' },
    ...metadata.map((m) => ({
      label: m.metadata_key,
      value: m.metadata_value || '—',
    })),
  ];

  return (
    <aside className="border border-[#ede7e2] bg-[#fff8f3] p-4">
      <h3 className="font-mono text-xs uppercase tracking-wider text-[#554242]">Metadata</h3>
      <dl className="mt-3 space-y-2">
        {rows.map((row) => (
          <div key={`${row.label}-${row.value}`} className="grid grid-cols-[8rem_1fr] gap-2 text-sm">
            <dt className="text-[#554242]">{row.label}</dt>
            <dd className="text-[#1d1b18]">{row.value}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}
