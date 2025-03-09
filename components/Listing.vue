<template>
  <v-container fluid>
    <v-card>
      <h1>{{ model.title }} - {{ model.release }}</h1>
      <h2>{{ model.description }}</h2>
      <h3>By: {{ model.author }}</h3>

      <br />

      <p>
        Based on: {{ model.baseRom }} Version &mdash;
        {{ model.baseRomVersion }} ({{ model.baseRomRegion }})
      </p>

      <p>{{ model.release }} Release Date: {{ model.releaseDate }}</p>

      <br />
      <small>ID or Slug: {{ model.id }}</small>

      <v-expansion-panels v-model="activePanels" multiple>
        <v-expansion-panel value="changelog">
          <template #title>
            <h3>Changelog</h3>
          </template>

          <!-- The changelog content -->
          <v-expansion-panel-text class="changelog">
            <v-select
              v-model="selectedVersion"
              :items="versionOptions"
              label="Select Version"
              dense
            />

            <div v-if="selectedVersion">
              <template v-if="selectedVersion === 'All Changes'">
                <div
                  v-for="version in model.changelog?.versionList"
                  :key="version"
                >
                  <h3>{{ version }} Changes</h3>
                  <p>{{ model.changelog?.entries[version] }}</p>
                  <br />
                </div>
              </template>

              <template v-else>
                <h3>{{ selectedVersion }} Changes</h3>
                <p>{{ getChangelog(selectedVersion) }}</p>
              </template>
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <v-expansion-panel value="screenshots">
          <template #title>
            <h3>Screenshots</h3>
          </template>

          <v-expansion-panel-text class="screenshots">
            <v-carousel v-if="model.screenshots?.length">
              <v-carousel-item
                v-for="(screenshot, i) in model.screenshots"
                :key="i"
                :src="screenshot"
              ></v-carousel-item>
            </v-carousel>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card>

    <!--
      <v-rating
        half-increments
        hover
        :length="5"
        :size="32"
        :model-value="3.5"
        color="green"
        active-color="green"
      />
    -->
  </v-container>
</template>

<script lang="ts" setup>
  import { ref, computed } from 'vue';

  definePageMeta({
    name: 'Listing',
  });

  // For testing, change data type, should be ListingData eventually
  const model = defineModel<RomhackData>('data', { required: true });

  // By default, open these Expansion Panels:
  const activePanels = ref(['changelog', 'screenshots']);

  // Create computed version options with an "all" option prepended:
  const versionOptions = computed(() => {
    const list = model.value.changelog?.versionList || [];
    return ['All Changes', ...list];
  });

  // Default to "all" so all entries are listed initially.
  const selectedVersion = ref('All Changes');

  function getChangelog(version: string) {
    return (
      model.value.changelog?.entries[version] ||
      'No changelog available for this version.'
    );
  }
</script>

<style lang="scss" scoped>
  .v-container {
    height: 100%;

    .v-expansion-panel-text {
      text-align: left;

      // &.changelog {

      // }

      // &.screenshots {

      // }
    }

    .v-card {
      margin: auto;
      height: 100%;
      width: 80%;
      max-width: 80rem;
      text-align: center;
    }
  }
</style>
