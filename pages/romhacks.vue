<template>
  <v-main>
    <v-container>
      <v-row>
        <v-col v-for="n in 12" :key="n" cols="4">
          <v-card height="200"></v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script lang="ts" setup>
  definePageMeta({
    name: 'Romhacks',
  });
</script>
