import { describe, expect, it, beforeEach, vi } from 'vitest';
import {
  ANNOTATION_RECOVERY_STORAGE_KEY,
  AnnotationRecoveryService,
} from './annotation-recovery.service';

describe('AnnotationRecoveryService', () => {
  let service: AnnotationRecoveryService;

  beforeEach(() => {
    service = new AnnotationRecoveryService();
    window.localStorage.clear();
  });

  it('round-trips a versioned recovery envelope locally', () => {
    const saved = service.save(
      { cases: [{ id: 'SYN-001', text: 'Texto sintético.' }] },
      { sourceFile: 'CAL3_A048.json', annotatorId: 'A048', batch: 'CAL3' },
      '2026-08-27T10:00:00.000Z',
    );

    expect(saved).toBe(true);
    expect(service.load()).toEqual({
      version: 1,
      savedAt: '2026-08-27T10:00:00.000Z',
      sourceFile: 'CAL3_A048.json',
      annotatorId: 'A048',
      batch: 'CAL3',
      document: { cases: [{ id: 'SYN-001', text: 'Texto sintético.' }] },
    });
  });

  it('removes malformed envelopes instead of returning untrusted data', () => {
    window.localStorage.setItem(
      ANNOTATION_RECOVERY_STORAGE_KEY,
      JSON.stringify({ version: 1, savedAt: 'now', document: null }),
    );

    expect(service.load()).toBeNull();
    expect(window.localStorage.getItem(ANNOTATION_RECOVERY_STORAGE_KEY)).toBeNull();
  });

  it('clears a previous recovery snapshot explicitly', () => {
    service.save({}, { sourceFile: '', annotatorId: '', batch: '' });
    expect(service.clear()).toBe(true);
    expect(service.load()).toBeNull();
  });

  it('fails closed when browser storage is unavailable', () => {
    const original = Object.getOwnPropertyDescriptor(window, 'localStorage');
    vi.spyOn(window, 'localStorage', 'get').mockImplementation(() => {
      throw new Error('blocked');
    });

    expect(service.available()).toBe(false);
    expect(service.save({}, { sourceFile: '', annotatorId: '', batch: '' })).toBe(false);
    expect(service.load()).toBeNull();

    vi.restoreAllMocks();
    if (original) Object.defineProperty(window, 'localStorage', original);
  });
});
