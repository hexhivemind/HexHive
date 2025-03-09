<template>
  <Listing :data="data" />
</template>

<script lang="ts" setup>
  const route = useRoute();

  const data: RomhackData = {
    id: route.params.id as string,
    title: 'Fire Red Omega++',
    description: "A continuation hack of Drayano's Fire Red Omega",
    author: 'Jordank',
    filename: 'FRO++.gba',
    release: 'v4.9',
    releaseDate: 'December 2024',

    // 1636 Pokemon Fire Red (U)(Squirrels)
    baseRom: 'Fire Red',
    baseRomVersion: 'v1.0',
    baseRomRegion: 'English',

    // slug: '',
    // rating: ''
  };
</script>
