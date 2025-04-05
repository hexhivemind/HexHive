<script lang="ts" setup>
  import { webauthnSchema } from '~/shared/zod';

  const { handleSubmit, meta, errors } = useForm({
    validationSchema: toTypedSchema(webauthnSchema),
  });

  const props = defineProps<{
    submit: (values: unknown) => void;
  }>();

  const i = defineModel<string>('identity', { default: '' });

  const { value: identity } = useField<string>('identity', undefined, {
    syncVModel: 'identity',
    validateOnMount: Boolean(i.value),
  });

  const submit = handleSubmit(props.submit);
</script>

<template>
  <form @submit.prevent="submit">
    <!-- Identity -->
    <v-text-field
      v-model="identity"
      :error-messages="errors.identity"
      label="Email or Username"
      type="text"
      class="mb-4"
      required
    />

    <div class="flex justify-center">
      <v-btn
        type="submit"
        color="primary"
        :disabled="!meta.valid"
        class="justify-center w-48"
        :rounded="1"
      >
        Login
      </v-btn>
    </div>
  </form>
</template>

<style lang="scss" scoped></style>
