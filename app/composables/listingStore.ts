interface ListingStoreOptions {
  namespace: string; // e.g. 'romhacks'
  fetchUrl: string; // e.g. '/api/romhacks'
  refreshWindow?: number; // default: 60_000 (60s)
  routeName: string; // used to match current route (e.g. Romhacks)
}

export function createListingStore<T extends ListingData>(
  options: ListingStoreOptions,
) {
  const route = useRoute();
  const settings = useSettingsStore();
  // const { setUpdateMode } = settings;
  const { updateMode } = storeToRefs(settings);
  const { subscribe, unsubscribe } = useSse(options.namespace);

  const data: Ref<ListEntry<T>[]> = ref([]);
  const queued: Ref<ListEntry<T>[]> = ref([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const lastFetched = ref(0);
  const refreshWindow = options.refreshWindow ?? 60_000;

  const isStale = computed(
    () => Date.now() - lastFetched.value > refreshWindow,
  );

  let interval: ReturnType<typeof setInterval> | null = null;

  async function fetchData(force = false) {
    if (data.value.length > 0 && !force && !isStale.value) return;

    loading.value = true;
    error.value = null;

    try {
      const response: ListEntry<T>[] = await $fetch(options.fetchUrl);
      data.value = response;
      lastFetched.value = Date.now();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch data';
    } finally {
      loading.value = false;
    }
  }

  function refreshData() {
    return fetchData(true);
  }

  function mergeQueued() {
    data.value.unshift(...queued.value);
    queued.value = [];
  }

  function startAutoRefresh() {
    if (interval || updateMode.value !== 'auto') return;

    interval = setInterval(() => {
      // Only fetch on the romhacks listing.
      if (route.name === options.routeName) refreshData();
    }, refreshWindow);
  }

  function stopAutoRefresh() {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
  }

  function initLiveUpdates() {
    if (updateMode.value === 'auto' && route.name === options.routeName) {
      startAutoRefresh();
    }

    if (updateMode.value !== 'manual') {
      subscribe(`added`, ((payload: T) => {
        lastFetched.value = Date.now();

        if (updateMode.value === 'notify') {
          queued.value.unshift(payload);
        } else if (
          updateMode.value === 'auto' &&
          route.name === options.routeName
        ) {
          data.value.unshift(payload);
        }
      }) as SseCallback<T>);

      subscribe(`deleted`, ((payload: DeletedEntry) => {
        lastFetched.value = Date.now();

        if (updateMode.value === 'manual') return;

        const index = data.value.findIndex((item) => item._id === payload._id);
        if (index !== -1) {
          data.value.splice(index, 1, payload);
        }

        queued.value = queued.value.filter((item) => item._id !== payload._id);
      }) as SseCallback<T>);

      subscribe(`updated`, ((_payload: T) => {
        // TODO: Also accept this event on /route/:id
        if (updateMode.value !== 'manual' && route.name === options.routeName) {
          // Update payload.
        }
      }) as SseCallback<T>);
    }
  }

  function stopLiveUpdates() {
    unsubscribe();

    stopAutoRefresh();
  }

  return {
    data,
    queued,
    loading,
    error,
    isStale,
    refreshWindow,
    lastFetched,

    fetchData,
    refreshData,
    mergeQueued,
    startAutoRefresh,
    stopAutoRefresh,
    initLiveUpdates,
    stopLiveUpdates,
    unsubscribe,
  };
}
