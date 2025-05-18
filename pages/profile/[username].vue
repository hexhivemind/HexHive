<template>
  <v-container dense class="h-[90%]">
    <v-row class="h-full gap-6" dense no-gutters>
      <!-- Sidebar -->
      <v-col cols="12" md="4" class="h-full">
        <v-row class="h-full gap-6" dense no-gutters>
          <!-- Nametag -->
          <v-col cols="12">
            <v-card class="px-5 py-5 text-center relative h-full">
              <span
                v-if="user.role !== 'user'"
                :class="[
                  'absolute top-3 right-3 px-3 py-1 rounded-full text-xs capitalize ',
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

                <div class="flex items-center">
                  <h2 class="text-xl font-semibold">
                    {{ user.displayName || user.username }}
                  </h2>
                  <p class="text-xs ml-2">({{ user.pronouns }})</p>
                </div>

                <p>@{{ user.username }}</p>
              </div>
            </v-card>
          </v-col>

          <!-- STATS ROW -->
          <v-col cols="12">
            <v-card class="px-5 py-5 h-full">
              <h3 class="font-semibold text-lg">📊 User Stats</h3>
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
          </v-col>

          <!-- SOCIALS ROW -->
          <v-col cols="12" class="flex-grow-1">
            <v-card class="px-5 py-5 h-full">
              <h3 class="font-semibold text-lg">🔗 Socials</h3>
              <div v-for="(link, platform) in user.socials" :key="platform">
                <a :href="link" target="_blank" class="hover:underline">
                  {{ platform }}: {{ link }}
                </a>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-col>

      <!-- Content -->
      <v-col>
        <v-row class="h-full gap-6" dense no-gutters>
          <v-col cols="12">
            <v-card class="h-full">test</v-card>
          </v-col>

          <v-col cols="12">
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

  // Will be used to fetch user data from the server
  const _username = route.params['username'];

  const roleColor: { [user in UserRole]: string } = {
    user: 'bg-blue-100 text-blue-800',
    moderator: 'bg-green-100 text-green-800',
    admin: 'bg-red-100 text-red-800',
  };
</script>
