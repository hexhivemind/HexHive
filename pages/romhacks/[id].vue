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

    screenshots: ['/demo/titlescreen.webp'],

    // Added changelog entries to the model
    changelog: {
      versionList: ['v1.2', 'v1.1', 'v1.0'],
      entries: {
        'v1.2': 'Added new user interface enhancements and updated features.',
        'v1.1': 'Fixed several minor bugs and improved overall performance.',
        'v1.0': 'Initial release of Fire Red Omega++ with basic features.',
      },
    },

    // slug: '',
    // rating: ''
  };
</script>
