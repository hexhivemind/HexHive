<template>
  <v-dialog>
    <template #activator="{ props }">
      <v-btn v-if="loggedIn" v-bind="props" text="Login" />
      <template v-else>
        <!-- Logout or Dropdown User Menu including Logout -->
        <LoginUserMenu />
      </template>
    </template>

    <template #default="{ isActive }">
      <v-card>
        <LoginWebAuthN v-if="isActive" />
      </v-card>
    </template>
  </v-dialog>
</template>

<script lang="ts" setup>
  const { loggedIn } = useUserSession();
</script>

<style lang="scss" scoped></style>
