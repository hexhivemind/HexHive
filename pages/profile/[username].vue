<template>
  <v-container dense class="h-[90%]">
    <v-row class="h-full">
      <!-- Sidebar -->
      <v-col md="4" cols="12">
        <v-card class="h-full">
          <v-img
            :width="256"
            aspect-ratio="1"
            cover
            src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
          />

          <span>{{ user.username }}</span>
          <span>{{ user.joinDate }}</span>
        </v-card>
      </v-col>

      <!-- Content -->
      <v-col>
        <v-row class="h-[50%]">
          <v-col>
            <v-card class="h-full">test</v-card>
          </v-col>
        </v-row>

        <v-row class="h-[50%]">
          <v-col>
            <v-card class="h-full">test</v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
  const route = useRoute();

  const userStore = useUserStore();
  const { user } = storeToRefs(userStore);

  const _username = route.params['username'];
</script>
