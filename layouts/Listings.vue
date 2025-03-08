<template>
  <v-app>
    <Header />
    <v-main>
      <v-container>
        <v-row>
          <h1 class="text-h3">
            <slot name="title">Title here</slot>
          </h1>

          <!-- Dynamically generated breadcrumbs -->
          <v-breadcrumbs :items="breadcrumbs" />

          <v-text-field prepend-inner-icon="mdi-magnify" label="Search" />
        </v-row>

        <v-row>
          <v-col v-for="(item, index) in displayItems" :key="index" cols="4">
            <slot v-if="hasData" :name="'card-' + index">
              <v-card height="200">
                <v-card-text>{{ item.name }}</v-card-text>
              </v-card>
            </slot>
            <v-card v-else height="200"></v-card>
          </v-col>
        </v-row>
      </v-container>

      <v-card variant="plain">
        <v-pagination show-first-last-page :length="10" :total-visible="5" />
      </v-card>
    </v-main>
    <Footer />
  </v-app>
</template>

<script setup>
  import { useRoute } from 'vue-router';
  import { computed, inject } from 'vue';

  // Get the current route
  const route = useRoute();

  // Convert route path to breadcrumb array
  const breadcrumbs = computed(() => {
    return route.path
      .split('/')
      .filter(Boolean) // Remove empty segments
      .map((segment) => ({
        text: segment,
        to: '/' + segment, // Creates a breadcrumb link
      }));
  });

  // Inject data from the page
  const items = inject('items', []);

  // Check if there is data
  const hasData = computed(() => items.length > 0);

  // Use skeletons if there's no data, otherwise use actual items
  const displayItems = computed(() =>
    hasData.value ? items : Array(12).fill({}),
  );
</script>
