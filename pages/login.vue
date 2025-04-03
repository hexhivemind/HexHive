<script setup lang="ts">
  definePageMeta({
    name: 'Login',
  });

  const mode = ref('WebAuthN');
</script>

<template>
  <LoginWebAuthN v-if="mode === 'WebAuthN'" />
  <LoginPassword v-else-if="mode === 'Password'" />
</template>
