import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it } from 'vitest';

describe('Settings Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('can be instantiated', () => {
    const store = useSettingsStore();
    expect(store).toBeDefined();
  });

  it('can set update mode', () => {
    const store = useSettingsStore();
    expect(store.updateMode).toBeDefined();
    expect(store.updateMode).toEqual('notify');
    store.setUpdateMode('auto');
    expect(store.updateMode).toEqual('auto');
  });
});
