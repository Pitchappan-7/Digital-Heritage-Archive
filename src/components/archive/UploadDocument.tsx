import { type ChangeEvent, useState } from 'react';
import { validateUploadFile } from '../../utils/fileValidation';

export interface UploadDocumentProps {
  documentId: string;
  onUpload: (documentId: string, file: File) => Promise<unknown>;
  uploading?: boolean;
  error?: string | null;
  disabled?: boolean;
}

/**
 * Foundation upload control. Validates file type/size; does not fake OCR success.
 */
export function UploadDocument({
  documentId,
  onUpload,
  uploading = false,
  error = null,
  disabled = false,
}: UploadDocumentProps) {
  const [localError, setLocalError] = useState<string | null>(null);

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    const validation = validateUploadFile(file);
    if (!validation.valid) {
      setLocalError(validation.errors.join(' '));
      return;
    }

    setLocalError(null);
    await onUpload(documentId, file);
  };

  const message = localError || error;

  return (
    <div className="border border-dashed border-[#ede7e2] bg-[#f9f2ed] p-4">
      <label className="block cursor-pointer">
        <span className="font-mono text-xs uppercase tracking-wider text-[#554242]">
          Upload archival file
        </span>
        <input
          type="file"
          className="mt-2 block w-full text-sm text-[#1d1b18]"
          accept=".pdf,.png,.jpg,.jpeg,.webp,.mp3,.wav,.mp4,.mov"
          disabled={disabled || uploading || !documentId}
          onChange={handleChange}
        />
      </label>
      <p className="mt-2 text-xs text-[#554242]">
        PDF, PNG, JPG, WEBP, MP3, WAV, MP4, MOV · max 100 MB
      </p>
      {uploading ? <p className="mt-2 text-sm text-[#554242]">Uploading…</p> : null}
      {message ? <p className="mt-2 text-sm text-[#540414]">{message}</p> : null}
    </div>
  );
}
