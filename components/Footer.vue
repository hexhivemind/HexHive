<template>
  <v-layout class="overflow-visible" style="height: 56px">
    <v-bottom-navigation v-model="value" :bg-color="color" mode="shift">
      <v-btn>
        <v-icon>mdi-fire</v-icon>
        <span>Fire Red</span>
      </v-btn>

      <v-btn>
        <v-icon>mdi-diamond-stone</v-icon>
        <span>Emerald</span>
      </v-btn>
    </v-bottom-navigation>
  </v-layout>
</template>
<script setup>
  import { computed, ref } from 'vue';

  const value = ref(1);
  const color = computed(() => {
    switch (value.value) {
      case 0:
        return '#df632d';
      case 1:
        return '#2e983e';
      default:
        return 'blue-grey';
    }
  });
</script>
