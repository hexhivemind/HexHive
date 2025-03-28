type Stream = ReturnType<typeof createEventStream>;

const activeStreams = new Set<Stream>();

export function registerStream(stream: Stream) {
  activeStreams.add(stream);

  stream.onClosed(async () => {
    activeStreams.delete(stream);
    await stream.close();
  });
}

export async function broadcastSSE(eventName: string, payload: unknown) {
  const message = JSON.stringify({ event: eventName, payload });

  for (const stream of activeStreams) {
    try {
      await stream.push(message);
    } catch {
      // Fail quietly and let cleanup happen onClosed.
    }
  }
}
