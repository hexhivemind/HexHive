export const useScriptsStore = defineStore('scripts', () => {
  const listingStore = createListingStore({
    namespace: 'script',
    fetchUrl: '/api/scripts',
    routeName: 'Scripts',
  });

  return {
    ...listingStore,
  };
});
