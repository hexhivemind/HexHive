export const useRomhacksStore = defineStore('romhacks', () => {
  const data = ref<RomhackData[]>([]);
  const lastFetched = ref(0);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const refresh_window = 60_000; // 60 seconds.

  const isStale = computed(
    () => Date.now() - lastFetched.value > refresh_window,
  );

  async function fetchData(force = false) {
    if (data.value.length > 0 && !force && !isStale.value) return;

    loading.value = true;
    error.value = null;

    try {
      const entries: RomhackData[] = await $fetch('/api/romhacks');
      data.value = entries;
      lastFetched.value = Date.now();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      error.value = err.message || 'Failed to load data';
    } finally {
      loading.value = false;
    }
  }

  function refreshData() {
    return fetchData(true);
  }

  return {
    data,
    loading,
    error,
    isStale,
    refresh_window,
    fetchData,
    refreshData,
  };
});
