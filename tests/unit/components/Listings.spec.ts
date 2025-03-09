import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import Listings from '@/components/Listings.vue';
import { useState } from '#app'; // Import useState from Nuxt
import { createVuetify } from 'vuetify';

const vuetify = createVuetify();

describe('Listings.vue', () => {
  it('renders the title from useState', () => {
    // Set the state before mounting
    const title = useState('title', () => 'Test Title');

    const wrapper = mount(Listings, {
      global: { plugins: [vuetify] },
      slots: { title: title.value },
    });

    const titleElement = wrapper.find('h1.text-h3');

    expect(titleElement.exists()).toBe(true);
    expect(titleElement.text()).toBe(title.value);
  });

  it('displays breadcrumbs based on the route', async () => {
    const mockRoute = {
      path: '/assets/music',
      matched: [{ path: '/assets' }, { path: '/assets/music' }],
    };

    const wrapper = mount(Listings, {
      global: {
        plugins: [vuetify],
        mocks: {
          useRoute: () => mockRoute, // Mock Nuxt route
        },
      },
    });

    const breadcrumbs = wrapper.findComponent({ name: 'v-breadcrumbs' });
    expect(breadcrumbs.exists()).toBe(true);
  });

  it('displays a search input field', () => {
    const wrapper = mount(Listings, { global: { plugins: [vuetify] } });
    const searchInput = wrapper.find('input[type="text"]');
    expect(searchInput.exists()).toBe(true);
  });

  it('renders 12 skeleton cards when data is empty', () => {
    const wrapper = mount(Listings, {
      global: { plugins: [vuetify] },
      props: { data: [] },
    });

    const skeletonCards = wrapper
      .findComponent({ name: 'v-container' })
      .findAllComponents({ name: 'v-card' });
    expect(skeletonCards.length).toBe(12);
  });

  it('renders correct number of data items', () => {
    const mockData = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const wrapper = mount(Listings, {
      global: { plugins: [vuetify] },
      props: { data: mockData as never[] },
    });

    const dataCards = wrapper.findAllComponents({ name: 'v-col' });
    expect(dataCards.length).toBe(mockData.length);
  });
});
