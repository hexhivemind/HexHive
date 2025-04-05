<script lang="ts" setup>
  import { passwordValidator } from '~/shared/zod';

  const { handleSubmit, meta, errors } = useForm({
    validationSchema: toTypedSchema(
      passwordValidator
        .extend({
          confirmPassword: z.string(),
        })
        .refine((data) => data.password === data.confirmPassword, {
          path: ['confirmPassword'],
          message: "Password doesn't match",
        }),
    ),
  });

  const props = defineProps<{
    submit: (values: unknown) => void;
  }>();

  const i = defineModel<string>('identity', { default: '' });
  const u = defineModel<string>('username', { default: '' });
  const p = defineModel<string>('password', { default: '' });

  const showPassword = ref(false);
  const showConfirm = ref(false);

  const { value: identity } = useField('identity', undefined, {
    syncVModel: 'identity',
    validateOnMount: Boolean(i.value),
  });
  const { value: username } = useField('username', undefined, {
    syncVModel: 'username',
    validateOnMount: Boolean(u.value),
  });
  const { value: password } = useField('password', undefined, {
    syncVModel: 'password',
    validateOnMount: Boolean(p.value),
  });
  const { value: confirmPassword } = useField('confirmPassword', undefined, {
    keepValueOnUnmount: true,
  });

  const submit = handleSubmit(props.submit);
</script>

<template>
  <form @submit.prevent="submit">
    <!-- Identity -->
    <v-text-field
      v-model="identity"
      :error-messages="errors.identity"
      label="Email Address"
      type="email"
      class="mb-4"
      required
    />

    <!-- Username (signup only) -->
    <v-text-field
      v-model="username"
      :error-messages="errors.username"
      label="Username"
      class="mb-4"
      required
    />

    <!-- Password-->
    <v-text-field
      v-model="password"
      :error-messages="errors.password"
      label="Password"
      :type="showPassword ? 'text' : 'password'"
      class="mb-4"
      required
      :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
      @click:append-inner="showPassword = !showPassword"
    />

    <!-- Confirm Password (signup only) -->
    <v-text-field
      v-model="confirmPassword"
      :error-messages="errors.confirmPassword"
      label="Confirm Password"
      :type="showConfirm ? 'text' : 'password'"
      class="mb-4"
      required
      :append-inner-icon="showConfirm ? 'mdi-eye' : 'mdi-eye-off'"
      @click:append-inner="showConfirm = !showConfirm"
    />

    <div class="flex justify-center">
      <v-btn
        type="submit"
        color="primary"
        :disabled="!meta.valid"
        class="justify-center w-48"
        :rounded="1"
      >
        {{ 'Sign Up' }}
      </v-btn>
    </div>
  </form>
</template>

<style lang="scss" scoped></style>
