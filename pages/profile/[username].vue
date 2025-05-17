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

          <div class="grid grid-cols-1">
            <span>{{ user.username }} ({{ user.pronouns }})</span>
            <span>Joined: {{ joinDate.toFormat('yyyy-LL-dd') }}</span>
            <span>
              Last Active: {{ lastActiveDate.toFormat('yyyy-LL-dd') }}
            </span>

            <div v-for="social in Object.keys(user.socials)" :key="social">
              {{ social }}: {{ user.socials[social] }}
            </div>
          </div>
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
            <v-card class="h-full">
              <h2>Projects</h2>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
  import { DateTime } from 'luxon';

  const route = useRoute();

  const userStore = useUserStore();
  const { user } = storeToRefs(userStore);

  const joinDate = DateTime.fromJSDate(user.value.joinDate!);
  const lastActiveDate = DateTime.fromJSDate(user.value.lastActiveDate!);

  const _username = route.params['username'];
</script>
