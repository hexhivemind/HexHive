import { createPinia, setActivePinia } from 'pinia';
import { describe, expect, it } from 'vitest';

describe('test store', () => {
  it('can be instantiated', () => {
    setActivePinia(createPinia());
    const store = useTestStore();
    expect(store).toBeDefined();
  });
});
