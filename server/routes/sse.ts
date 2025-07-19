import { registerStream } from '~~/server/utils/sse';

export default defineEventHandler(async (event) => {
  const stream = createEventStream(event);

  registerStream(stream);

  return stream.send();
});
