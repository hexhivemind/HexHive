<template>
  <v-app full-height>
    <Header />
    <v-main>
      <slot />
    </v-main>
    <Footer />
  </v-app>
</template>

<style lang="scss" scoped>
  .v-main {
    display: grid;
    place-items: center;
  }
</style>
