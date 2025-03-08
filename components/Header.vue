<template>
  <v-app-bar
    :elevation="1"
    rounded
    scroll-behavior="collapse fade-image"
    scroll-threshold="200"
  >
    <template v-slot:prepend>
      <v-app-bar-nav-icon @click="drawer = !drawer" />
    </template>

    <v-app-bar-title>HexHive</v-app-bar-title>

    <template v-slot:append>
      <v-btn icon="mdi-magnify" />
      <v-btn icon="mdi-dots-vertical" />
    </template>
  </v-app-bar>

  <v-navigation-drawer v-model="drawer">
    <v-list>
      <v-list-item v-for="(item, i) in items" :key="i" :value="item">
        <NuxtLink to="">
          {{ item.icon }}
          {{ item.title }}
        </NuxtLink>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
  const drawer = ref(false);

  const items = [
    {
      title: 'Item #1',
      value: 1,
      icon: 'mdi-magnify',
    },
    {
      title: 'Item #2',
      value: 2,
    },
    {
      title: 'Item #3',
      value: 3,
    },
  ];
</script>
