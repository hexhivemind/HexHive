<template>
  <span />
</template>

<script lang="ts" setup>
  definePageMeta({
    name: 'Sound',
    layout: 'listings',
    key: (route) => route.fullPath,
  });

  const title = useState('title');
  title.value = 'Sound';
</script>
