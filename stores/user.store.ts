export const useUserStore = defineStore('user', () => {
  const user = ref({} as User);

  return { user };
});
