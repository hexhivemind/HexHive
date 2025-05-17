export const useUserStore = defineStore('user', () => {
  const user = ref({
    displayName: 'HexHive User',
    joinDate: new Date(),
    lastActiveDate: new Date(),
    pronouns: 'They/Them',
    role: 'user',
    socials: { discord: 'TestProfile', twitter: 'TestProfile' },
    username: 'Test',
    //
    avatar: '',
    email: '',
    permissions: { canManageFlags: false },
  } as unknown as User);

  return { user };
});
