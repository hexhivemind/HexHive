import { describe, it, beforeEach, expect, vi, afterEach } from 'vitest';

let messageCallback: ((e: MessageEvent) => void) | null = null;
let errorCallback: ((e: Event) => void) | null = null;
const closeMock = vi.fn();

global.EventSource = vi.fn(() => ({
  close: closeMock,
  set onmessage(cb: ((e: MessageEvent) => void) | null) {
    messageCallback = cb;
  },
  set onerror(cb: ((e: Event) => void) | null) {
    errorCallback = cb;
  },
})) as unknown as typeof EventSource;

describe('useSse composable', () => {
  // @ts-expect-error type should not error out, but it does
  let timeoutSpy: ReturnType<typeof vi.spyOn<typeof global, 'setTimeout'>>;
  let connectSpy: ReturnType<typeof vi.spyOn<typeof global, 'EventSource'>>;
  // @ts-expect-error type should not error out, but it does
  let errorSpy: ReturnType<typeof vi.spyOn<typeof console, 'error'>>;
  // @ts-expect-error type should not error out, but it does
  let warnSpy: ReturnType<typeof vi.spyOn<typeof console, 'warn'>>;
  let useSse: typeof import('~/composables/sse').useSse;

  // Clear internal registry state by reloading the module
  beforeEach(async () => {
    vi.useFakeTimers();
    timeoutSpy = vi.spyOn(global, 'setTimeout');
    connectSpy = vi.spyOn(global, 'EventSource');
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.resetModules();

    const module = await import('~/composables/sse');
    useSse = module.useSse;
  });

  afterEach(() => {
    vi.useRealTimers();
    timeoutSpy.mockRestore();
    connectSpy.mockRestore();
    errorSpy.mockRestore();
    warnSpy.mockRestore();
  });

  it('initializes with default isConnected value', async () => {
    const { isConnected } = useSse('test');
    expect(isConnected.value).toBe(false);
  });

  it('can subribe to an event without error', async () => {
    const { subscribe, isConnected } = useSse('test');

    const cb = vi.fn();
    expect(() => subscribe('added', cb)).not.toThrow();
    expect(isConnected.value).toBe(true);
  });

  it('can unsubscribe from a store key', async () => {
    const { subscribe, unsubscribe, isConnected } = useSse('test');

    const cb = vi.fn();
    subscribe('added', cb);
    expect(isConnected.value).toBe(true);

    expect(() => unsubscribe()).not.toThrow();
  });

  it('can call subscribe multiple times for different keys/events', async () => {
    const { subscribe: sub1 } = useSse('test1');
    const { subscribe: sub2 } = useSse('test2');

    expect(() => sub1('eventA', vi.fn())).not.toThrow();
    expect(() => sub1('eventB', vi.fn())).not.toThrow();
    expect(() => sub2('eventC', vi.fn())).not.toThrow();
  });

  it('dispatches SSE message to the correct callback', () => {
    const payload = { _id: '123', title: 'Event Payload' };
    const cb = vi.fn();

    const { subscribe } = useSse('test');
    subscribe('added', cb);

    messageCallback?.({
      data: JSON.stringify({ event: 'test:added', payload }),
    } as MessageEvent);

    expect(cb).toHaveBeenCalledWith(payload);
  });

  it('handles invalid JSON in SSE message gracefully', () => {
    messageCallback?.({ data: 'INVALID_JSON' } as MessageEvent);
    expect(errorSpy).toHaveBeenCalledWith(
      '[SSE] Failed to parse message',
      expect.any(Error),
    );
  });

  it('logs error if event is missing namespace', () => {
    messageCallback?.({
      data: JSON.stringify({ event: 'invalidEvent', payload: {} }),
    } as MessageEvent);

    expect(errorSpy).toHaveBeenCalledWith(
      '[SSE] Invalid event format:',
      'invalidEvent',
    );
  });

  it('logs warning if no matching callback is found', () => {
    const { subscribe } = useSse('test');
    subscribe('added', vi.fn());

    messageCallback?.({
      data: JSON.stringify({ event: 'test:unknownEvent', paylod: {} }),
    } as MessageEvent);

    expect(warnSpy).toHaveBeenCalledWith(
      '[SSE] No callback found for event: test:unknownEvent',
    );
  });

  it('handles EventSource error and schedules a reconnect', () => {
    vi.useFakeTimers();

    const { subscribe } = useSse('test');
    subscribe('added', vi.fn());

    errorCallback?.({} as Event);

    expect(closeMock).toHaveBeenCalled();
    expect(timeoutSpy).toHaveBeenCalledWith(expect.any(Function), 2000);
  });

  it('does not schedule reconnect if already scheduled', () => {
    const { subscribe } = useSse('test');
    subscribe('added', vi.fn());

    errorCallback?.({} as Event);
    errorCallback?.({} as Event); // Call again to simulate multiple errors

    expect(timeoutSpy).toHaveBeenCalledTimes(1); // Should only be called once
  });

  it('reconnects after a delay', () => {
    const { subscribe } = useSse('test');
    subscribe('added', vi.fn());

    errorCallback?.({} as Event);
    vi.runOnlyPendingTimers(); // Fast-forward time to trigger reconnect

    expect(connectSpy).toHaveBeenCalledTimes(2); // Initial + reconnect
  });
});
