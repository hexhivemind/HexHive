<template>
  <v-dialog>
    <template #activator="{ props }">
      <v-btn
        v-if="!(loggedIn || route.name === 'Login')"
        v-bind="props"
        text="Login"
      />
      <template v-else-if="loggedIn">
        <!-- Logout or Dropdown User Menu including Logout -->
        <LoginUserMenu />
      </template>
    </template>

    <template #default="{ isActive }">
      <v-card class="w-fit place-self-center">
        <LoginForm v-if="isActive" />
      </v-card>
    </template>
  </v-dialog>
</template>

<script lang="ts" setup>
  const { loggedIn } = useUserSession();
  const route = useRoute();
</script>

<style lang="scss" scoped></style>
