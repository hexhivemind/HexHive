<script lang="ts" setup>
  import { webauthnSchema } from '~/shared/zod';
  import {
    email as EmailValidator,
    username as UsernameValidator,
  } from '~/shared/zod-helpers';

  const validator = webauthnSchema.extend({
    identity: EmailValidator,
    username: UsernameValidator,
  });

  // const { handleSubmit, meta, errors } = useForm({
  //   validationSchema: toTypedSchema(
  //     webauthnSchema.extend({
  //       identity: EmailValidator,
  //       username: UsernameValidator,
  //     }),
  //   ),
  // });

  const props = defineProps<{
    submit: (values: unknown) => void;
  }>();

  const i = defineModel<string>('identity', { default: '' });
  const u = defineModel<string>('username', { default: '' });

  const { value: identity } = useField<string>('identity', undefined, {
    syncVModel: 'identity',
    validateOnMount: Boolean(i.value),
  });
  const { value: username } = useField<string>('username', undefined, {
    syncVModel: 'username',
    validateOnMount: Boolean(u.value),
  });

  // const submit = handleSubmit(props.submit);
  const submit = async () => {
    await props.submit({
      identity: identity.value,
      username: username.value,
    });
  };

  const valid = computed(
    () =>
      validator.safeParse({
        identity: identity.value,
        username: username.value,
      }).success,
  );
</script>

<template>
  <form @submit.prevent="submit">
    <!-- Identity -->
    <v-text-field
      v-model="identity"
      label="Email Address"
      type="email"
      class="mb-4"
      required
    />

    <!-- Username (signup only) -->
    <v-text-field v-model="username" label="Username" class="mb-4" required />

    <div class="flex justify-center">
      <v-btn
        type="submit"
        color="primary"
        :disabled="!valid"
        class="justify-center w-48"
        :rounded="1"
      >
        {{ 'Sign Up' }}
      </v-btn>
    </div>
  </form>
</template>

<style lang="scss" scoped></style>
