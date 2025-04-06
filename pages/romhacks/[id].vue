<template>
  <Listing :data="data" />
</template>

<script lang="ts" setup>
  import { DateTime } from 'luxon';

  const route = useRoute();

  const data: RomhackData = {
    author: 'Jordank',
    description: "A continuation hack of Drayano's Fire Red Omega",
    id: route.params.id as string,
    filename: 'FRO++.gba',
    permissions: 'Credit',
    release: 'v4.9',
    releaseDate: DateTime.local(2024, 12), //'December 2024',
    title: 'Fire Red Omega++',

    // 1636 Pokemon Fire Red (U)(Squirrels)
    baseRom: 'Fire Red',
    baseRomVersion: 'v1.0',
    baseRomRegion: 'English',

    screenshots: ['/demo/titlescreen.webp'],

    // Added changelog entries to the model
    changelog: {
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
