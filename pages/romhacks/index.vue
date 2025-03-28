<template>
  <span />
</template>

<script lang="ts" setup>
  definePageMeta({
    name: 'Romhacks',
    layout: 'listings',
  });

  const title = useState('title');
  title.value = 'Romhacks';

  const data = useState('listings');
  const store = useRomhacksStore();
  const interval = ref();

  onMounted(async () => {
    await store.fetchData();

    interval.value = setInterval(() => {
      store.refreshData();
      data.value = store.data;
    }, store.refreshWindow);

    data.value = store.data;
  });

  onUnmounted(() => clearInterval(interval.value));
</script>
