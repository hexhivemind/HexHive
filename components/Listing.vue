<template>
  <v-container fluid>
    <v-card>
      <h1>{{ model.title }} - {{ model.release }}</h1>
      <h2>{{ model.description }}</h2>
      <h3>By: {{ model.author }}</h3>

      <br />

      <p>
        Based on: {{ model.baseRom }} Version &mdash;
        {{ model.baseRomVersion }} ({{ model.baseRomRegion }})
      </p>

      <p>{{ model.release }} Release Date: {{ model.releaseDate }}</p>

      <br />
      <small>ID or Slug: {{ model.id }}</small>

      <v-carousel v-if="model.screenshots?.length">
        <v-carousel-item
          v-for="(screenshot, i) in model.screenshots"
          :key="i"
          :src="screenshot"
        >
        </v-carousel-item>
      </v-carousel>
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

  // For testing, change data type, should be ListingData eventually
  const model = defineModel<RomhackData>('data', { required: true });
</script>

<style lang="scss" scoped>
  .v-container {
    height: 100%;

    .v-card {
      margin: auto;
      height: 100%;
      width: 80%;
      max-width: 80rem;
      text-align: center;
    }
  }
</style>
