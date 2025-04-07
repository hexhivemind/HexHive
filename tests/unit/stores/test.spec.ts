import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it } from 'vitest';

describe('test store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('can be instantiated', () => {
    const store = useTestStore();
    expect(store).toBeDefined();
  });
});
