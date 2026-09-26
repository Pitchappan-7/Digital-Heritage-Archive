import {
  MAX_UPLOAD_BYTES,
  SUPPORTED_UPLOAD_EXTENSIONS,
  SUPPORTED_UPLOAD_MIME_TYPES,
} from '../types/archive';

export interface FileValidationResult {
  valid: boolean;
  errors: string[];
}

function getExtension(fileName: string): string {
  const idx = fileName.lastIndexOf('.');
  if (idx < 0) return '';
  return fileName.slice(idx).toLowerCase();
}

/**
 * Validates archive upload candidates by MIME type, extension, and size.
 * Does not perform network or OCR checks.
 */
export function validateUploadFile(file: {
  name: string;
  type: string;
  size: number;
}): FileValidationResult {
  const errors: string[] = [];
  const ext = getExtension(file.name);
  const mime = (file.type || '').toLowerCase();

  const extensionOk = (SUPPORTED_UPLOAD_EXTENSIONS as readonly string[]).includes(ext);
  const mimeOk =
    !mime ||
    (SUPPORTED_UPLOAD_MIME_TYPES as readonly string[]).includes(mime) ||
    mime === 'image/jpg';

  if (!extensionOk) {
    errors.push(
      `Unsupported file extension "${ext || '(none)'}". Allowed: ${SUPPORTED_UPLOAD_EXTENSIONS.join(', ')}`
    );
  }

  if (mime && !mimeOk) {
    errors.push(`Unsupported MIME type "${mime}".`);
  }

  if (file.size <= 0) {
    errors.push('File is empty.');
  } else if (file.size > MAX_UPLOAD_BYTES) {
    errors.push(
      `File exceeds maximum size of ${Math.round(MAX_UPLOAD_BYTES / (1024 * 1024))} MB.`
    );
  }

  return { valid: errors.length === 0, errors };
}

export function isSupportedArchiveFile(file: {
  name: string;
  type: string;
  size: number;
}): boolean {
  return validateUploadFile(file).valid;
}
