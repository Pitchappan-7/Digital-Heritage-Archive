import { ArchiveError } from './errors';

export function requireString(value: unknown, field: string): string {
  if (typeof value !== 'string' || !value.trim()) {
    throw new ArchiveError('VALIDATION_ERROR', `${field} is required.`, { service: 'validation' });
  }
  return value.trim();
}

export function optionalString(value: unknown): string | undefined {
  if (value == null) return undefined;
  if (typeof value !== 'string') {
    throw new ArchiveError('VALIDATION_ERROR', 'Expected a string value.', { service: 'validation' });
  }
  return value.trim() || undefined;
}

export function optionalNumber(value: unknown): number | undefined {
  if (value == null) return undefined;
  if (typeof value !== 'number' || Number.isNaN(value)) {
    throw new ArchiveError('VALIDATION_ERROR', 'Expected a number value.', { service: 'validation' });
  }
  return value;
}
