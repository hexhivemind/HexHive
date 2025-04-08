import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

const mockSubscribe = vi.fn();
const mockUnsubscribe = vi.fn();
vi.mock('~/composables/sse', () => ({
  useSse: () => ({
    subscribe: mockSubscribe,
    unsubscribe: mockUnsubscribe,
  }),
}));

global.$fetch = vi.fn(() =>
  Promise.resolve([{ _id: 'mock', title: 'Test Script' }]),
) as unknown as typeof $fetch;

vi.mock('#app/composables/router', () => ({
  useRoute: () => ({
    name: 'TestRoute',
  }),
}));

describe('Listing Store Composable', () => {
  beforeEach(async () => {
    setActivePinia(createPinia());
    useSettingsStore().setUpdateMode('notify');

    vi.resetAllMocks();
    vi.useFakeTimers();

    mockSubscribe.mockReset();
    mockUnsubscribe.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  const options = {
    namespace: 'test',
    fetchUrl: '/api/test',
    routeName: 'TestRoute',
  };

  it('initializes with default values', () => {
    const store = createListingStore(options);
    expect(store).toBeDefined();
    expect(store.data).toBeDefined();
    expect(store.data.value).toEqual([]);
    expect(store.queued).toBeDefined();
    expect(store.queued.value).toEqual([]);
    expect(store.loading).toBeDefined();
    expect(store.loading.value).toBe(false);
    expect(store.error).toBeDefined();
    expect(store.error.value).toBe(null);
    expect(store.lastFetched).toBeDefined();
    expect(store.lastFetched.value).toBe(0);
    expect(store.refreshWindow).toBeDefined();
    expect(store.refreshWindow).toBe(60_000);
    expect(store.isStale).toBeDefined();
    expect(store.isStale.value).toBe(true);
  });

  it('fetches data and updates state', async () => {
    const store = createListingStore(options);
    await store.fetchData(true);

    expect(store.data.value.length).toBe(1);
    expect(store.loading.value).toBe(false);
    expect(store.error.value).toBe(null);
    expect(store.lastFetched.value).toBeGreaterThan(0);
  });

  it('prevents redudant fetches if not stale', async () => {
    const store = createListingStore(options);
    await store.fetchData(true); // First fetch to set data

    const lastFetched = store.lastFetched.value;
    await store.fetchData(); // Attempt to fetch again without force
    expect(store.lastFetched.value).toBe(lastFetched); // Should not update lastFetched
  });

  it('handles fetch errors', async () => {
    vi.mocked($fetch).mockRejectedValueOnce(new Error());
    const store = createListingStore(options);
    await store.fetchData(true); // Force fetch
    expect(store.error.value).toBe('Failed to fetch data');
  });

  it('can refresh forcibly', async () => {
    const store = createListingStore(options);
    await store.refreshData(); // Force refresh
    expect(store.data.value.length).toBeGreaterThan(0);
  });

  it('merges queued items into data', () => {
    const store = createListingStore(options);
    store.data.value = [{ _id: '1', title: 'Original' } as never];
    store.queued.value = [{ _id: '2', title: 'Queued' } as never];
    store.mergeQueued(); // Merge queued items
    expect(store.data.value.length).toBe(2);
    expect(store.queued.value).toEqual([]); // Queued should be empty after merge
  });

  it('starts and stops auto-refresh correctly', () => {
    const settings = useSettingsStore();
    settings.setUpdateMode('manual'); // Set update mode to auto

    const store = createListingStore(options);
    const setIntervalSpy = vi.spyOn(global, 'setInterval');
    const clearIntervalSpy = vi.spyOn(global, 'clearInterval');

    store.startAutoRefresh(); // Initialize live updates

    expect(setIntervalSpy).not.toHaveBeenCalled(); // Ensure setInterval was not called
    settings.setUpdateMode('auto'); // Set update mode to auto

    store.startAutoRefresh(); // Start auto-refresh

    expect(setIntervalSpy).toHaveBeenCalled();

    vi.runOnlyPendingTimers(); // Run pending timers

    store.stopAutoRefresh(); // Stop auto-refresh
    expect(clearIntervalSpy).toHaveBeenCalled();
  });

  it('subscribes and unsubscribes to SSE events', () => {
    const store = createListingStore(options);

    store.initLiveUpdates(); // Initialize live updates
    store.stopLiveUpdates(); // Stop live updates
    expect(mockUnsubscribe).toHaveBeenCalled(); // Ensure unsubscribe was called
  });

  it('handles SSE "added" event', () => {
    const store = createListingStore(options);

    store.initLiveUpdates(); // Initialize live updates

    const callback = mockSubscribe.mock.calls.find(
      ([event]) => event === 'added',
    )?.[1];

    if (callback) {
      callback({ _id: 'auto-item' }); // Simulate SSE event
      expect(store.queued.value[0]._id).toBe('auto-item'); // Check if data was updated
    } else {
      throw new Error('Missing "added" subscription');
    }
  });

  it('handles SSE "added" event with auto-refresh', () => {
    useSettingsStore().setUpdateMode('auto'); // Set update mode to auto

    const store = createListingStore(options);

    store.initLiveUpdates(); // Initialize live updates

    const callback = mockSubscribe.mock.calls.find(
      ([event]) => event === 'added',
    )?.[1];

    if (callback) {
      callback({ _id: 'auto-item' }); // Simulate SSE event
      expect(store.data.value[0]._id).toBe('auto-item'); // Check if data was updated
    } else {
      throw new Error('Missing "added" subscription');
    }
  });

  it('ignores SSE "deleted" event in manual mode', () => {
    const settings = useSettingsStore();
    const store = createListingStore(options);

    store.data.value = [{ _id: '1', title: 'Existing' } as never];
    store.queued.value = [{ _id: '1', title: 'Queued' } as never];

    store.initLiveUpdates(); // Initialize live updates

    const callback = mockSubscribe.mock.calls.find(
      ([event]) => event === 'deleted',
    )?.[1];

    settings.setUpdateMode('manual'); // Set update mode to manual
    callback?.({ _id: '1' }); // Simulate SSE event

    expect(store.data.value.length).toBe(1); // Ensure data is unchanged
    expect(store.queued.value.length).toBe(1); // Ensure queued is unchanged
  });

  it('handles SSE "deleted" event', () => {
    useSettingsStore().setUpdateMode('auto'); // Set update mode to auto
    const store = createListingStore(options);

    store.data.value = [
      { _id: '1', title: 'Keep' } as never,
      { _id: '2', title: 'Delete' } as never,
    ];
    store.queued.value = [{ _id: '2', title: 'Also delete' } as never];

    store.initLiveUpdates(); // Initialize live updates

    const callback = mockSubscribe.mock.calls.find(
      ([event]) => event === 'deleted',
    )?.[1];

    callback?.({ _id: '2' }); // Simulate SSE event

    // Should replace the item in data and remove it from queued
    expect(store.data.value.find((d) => d._id === '2')).toBeTruthy(); // Ensure item replaced in data
    expect(store.data.value.find((d) => d._id === '2')).not.toHaveProperty(
      'title',
    ); // Ensure item is DeletedEntry instead of ListingData
    expect(store.queued.value.some((q) => q._id === '2')).toBe(false); // Ensure queued item is deleted
  });

  it('handles SSE "updated" event', () => {
    useSettingsStore().setUpdateMode('auto'); // Set update mode to auto
    const store = createListingStore(options);

    store.initLiveUpdates(); // Initialize live updates

    const callback = mockSubscribe.mock.calls.find(
      ([event]) => event === 'updated',
    )?.[1];
    expect(callback).toBeDefined(); // Ensure callback is defined

    callback?.({ _id: '1', title: 'Updated' } as never); // Simulate SSE event
  });
});
