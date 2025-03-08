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

  <v-navigation-drawer v-model="drawer" temporary>
    <v-list>
      <v-list-item
        :value="item"
        v-for="(item, i) in items"
        :key="i"
        :to="item.to"
        :disabled="item.to === route.path"
      >
        <template v-slot:prepend>
          <v-icon :icon="item.icon" />
        </template>
        <v-list-item-title v-text="item.title" />
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
  const drawer = ref(false);

  const router = useRouter();
  const route = useRoute();

  const routeIcons: Record<string, string> = {
    home: 'mdi-home',
    assets: 'mdi-multimedia',
    scripts: 'mdi-code-json',
    romhacks: 'mdi-nintendo-game-boy',
    steam: 'mdi-script-text-outline',
    '404': 'mdi-link-variant',
  };

  const routes = router.getRoutes();

  const items = routes.map((route) => ({
    title: route.name,
    to: route.path,
    icon: routeIcons[route.name?.toString().toLowerCase() || '404'],
  }));

  // const items = [
  //   {
  //     title: 'Item #1',
  //     value: 1,
  //     icon: 'mdi-magnify',
  //   },
  //   {
  //     title: 'Item #2',
  //     value: 2,
  //   },
  //   {
  //     title: 'Item #3',
  //     value: 3,
  //   },
  // ];
</script>
