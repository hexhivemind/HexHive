<template>
  <span />
</template>

<script lang="ts" setup>
  definePageMeta({
    name: 'Scripts',
    layout: 'listings',
  });

  const title = useState('title');
  title.value = 'Scripts';
</script>
