export const useUserStore = defineStore('user', () => {
  const user = ref({
    displayName: 'HexHive User',
    joinDate: new Date(),
    lastActiveDate: new Date(),
    pronouns: 'They/Them',
    role: 'admin',
    socials: {
      discordUser: 'TestDiscordUser',
      discordServer: 'TestDiscordServer',
      github: 'TestGithub',
      pokecommunity: 'TestPokecommunity',
      twitter: 'TestTwitter',
    },
    username: 'Test',
    //
    avatar: '',
    email: '',
    permissions: { canManageFlags: false },
  } as unknown as User);

  return { user };
});
