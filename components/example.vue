<template>
  <v-container>
    <v-row>
      <h1 class="text-h3">Title here</h1>
      <!-- <h2 class="text-h6">Description here</h2> -->
      <v-breadcrumbs :items="['route', 'subroute']" />

      <!-- : if loading, show spinner -->
      <v-text-field prepend-inner-icon="mdi-magnify" label="Search" />
    </v-row>

    <v-row>
      <v-col v-for="n in 12" :key="n" cols="4">
        <v-card height="200"></v-card>
      </v-col>
    </v-row>
  </v-container>

  <v-card variant="plain">
    <v-pagination show-first-last-page :length="10" :total-visible="5" />
  </v-card>
</template>

<script lang="ts" setup></script>
