import { Injectable } from '@angular/core';

/**
 * Versioned, device-local recovery envelope for an annotation session.
 *
 * The browser never sends this record anywhere: it is kept in localStorage so
 * an accidental reload or tab closure does not discard work that has not yet
 * been downloaded.  It is intentionally a generic JSON envelope because the
 * component owns the canonical export shape and can add fields without this
 * service having to duplicate the annotation model.
 */
export const ANNOTATION_RECOVERY_VERSION = 1 as const;
export const ANNOTATION_RECOVERY_STORAGE_KEY = 'semantiar.annotation-recovery.v1';

export interface AnnotationRecoveryEnvelope {
  version: typeof ANNOTATION_RECOVERY_VERSION;
  savedAt: string;
  sourceFile: string;
  annotatorId: string;
  batch: string;
  document: unknown;
}

@Injectable({ providedIn: 'root' })
export class AnnotationRecoveryService {
  /**
   * Save a snapshot locally. Storage failures (private browsing, quota, or a
   * blocked browser policy) are deliberately swallowed so annotation itself
   * remains usable; callers can expose the resulting availability state.
   */
  save(
    document: unknown,
    identity: Pick<AnnotationRecoveryEnvelope, 'sourceFile' | 'annotatorId' | 'batch'>,
    savedAt = new Date().toISOString(),
  ): boolean {
    const storage = this.storage();
    if (!storage) return false;

    const envelope: AnnotationRecoveryEnvelope = {
      version: ANNOTATION_RECOVERY_VERSION,
      savedAt,
      sourceFile: identity.sourceFile ?? '',
      annotatorId: identity.annotatorId ?? '',
      batch: identity.batch ?? '',
      document,
    };
    try {
      storage.setItem(ANNOTATION_RECOVERY_STORAGE_KEY, JSON.stringify(envelope));
      return true;
    } catch {
      return false;
    }
  }

  /** Return the last well-formed snapshot, or null when none is available. */
  load(): AnnotationRecoveryEnvelope | null {
    const storage = this.storage();
    if (!storage) return null;
    try {
      const raw = storage.getItem(ANNOTATION_RECOVERY_STORAGE_KEY);
      if (!raw) return null;
      const parsed: unknown = JSON.parse(raw);
      if (!this.isEnvelope(parsed)) {
        storage.removeItem(ANNOTATION_RECOVERY_STORAGE_KEY);
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  }

  clear(): boolean {
    const storage = this.storage();
    if (!storage) return false;
    try {
      storage.removeItem(ANNOTATION_RECOVERY_STORAGE_KEY);
      return true;
    } catch {
      return false;
    }
  }

  available(): boolean {
    return this.storage() !== null;
  }

  private storage(): Storage | null {
    if (typeof window === 'undefined') return null;
    try {
      const storage = window.localStorage;
      // Accessing localStorage is not enough in browsers that disable writes;
      // a small probe avoids presenting a false recovery guarantee.
      const probe = `${ANNOTATION_RECOVERY_STORAGE_KEY}.probe`;
      storage.setItem(probe, '1');
      storage.removeItem(probe);
      return storage;
    } catch {
      return null;
    }
  }

  private isEnvelope(value: unknown): value is AnnotationRecoveryEnvelope {
    if (!value || typeof value !== 'object') return false;
    const candidate = value as Partial<AnnotationRecoveryEnvelope>;
    return (
      candidate.version === ANNOTATION_RECOVERY_VERSION &&
      typeof candidate.savedAt === 'string' &&
      typeof candidate.sourceFile === 'string' &&
      typeof candidate.annotatorId === 'string' &&
      typeof candidate.batch === 'string' &&
      candidate.document !== null &&
      typeof candidate.document === 'object'
    );
  }
}
