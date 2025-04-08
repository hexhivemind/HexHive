import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

global.$fetch = vi.fn(() =>
  Promise.resolve([{ _id: 'mock', title: 'Test Script' }]),
) as unknown as typeof $fetch;

vi.mock('~/composables/useListingStore', async () => {
  const actual = await vi.importActual('~/composables/useListingStore');

  return actual;
});

describe('Scripts Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('initializes correctly', () => {
    const store = useScriptsStore();
    expect(store).toBeDefined();
    expect(store.data).toBeDefined();
    expect(Array.isArray(store.data)).toBe(true);
  });

  it('fetches data correctly', async () => {
    const store = useScriptsStore();
    await store.fetchData(true);

    expect(store.data.length).toBe(1);
    expect(store.data).toEqual([{ _id: 'mock', title: 'Test Script' }]);
  });
});
