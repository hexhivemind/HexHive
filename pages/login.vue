<script setup lang="ts">
  definePageMeta({
    isNavigable: false,
    name: 'Login',
  });

  const handleSubmit = () => {
    navigateTo({
      path: '/',
    });
  };
</script>

<template>
  <LoginForm @submit="handleSubmit" />
</template>
