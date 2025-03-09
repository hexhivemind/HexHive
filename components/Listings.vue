<template>
  <v-container>
    <v-row>
      <h1 class="text-h3">
        <slot name="title"> Title here </slot>
      </h1>
      <!-- <h2 class="text-h6">Description here</h2> -->
      <v-breadcrumbs :items="breadcrumbs" />

      <!-- : if loading, show spinner -->
      <v-text-field prepend-inner-icon="mdi-magnify" label="Search" />
    </v-row>

    <v-row>
      <template v-if="!data.length">
        <v-col v-for="n in 12" :key="n" cols="4">
          <v-card height="200"></v-card>
        </v-col>
      </template>
      <template v-else>
        <v-col v-for="(n, i) in data" :key="i" cols="4">
          <!-- Component for data. -->
        </v-col>
      </template>
    </v-row>
  </v-container>

  <v-card variant="plain">
    <v-pagination show-first-last-page :length="10" :total-visible="5" />
  </v-card>
</template>

<script lang="ts" setup>
  const route = useRoute();
  const router = useRouter();

  // TOFIX: Define data type and get rid of below eslint disable.
  // eslint-disable-next-line vue/require-prop-types
  const data = defineModel('data', { default: [] });

  const breadcrumbs = computed(() => {
    const segments = route.path.split('/').filter(Boolean); // Remove Empty Segments
    const routes = router.getRoutes();
    return segments.map((segment, index) => {
      const to = '/' + segments.slice(0, index + 1).join('/');
      const title =
        routes.find((r) => r.path === to)?.name?.toString() || segment;
      return {
        title,
        to,
      };
    });
  });
</script>
