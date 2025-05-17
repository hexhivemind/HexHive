import Users from '~/server/models/User';

export default defineNitroPlugin(async () => {
  await connectMongoose();

  // Only seed if no admin user exists at all
  const adminCount = await Users.countDocuments({ role: 'admin' });

  if (adminCount > 0) {
    // eslint-disable-next-line no-console
    console.log('[seed] Admin users already exist. Skipping seed.');
  }

  const rawSeed = process.env.SEED_ADMINS || '';

  const admins = rawSeed
    .split(',')
    .map((entry) => {
      const [username, email] = entry.split(':');
      return username && email
        ? {
            username: username.trim(),
            email: email.trim(),
            role: 'admin',
          }
        : null;
    })
    .filter(Boolean);

  if (admins.length > 0) {
    await Users.insertMany(admins);
    // eslint-disable-next-line no-console
    console.log(`[seed] Created ${admins.length} admin user(s).`);
    // eslint-disable-next-line no-console
  } else console.log('[seed] No valid admin users found in SEED_ADMINS.');
});
