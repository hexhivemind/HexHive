<script lang="ts" setup>
  import { passwordSchema } from '~/shared/zod';

  // const { handleSubmit, meta, errors } = useForm({
  //   validationSchema: toTypedSchema(passwordSchema),
  // });

  const props = defineProps<{
    submit: (values: unknown) => void;
  }>();

  const i = defineModel<string>('identity', { default: '' });
  const p = defineModel<string>('password', { default: '' });

  const { value: identity } = useField('identity', undefined, {
    syncVModel: 'identity',
    validateOnMount: Boolean(i.value),
  });
  const { value: password } = useField('password', undefined, {
    syncVModel: 'password',
    validateOnMount: Boolean(p.value),
  });

  // const submit = handleSubmit(props.submit);

  const submit = async () => {
    await props.submit({
      identity: identity.value,
      password: password.value,
    });
  };

  const valid = computed(
    () =>
      passwordSchema.safeParse({
        identity: identity.value,
        password: password.value,
      }).success,
  );
</script>

<template>
  <form @submit.prevent="submit">
    <!-- Identity -->
    <v-text-field
      v-model="identity"
      label="Email or Username"
      type="text"
      class="mb-4"
      required
    />

    <!-- Password-->
    <v-text-field
      v-model="password"
      label="Password"
      type="password"
      class="mb-4"
      required
    />

    <div class="flex justify-center">
      <v-btn
        type="submit"
        color="primary"
        :disabled="!valid"
        class="justify-center w-48"
        :rounded="1"
      >
        Login
      </v-btn>
    </div>
  </form>
</template>

<style lang="scss" scoped></style>
