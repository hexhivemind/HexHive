<template>
  <form @submit.prevent="submit">
    <UploadListing
      v-model:title="title"
      v-model:description="description"
      v-model:permissions="permissions"
      v-model:slug="slug"
      :errors="errors"
      :meta="meta"
    >
      <v-select
        v-model="rom"
        :items="runtimeTypes.SupportedBaseRom"
        label="Base Rom"
        :error-messages="errors.baseRom"
        class="mb-4"
        required
        variant="outlined"
      />

      <v-select
        v-model="region"
        :items="runtimeTypes.SupportedBaseRomRegion"
        label="Base Rom Region"
        :error-messages="errors.baseRomRegion"
        class="mb-4"
        required
        variant="outlined"
      />

      <v-select
        v-model="version"
        :items="runtimeTypes.SupportedBaseRomVersion"
        label="Base Rom Version"
        :error-messages="errors.baseRomVersion"
        class="mb-4"
        required
        variant="outlined"
        hint="The version of the rom (not the romhack version)"
      />

      <v-text-field
        v-model="release"
        :error-messages="errors.release"
        label="Release"
        type="text"
        class="mb-4"
        required
        variant="outlined"
        hint="The version of the romhack (not the rom version)"
        persistent-hint
      />

      <v-combobox
        v-model="categories"
        :items="runtimeTypes.RomhackCategory"
        label="Categories"
        :error-messages="errors.categories"
        multiple
        chips
        class="mb-4"
        required
        variant="outlined"
      />

      <v-combobox
        v-model="states"
        :items="runtimeTypes.RomhackState"
        label="State"
        :error-messages="errors.states"
        multiple
        chips
        class="mb-4"
        required
        variant="outlined"
      />

      <v-expansion-panels>
        <v-expansion-panel title="Optional Data">
          <template #text>
            <!-- TODO: Optional Fields -->
          </template>
        </v-expansion-panel>
      </v-expansion-panels>

      <v-checkbox v-model="mature" label="Mature Content" class="mb-4" />
    </UploadListing>
  </form>
</template>

<script setup lang="ts">
  import { RomhackDataSchema } from '~/shared/zod';

  // const { handleSubmit, meta, errors } = useForm({
  //   validationSchema: toTypedSchema(RomhackDataSchema),
  // });

  const { title, description, permissions, slug } = useListingForm();

  const { value: rom } = useField<RomhackData['baseRom']>('baseRom');
  const { value: region } =
    useField<RomhackData['baseRomRegion']>('baseRomRegion');
  const { value: version } =
    useField<RomhackData['baseRomVersion']>('baseRomVersion');
  const { value: categories } =
    useField<RomhackData['categories']>('categroies');
  const { value: release } = useField<RomhackData['release']>('release');
  const { value: states } = useField<RomhackData['states']>('states');

  // TODO: Optional Fields
  // const { value: boxArt } = useField<RomhackData['boxart']>('boxart');
  // TODO: Might need custom handling for this field.
  // const { value: changelog } = useField<RomhackData[]>('changelog');
  // const { value: screenshots } =
  //   useField<RomhackData['screenshots']>('screenshots');
  // const { value: tags } = useField<RomhackData['tags']>('tags');
  // const { value: trailer } = useField<RomhackData['trailer']>('trailer');

  const { value: mature } = useField<boolean>('mature');

  // TODO: Handle Submit
  // const submit = () => handleSubmit(async (_values) => {});

  const submit = async () => {
    // await submit({
    //   title: title.value,
    //   description: description.value,
    //   permissions: permissions.value,
    //   slug: slug.value,
    //   baseRom: rom.value,
    //   baseRomRegion: region.value,
    //   baseRomVersion: version.value,
    //   categories: categories.value,
    //   release: release.value,
    //   states: states.value,
    //   mature: mature.value,
    // });
  };

  const valid = computed(
    () =>
      RomhackDataSchema.safeParse({
        title: title.value,
        description: description.value,
        permissions: permissions.value,
        slug: slug.value,
        baseRom: rom.value,
        baseRomRegion: region.value,
        baseRomVersion: version.value,
        categories: categories.value,
        release: release.value,
        states: states.value,
        mature: mature.value,
      }).success,
  );

  const meta = { valid } as never;
  const errors = {
    title: [],
    description: [],
    permissions: [],
    slug: [],
    baseRom: [],
    baseRomRegion: [],
    baseRomVersion: [],
    categories: [],
    release: [],
    states: [],
    mature: [],
  };
</script>

<style lang="scss" scoped></style>
