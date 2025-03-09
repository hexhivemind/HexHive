export const useTestStore = defineStore('test', () => {});

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useTestStore, import.meta.hot));
