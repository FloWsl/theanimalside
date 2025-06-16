// 🧪 Test Setup Configuration
// Global setup for database integration tests

import { beforeAll, afterAll, vi } from 'vitest';

// Mock environment variables for testing
beforeAll(() => {
  // Set up test environment variables
  vi.stubEnv('VITE_SUPABASE_URL', process.env.VITE_SUPABASE_URL || 'https://test.supabase.co');
  vi.stubEnv('VITE_SUPABASE_ANON_KEY', process.env.VITE_SUPABASE_ANON_KEY || 'test-anon-key');
  vi.stubEnv('NODE_ENV', 'test');

  // Mock performance API if not available
  if (typeof global.performance === 'undefined') {
    global.performance = {
      now: () => Date.now(),
      mark: vi.fn(),
      measure: vi.fn(),
      getEntriesByName: vi.fn(),
      getEntriesByType: vi.fn(),
      clearMarks: vi.fn(),
      clearMeasures: vi.fn(),
    } as any;
  }

  // Mock console methods to reduce test noise
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'info').mockImplementation(() => {});
  
  // Keep error and warn for debugging
  vi.spyOn(console, 'error').mockImplementation((message, ...args) => {
    // Only show actual errors, not expected test errors
    if (!message?.includes?.('Test error') && !message?.includes?.('Expected')) {
      console.error(message, ...args);
    }
  });
});

afterAll(() => {
  // Clean up mocks
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});