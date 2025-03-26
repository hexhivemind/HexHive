<template>
  <v-app>
    <Header />
    <v-main>
      <slot />
      <Listings :data="data">
        <template #title>{{ title }}</template>
      </Listings>
    </v-main>
    <Footer />
  </v-app>
</template>

<script lang="ts" setup>
  const title = useState('title', () => 'Title here');
  const data = useState('listings', () => [] as ListingData[]);

  onBeforeUnmount(() => {
    title.value = '';
  });
</script>
