<template>
  <v-menu>
    <template #activator="{ props }">
      <v-btn v-bind="props">
        {{ user!.username }}
      </v-btn>
    </template>

    <v-list>
      <v-list-item
        v-for="(item, index) in menu"
        :key="index"
        :value="item"
        @click="item.action"
      >
        <v-list-item-title>{{ item.label }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts" setup>
  const { user: _user, clear } = useUserSession();
  const user = _user as ComputedRef<UserSession['user'] | null>;

  const menu = [
    {
      label: 'Profile',
      action: undefined, // Navigate to Profile ?
    },
    {
      label: 'My Data Hives',
      action: undefined, // User's assets/hacks
    },
    {
      label: 'Account Settings',
      action: undefined, // Navigate to Account Settings
      // action: () => navigateTo({
      //   path: '/account'
      // })
    },
    {
      label: 'Logout',
      action: () => {
        clear();
        // If we want to navigate away, or perhaps only if auth required route.
        navigateTo({ path: '/' });
      },
    },
  ];
</script>

<style lang="scss" scoped></style>
