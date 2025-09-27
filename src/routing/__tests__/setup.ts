/**
 * Setup file specifically for routing tests
 * Mocks Supabase and other external dependencies
 */

import { vi, beforeAll, beforeEach } from 'vitest';

// Mock Supabase completely for routing tests
vi.mock('../../services/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => Promise.resolve({ data: [], error: null })),
      insert: vi.fn(() => Promise.resolve({ data: [], error: null })),
      update: vi.fn(() => Promise.resolve({ data: [], error: null })),
      delete: vi.fn(() => Promise.resolve({ data: [], error: null }))
    })),
    auth: {
      getUser: vi.fn(() => Promise.resolve({ data: { user: null }, error: null }))
    }
  }
}));

// Mock environment variables for routing tests
beforeAll(() => {
  vi.stubEnv('VITE_SUPABASE_URL', 'https://test-routing.supabase.co');
  vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'test-routing-anon-key');
  vi.stubEnv('NODE_ENV', 'test');
});

// Setup performance API for routing performance tests
beforeEach(() => {
  if (typeof global.performance === 'undefined') {
    global.performance = {
      now: vi.fn(() => Date.now()),
      mark: vi.fn(),
      measure: vi.fn(),
      getEntriesByName: vi.fn(() => []),
      getEntriesByType: vi.fn(() => []),
      clearMarks: vi.fn(),
      clearMeasures: vi.fn(),
      timeOrigin: Date.now(),
      timing: {} as PerformanceTiming,
      navigation: {} as PerformanceNavigation,
      onresourcetimingbufferfull: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
      getEntries: vi.fn(() => []),
      clearResourceTimings: vi.fn(),
      setResourceTimingBufferSize: vi.fn(),
      toJSON: vi.fn(() => ({}))
    } as any;
  }
});