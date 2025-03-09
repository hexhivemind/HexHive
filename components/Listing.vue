<template>
  <v-container fluid>
    <v-card>
      <h1>{{ model.title }}</h1>
      <h2>{{ model.description }}</h2>
      <h3>By: {{ model.author }}</h3>
    </v-card>

    <!--
      <v-rating
        half-increments
        hover
        :length="5"
        :size="32"
        :model-value="3.5"
        color="green"
        active-color="green"
      />
    -->
  </v-container>
</template>

<script lang="ts" setup>
  definePageMeta({
    name: 'Listing',
  });

  const model = defineModel<ListingData>('data', { required: true });
</script>
