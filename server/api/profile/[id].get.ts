import Users from '~~/server/models/User';
import { Types } from 'mongoose';

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;
  if (!id)
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Username or ID is required',
    });

  const user = await (
    Types.ObjectId.isValid(id)
      ? Users.findById(id)
      : Users.findOne({ username: id })
  )
    .select('-credentials -password -oauth')
    .lean<User>()
    .exec();

  if (!user)
    throw createError({
      statusCode: 404,
      statusMessage: 'Not Found',
      message: 'User not found',
    });

  return user;
});
