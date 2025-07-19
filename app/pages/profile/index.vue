<template>
  <span />
</template>

<script lang="ts" setup>
  definePageMeta({
    isNavigable: false,
    key: (route) => route.fullPath,
    // layout: '',
    name: 'Profile',
  });

  const title = useState('title');
  title.value = 'Profile';
</script>
