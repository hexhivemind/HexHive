import { describe, it, expect, vi } from 'vitest';

vi.mock('#app/composables/router', () => ({
  useRoute: () => ({
    path: '/test/path/with/multiple/segments',
  }),
  useRouter: () => ({
    getRoutes: () => [{ path: '/test', name: 'Test' }],
  }),
}));

describe('useBreadcrumbs', () => {
  it('builds breadcrumbs correctly', () => {
    const { breadcrumbs } = useBreadcrumbs();

    expect(breadcrumbs.value).toEqual([
      { title: 'Test', to: '/test' },
      { title: 'path', to: '/test/path' },
      { title: 'with', to: '/test/path/with' },
      { title: 'multiple', to: '/test/path/with/multiple' },
      { title: 'segments', to: '/test/path/with/multiple/segments' },
    ]);
  });
});
