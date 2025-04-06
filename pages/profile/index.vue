<template>
  <span />
</template>

<script lang="ts" setup>
  definePageMeta({
    name: 'Profile',
    // layout: '',
    key: (route) => route.fullPath,
  });

  const title = useState('title');
  title.value = 'Profile';
</script>
