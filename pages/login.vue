<script setup lang="ts">
  definePageMeta({
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
