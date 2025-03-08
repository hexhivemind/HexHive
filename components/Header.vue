<template>
  <v-app-bar
    :elevation="1"
    rounded
    scroll-behavior="collapse fade-image"
    scroll-threshold="200"
  >
    <template v-slot:prepend>
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
    </template>

    <v-app-bar-title>HexHive</v-app-bar-title>

    <template v-slot:append>
      <v-btn icon="mdi-magnify"></v-btn>
      <v-btn icon="mdi-dots-vertical"></v-btn>
    </template>
  </v-app-bar>
</template>
