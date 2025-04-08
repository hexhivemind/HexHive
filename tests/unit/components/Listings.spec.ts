import { mount, type MountingOptions } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Listings from '@/components/Listings.vue';
import { createVuetify } from 'vuetify';
import type { Slot } from 'vue';

const vuetify = createVuetify();

vi.mock('#app/composables/router', () => ({
  useRoute: () => ({
    path: '/test/path/with/multiple/segments',
    matched: [
      { path: '/test' },
      { path: '/test/path' },
      { path: '/test/path/with' },
      { path: '/test/path/with/multiple' },
      { path: '/test/path/with/multiple/segments' },
    ],
  }),
  useRouter: () => ({
    getRoutes: () => [],
  }),
}));

describe('Listings.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mountComponent = (
    props: Partial<
      MountingOptions<InstanceType<typeof Listings>>['props']
    > = {},
    slots: Record<string, Slot> = {},
  ) =>
    mount(Listings, {
      global: { plugins: [vuetify] },
      props,
      slots,
    });

  it('renders the title from useState', () => {
    // Set the state before mounting
    const title = useState('title', () => 'Test Title');

    const wrapper = mountComponent(
      {},
      { title: () => [title.value as unknown as VNode] },
    );

    const titleElement = wrapper.find('h1.text-h3');

    expect(titleElement.exists()).toBe(true);
    expect(titleElement.text()).toBe(title.value);
  });

  it('displays breadcrumbs based on the route', async () => {
    const wrapper = mountComponent();

    const breadcrumbs = wrapper.findComponent({ name: 'v-breadcrumbs' });
    expect(breadcrumbs.exists()).toBe(true);
  });

  it('displays a search input field', () => {
    const wrapper = mountComponent();
    const searchInput = wrapper.find('input[type="text"]');
    expect(searchInput.exists()).toBe(true);
  });

  it('renders 12 skeleton cards when data is empty', () => {
    const wrapper = mountComponent({ data: [] });

    const skeletonCards = wrapper
      .findComponent({ name: 'v-container' })
      .findAllComponents({ name: 'v-card' });

    expect(skeletonCards.length).toBe(12);
  });

  it('renders correct number of data items', () => {
    const mockData = [{ id: 1 }, { id: 2 }, { id: 3 }] as never[];
    const wrapper = mountComponent({ data: mockData });

    const dataCards = wrapper.findAllComponents({ name: 'v-col' });
    expect(dataCards.length).toBe(mockData.length);
  });
});
