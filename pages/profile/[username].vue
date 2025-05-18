<template>
  <v-container dense class="h-[90%]">
    <v-row class="h-full">
      <!-- Sidebar -->
      <v-col cols="12" md="4">
        <!-- Nametag -->
        <v-card class="px-5 py-5 text-center relative">
          <span
            v-if="user.role !== 'user'"
            :class="[
              'absolute top-3 right-3 px-3 py-1 rounded-full text-xs ',
              roleColor[user.role],
            ]"
          >
            {{ user.role }}
          </span>

          <div class="flex flex-col items-center">
            <v-img
              class="rounded-full"
              width="128"
              height="128"
              cover
              src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
            />
            <!-- :src="user.avatar" -->

            <div class="flex items-center mt-2">
              <h2 class="text-xl font-semibold">
                {{ user.displayName || user.username }}
              </h2>
              <p class="text-xs ml-2">({{ user.pronouns }})</p>
            </div>

            <p>@{{ user.username }}</p>
          </div>
        </v-card>

        <!-- STATS ROW -->
        <v-card class="px-5 py-5 mt-4">
          <h3 class="font-semibold text-lg mb-3">📊 User Stats</h3>
          <ul class="space-y-2">
            <li>
              <strong>Joined on: </strong>
              <v-tooltip bottom>
                <template #default>
                  <span>
                    {{ joinDate.toFormat('yyyy-LL-dd HH:mm:ss') }}
                  </span>
                </template>
                <template #activator="{ props }">
                  <span v-bind="props">
                    {{ joinDate.toFormat('yyyy-LL-dd') }}
                  </span>
                </template>
              </v-tooltip>
            </li>
            <li>
              <strong>Last Seen: </strong>
              <v-tooltip bottom>
                <template #default>
                  <span>
                    {{ lastActiveDate.toFormat('yyyy-LL-dd HH:mm:ss') }}
                  </span>
                </template>
                <template #activator="{ props }">
                  <span v-bind="props">
                    {{ lastActiveDate.toFormat('yyyy-LL-dd') }}
                  </span>
                </template>
              </v-tooltip>
            </li>
          </ul>
        </v-card>

        <!-- SOCIALS ROW -->
        <v-card class="px-5 py-5 mt-4">
          <h3 class="font-semibold text-lg mb-3">🔗 Socials</h3>
          <div v-for="(link, platform) in user.socials" :key="platform">
            <a :href="link" target="_blank" class="hover:underline">
              {{ platform }}: {{ link }}
            </a>
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

  const roleColor: Record<string, string> = {
    user: 'bg-blue-100 text-blue-800',
    moderator: 'bg-green-100 text-green-800',
    admin: 'bg-red-100 text-red-800',
  };
</script>
