<template>
  <span />
</template>

<script lang="ts" setup>
  definePageMeta({
    name: 'Music',
    layout: 'listings',
    key: (route) => route.fullPath,
  });

  const title = useState('title');
  title.value = 'Music';
</script>
