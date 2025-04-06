<template>
  <span>Hello, {{ username }}!</span>
</template>

<script lang="ts" setup>
  const route = useRoute();

  const username = route.params['username'];
</script>
