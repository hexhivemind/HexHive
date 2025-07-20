<template>
  <v-text-field
    v-model="title"
    :error-messages="errors.title"
    label="Title"
    type="text"
    class="mb-4"
    required
    variant="outlined"
  />

  <v-textarea
    v-model="description"
    :error-messages="errors.description"
    label="Description"
    type="text"
    class="mb-4"
    required
    variant="outlined"
  />

  <v-select
    v-model="permissions"
    label="Permissions"
    :items="runtimeTypes.AssetPermission"
    multiple
    chips
    :error-messages="errors.permissions"
    class="mb-4"
    required
    variant="outlined"
  />

  <v-text-field
    v-model="slug"
    label="Slug"
    type="text"
    class="mb-4"
    variant="outlined"
    :error-messages="errors.slug"
    hint="A unique identifier for the romhack"
    persistent-hint
  />

  <v-select
    v-if="targetedRoms"
    v-model="targetedRoms"
    label="Targeted Roms"
    :items="runtimeTypes.SupportedBaseRom"
    multiple
    chips
    :error-messages="errors.targetedRoms"
    class="mb-4"
    variant="outlined"
  />

  <slot />

  <v-btn
    type="submit"
    color="primary"
    :disabled="!meta.valid"
    class="justify-center w-48"
    :rounded="1"
  >
    Submit
  </v-btn>
</template>

<script lang="ts" setup>
  import type { FormMeta } from 'vee-validate';
  defineProps<{
    errors: Partial<
      Record<
        keyof ListingData | keyof AssetHive,
        string | string[] | null | undefined
      >
    >;
    meta: FormMeta<ListingData | AssetHive>;
  }>();

  const title = defineModel<ListingData['title']>('title');
  const description = defineModel<ListingData['description']>('description');
  const permissions = defineModel<ListingData['permissions']>('permissions');
  const slug = defineModel<ListingData['slug']>('slug');

  const targetedRoms = defineModel<AssetHive['targetedRoms']>('targetedRoms', {
    required: false,
  });
</script>
