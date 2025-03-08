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
    <v-list v-model:opened="opened">
      <template v-for="(item, i) in items" :key="i">
        <v-list-item
          v-if="!item.children"
          :value="item"
          :to="item.to"
          :disabled="item.to === route.path"
          :prepend-icon="item.icon"
          :title="item.title?.toString()"
        />

        <v-list-group v-else :value="item.title?.toString()">
          <template #activator="{ props }">
            <v-list-item
              v-bind="props"
              :value="item"
              prepend-icon="mdi-view-list"
              :title="item.title?.toString()"
            />
          </template>

          <v-list-item
            :value="item"
            :to="item.to"
            :disabled="item.to === route.path"
            :prepend-icon="item.icon"
            :title="
              groupRouteName[item.title?.toString().toLowerCase() || ''] ||
              item.title?.toString()
            "
          />

          <v-list-item
            v-for="(child, j) in item.children"
            :key="j"
            :prepend-icon="child.icon"
            :title="child.title?.toString()"
            :disabled="child.to === route.path"
            :to="child.to"
            :value="child"
          />
        </v-list-group>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
  import type {
    RouteRecordNameGeneric,
    RouteRecordNormalized,
    RouteRecordRaw,
  } from 'vue-router';

  const drawer = ref(false);

  const router = useRouter();
  const route = useRoute();

  const routeIcons: Record<string, string> = {
    home: 'mdi-home',
    assets: 'mdi-multimedia',
    sprites: 'mdi-pokeball',
    music: 'mdi-music',
    scripts: 'mdi-code-json',
    romhacks: 'mdi-nintendo-game-boy',
    steam: 'mdi-script-text-outline',
    '404': 'mdi-link-variant',
  };

  const groupRouteName: Record<string, string> = {
    assets: 'All Assets',
  };

  const routes = router.getRoutes();

  interface NavItem {
    title: RouteRecordNameGeneric;
    to: string;
    icon: string;
    children?: NavItem[];
  }

  const createNav = (route: RouteRecordNormalized): NavItem => ({
    title: route.name,
    to: route.path,
    icon:
      routeIcons[route.name?.toString().toLowerCase() || '404'] ||
      routeIcons['404'],
    ...(route.children.length > 0
      ? {
          children: route.children.map((child) =>
            createNav(getChildRouteData(child)),
          ),
        }
      : {}),
  });

  const getChildRouteData = (route: RouteRecordRaw): RouteRecordNormalized =>
    routes.find((r) => r.name === route.name)!; // We know it should exist, so we can assert that. Linter can fuck off.

  const items = routes
    .filter((route) => !route.path.includes('/', 1))
    .map(createNav);

  const opened = ref([] as string[]);

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
