export const useSpritesStore = defineStore('sprites', () => {
  const listingStore = createListingStore({
    namespace: 'sprite',
    fetchUrl: '/api/sprites',
    routeName: 'Sprites',
  });

  return {
    ...listingStore,
  };
});
