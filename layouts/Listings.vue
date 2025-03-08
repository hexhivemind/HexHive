<template>
  <v-app>
    <Header />
    <v-main>
      <slot />
      <Listings>
        <template #title>{{ title }}</template>
      </Listings>
    </v-main>
    <Footer />
  </v-app>
</template>

<script lang="ts" setup>
  const title = useState('title');
</script>
