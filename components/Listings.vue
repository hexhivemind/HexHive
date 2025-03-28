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
          <v-card height="200" :to="`${route.path}/test-${n}`" />
        </v-col>
      </template>
      <template v-else>
        <v-col v-for="(n, i) in data" :key="i" cols="4">
          <template v-if="!isDeleted(n)">
          <!-- TODO: Add artwork to cards based on type and data -->
          <v-card height="200" :to="`${route.path}/${n.id}`" />
          </template>
          <template v-else>
            <!-- TODO: Decide how to properly display deleted entries -->
            <v-card height="200" :to="`${route.path}/${n._id}`" />
          </template>
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

  const data = defineModel<ListEntry<ListingData>[]>('data', { default: [] });

  function isDeleted(entry: ListEntry<ListingData>): entry is DeletedEntry {
    return (entry as DeletedEntry).deleted === true;
  }

  const { breadcrumbs } = useBreadcrumbs();
</script>
