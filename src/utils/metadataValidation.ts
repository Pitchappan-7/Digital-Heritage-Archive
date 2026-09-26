export interface MetadataValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validates archival metadata key/value pairs before persistence.
 */
export function validateMetadataEntry(
  key: string,
  value: string | null | undefined
): MetadataValidationResult {
  const errors: string[] = [];
  const trimmedKey = key?.trim() ?? '';

  if (!trimmedKey) {
    errors.push('metadata_key is required.');
  } else if (trimmedKey.length > 256) {
    errors.push('metadata_key must be 256 characters or fewer.');
  }

  if (value != null && value.length > 10_000) {
    errors.push('metadata_value must be 10,000 characters or fewer.');
  }

  return { valid: errors.length === 0, errors };
}

export function validateDocumentTitle(title: string | null | undefined): MetadataValidationResult {
  const errors: string[] = [];
  const trimmed = title?.trim() ?? '';

  if (!trimmed) {
    errors.push('Document title is required.');
  } else if (trimmed.length > 500) {
    errors.push('Document title must be 500 characters or fewer.');
  }

  return { valid: errors.length === 0, errors };
}
