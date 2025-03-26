<template>
  <v-app-bar
    :elevation="1"
    rounded
    scroll-behavior="fade-image"
    scroll-threshold="200"
  >
    <template #prepend>
      <v-app-bar-nav-icon @click="drawer = !drawer" />

      <v-avatar>
        <v-img src="public/favicon.ico" />
      </v-avatar>
    </template>

    <v-app-bar-title>HexHive</v-app-bar-title>

    <template #append>
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
  } from 'vue-router';

  const drawer = ref(false);

  const router = useRouter();
  const route = useRoute();

  const routeIcons: Record<string, string> = {
    assets: 'mdi-multimedia',
    home: 'mdi-home',
    music: 'mdi-music',
    romhacks: 'mdi-nintendo-game-boy',
    scripts: 'mdi-code-json',
    sprites: 'mdi-pokeball',
    // 404
    default: 'mdi-link-variant',
  };

  const groupRouteName: Record<string, string> = {
    assets: 'All Assets',
  };

  // TODO: Add optional manual indexing later.
  const orderMap = new Map(
    [
      'home',
      // assets: 1,
      // romhacks: 2,
      // scripts: 3,
      // steam: 4,
    ].map((route, i) => [route, i]),
  );

  const sort = (a: string, b: string) => {
    const lowerA = a.toLowerCase();
    const lowerB = b.toLowerCase();

    const aIndex = orderMap.get(lowerA) ?? Infinity;
    const bIndex = orderMap.get(lowerB) ?? Infinity;

    if (aIndex !== bIndex) return aIndex - bIndex;

    return lowerA.localeCompare(lowerB);
  };

  const routes = router.getRoutes();
  const routeMap = new Map<string, RouteRecordNormalized>(
    routes.map((r) => [r.path, r]),
  );

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
      routeIcons[route.name?.toString().toLowerCase() || 'default'] ||
      routeIcons.default,
    ...(route.children.filter((c) => !c.path.includes(':')).length
      ? {
          children: route.children
            .filter((c) => !c.path.includes(':'))
            .map((child) => createNav(child as RouteRecordNormalized)),
        }
      : {}),
  });

  routes.forEach((route) => {
    const parentPath = route.path.split('/').slice(0, -1).join('/') || '/';
    if (
      parentPath !== '/' &&
      routeMap.has(parentPath) &&
      route.path !== parentPath &&
      !routeMap.get(parentPath)!.children.includes(route)
    )
      routeMap.get(parentPath)!.children!.push(route);
  });

  const items = [...routeMap.values()]
    .filter(
      (r) =>
        !r.path.includes('/', 1) ||
        r.children!.filter((c) => !c.path.includes(':')).length,
    )
    .map(createNav)
    .sort((a, b) => sort(a.title!.toString(), b.title!.toString()));

  const opened = ref([] as string[]);
</script>
