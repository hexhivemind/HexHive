export const useUserStore = defineStore('user', () => {
  // Dummy data for testing/building profile page
  const user = ref({
    displayName: 'HexHive User',
    joinDate: new Date(),
    lastActiveDate: new Date(),
    pronouns: 'They/Them',
    role: 'admin',
    socials: {
      'Discord User': 'TestDiscordUser',
      'Discord Server': 'TestDiscordServer',
      Github: 'TestGithub',
      PokeCommunity: 'TestPokecommunity',
      Twitter: 'TestTwitter',
    },
    username: 'Test',
    //
    avatar: '',
    email: '',
    permissions: { canManageFlags: false },
  } as User);

  const fetchOne = async (id: string) => {
    return await useFetch<User>(`/api/profile/${id}`, {
      method: 'GET',
    });
  };

  const fetchAll = async () => {
    return await useFetch<User[]>('/api/profile', {
      method: 'GET',
    });
  };

  return { user, fetchOne, fetchAll };
});
