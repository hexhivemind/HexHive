import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

global.$fetch = vi.fn(() =>
  Promise.resolve([{ _id: 'mock', title: 'Test Sound' }]),
) as unknown as typeof $fetch;

vi.mock('~/composables/useListingStore', async () => {
  const actual = await vi.importActual('~/composables/useListingStore');

  return actual;
});

describe('Sounds Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('initializes correctly', () => {
    const store = useSoundsStore();
    expect(store).toBeDefined();
    expect(store.data).toBeDefined();
    expect(Array.isArray(store.data)).toBe(true);
  });

  it('fetches data correctly', async () => {
    const store = useSoundsStore();
    await store.fetchData(true);

    expect(store.data.length).toBe(1);
    expect(store.data).toEqual([{ _id: 'mock', title: 'Test Sound' }]);
  });
});
