import { beforeEach, describe, expect, it } from 'vitest';
// import { setup } from '@nuxt/test-utils';
import { setup, $fetch } from '@nuxt/test-utils';
import { createPinia, setActivePinia } from 'pinia';

// vi.mock('#app', async () => {
//   return {
//     useFetch: async (url: string, options: never) => {
//       try {
//         return {
//           data: { value: await $fetch(url, options) },
//           error: { value: null },
//         };
//       } catch (err) {
//         return {
//           data: { value: null },
//           error: { value: err },
//         };
//       }
//     },
//   };
// });

// global.useFetch = vi.fn((url: string, options: never) => {
//   try {
//     return {
//       data: { value: $fetch(url, options) },
//       error: { value: null },
//     };
//   }
//   catch (err) {
//     return {
//       data: { value: null },
//       error: { value: err },
//     };
//   }
// }) as unknown as typeof useFetch;

globalThis.$fetch = $fetch;

await setup({
  server: true,
  browser: false,
  setupTimeout: 600_000,
  dev: true,
});

describe('User Store Integration Test', async () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  // it('test fetch', async () => {
  //   const test = await $fetch('/api/profile', { method: 'GET' });
  //   console.log(test);
  // });

  it('should fetch all users', async () => {
    const store = useUserStore();
    const { data, error } = await store.fetchAll();

    expect(data.value).toBeDefined();
    expect(data.value).toBeInstanceOf(Array);
    expect(data.value!.length).toBeGreaterThan(0);
    expect(error.value).toBeNull();
    expect(data.value![0]).toHaveProperty('username');
    expect(data.value![0]).toHaveProperty('email');
    expect(data.value![0]).toHaveProperty('role');
    expect(data.value![0].username).toBe('TestUser');
    expect(data.value![0].email).toBe('test@example.com');
    expect(data.value![0].role).toBe('admin');
  });

  it('should fetch a single user', async () => {
    const store = useUserStore();
    const { data, error } = await store.fetchOne('TestUser');

    expect(data.value).toBeDefined();
    expect(data.value).toHaveProperty('username');
    expect(data.value).toHaveProperty('email');
    expect(data.value).toHaveProperty('role');
    expect(error.value).toBeNull();
    expect(data.value!.username).toBe('TestUser');
    expect(data.value!.email).toBe('test@example.com');
    expect(data.value!.role).toBe('admin');
  });

  it('should handle errors when fetching a user', async () => {
    const store = useUserStore();

    const { data, error } = await store.fetchOne('NonExistentUser');

    expect(data.value).toBeNull();
    expect(error.value).toBeDefined();
    expect(error.value).toHaveProperty('message');
    expect(error.value!.data.message).toBe('User not found');
    expect(error.value!.statusCode).toBe(404);
    expect(error.value!.statusMessage).toBe('Not Found');
  });
}, 900_000);
