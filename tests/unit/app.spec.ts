import { describe, expect, it } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import App from '~/app.vue';

describe('App.vue', () => {
  it('renders the app component', () => {
    const wrapper = shallowMount(App, {
      global: {
        stubs: ['NuxtLayout', 'NuxtPage', 'NuxtRouteAnnouncer'],
      },
    });

    expect(wrapper.exists()).toBe(true);
  });
});
