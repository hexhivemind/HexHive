// Registry: Map<storeKey, Map<eventName, callback>>
const registry = new Map<string, Map<string, SseCallback<ListingData>>>();

const isConnected = ref(false);
let source: EventSource | null = null;
let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
const reconnectDelay = 2_000; // Milliseconds, 2s, simple exponential backoff could be added later.

function connect() {
  if (isConnected.value || typeof window === 'undefined') return;

  source = new EventSource('/sse');
  isConnected.value = true;

  source.onmessage = (rawEvent) => {
    try {
      const { event, payload } = JSON.parse(rawEvent.data);

      const [namespace, evt] = event.includes(':')
        ? event.split(':')
        : [null, null];

      if (!namespace || !evt) {
        console.error('[SSE] Invalid event format:', event);
        return;
      }

      const cb = registry.get(namespace)?.get(evt);
      if (cb) cb(payload);
      else console.warn(`[SSE] No callback found for event: ${event}`);
    } catch (err) {
      console.error('[SSE] Failed to parse message', err);
    }
  };

  source.onerror = (err) => {
    console.error('[SSE] Connection error:', err);
    cleanup();
    attemptReconnect();
  };
}

function cleanup() {
  if (source) {
    source.close();
    source = null;
  }
  isConnected.value = false;
}

function attemptReconnect() {
  if (reconnectTimeout) return;

  reconnectTimeout = setTimeout(() => {
    reconnectTimeout = null;
    connect();
  }, reconnectDelay);
}

function internalSubscribe<T extends ListingData>(
  storeKey: string,
  event: string,
  cb: SseCallback<T>,
) {
  connect();

  if (!registry.has(storeKey)) registry.set(storeKey, new Map());

  // T is constrained to ListingData, but for some reason
  // Typescript thinks it can be anything. I hate this.
  registry.get(storeKey)!.set(event, cb as never);
}

function internalUnsubscribe(storeKey: string) {
  registry.delete(storeKey);
}

export function useSse(storeKey: string) {
  function subscribe<T extends ListingData = ListingData>(
    event: string,
    cb: SseCallback<T>,
  ) {
    internalSubscribe(storeKey, event, cb);
  }

  function unsubscribe() {
    internalUnsubscribe(storeKey);
  }

  return {
    subscribe,
    unsubscribe,
    isConnected, // Optional to use in UI
  };
}
