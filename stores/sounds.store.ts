export const useSoundsStore = defineStore('sounds', () => {
  const listingStore = createListingStore({
    namespace: 'sound',
    fetchUrl: '/api/sounds',
    routeName: 'Sounds',
  });

  return {
    ...listingStore,
  };
});
