import Users from '~/server/models/User';

export default defineEventHandler(async () => {
  // TODO: Implement pagination, search, and sort.
  const users = await Users.find({})
    .select('-credentials -password -oauth')
    .lean<User[]>()
    .exec();

  return users;
});
