import type { ArchiveDocument, DocumentFile } from '../../types/document';

export interface DocumentViewerProps {
  document: ArchiveDocument;
  fileUrl?: string | null;
  file?: DocumentFile | null;
  emptyMessage?: string;
}

/**
 * Foundation document viewer shell. Does not fabricate OCR or page content.
 */
export function DocumentViewer({
  document,
  fileUrl,
  file,
  emptyMessage = 'No file preview available for this document.',
}: DocumentViewerProps) {
  const mime = file?.mime_type ?? '';
  const isImage = mime.startsWith('image/');
  const isPdf = mime === 'application/pdf' || file?.file_name?.toLowerCase().endsWith('.pdf');

  return (
    <section className="flex w-full flex-col border border-[#ede7e2] bg-[#fff8f3]">
      <header className="border-b border-[#ede7e2] px-4 py-3">
        <h2 className="text-lg font-medium text-[#1d1b18]">{document.title}</h2>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-[#554242]">
          {file?.file_name || 'No file attached'}
        </p>
      </header>
      <div className="flex min-h-[320px] items-center justify-center bg-[#f9f2ed] p-4">
        {!fileUrl ? (
          <p className="text-sm text-[#554242]">{emptyMessage}</p>
        ) : isImage ? (
          <img
            src={fileUrl}
            alt={document.title}
            className="max-h-[70vh] max-w-full object-contain"
          />
        ) : isPdf ? (
          <iframe title={document.title} src={fileUrl} className="h-[70vh] w-full border-0" />
        ) : (
          <a
            href={fileUrl}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-[#540414] underline"
          >
            Open file
          </a>
        )}
      </div>
    </section>
  );
}
