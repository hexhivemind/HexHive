export const useRomhacksStore = defineStore('romhacks', () => {
  const listingStore = createListingStore({
    namespace: 'romhack',
    fetchUrl: '/api/romhacks',
    routeName: 'Romhacks',
  });

  return {
    ...listingStore,
  };
});
