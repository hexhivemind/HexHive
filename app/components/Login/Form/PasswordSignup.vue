<script lang="ts" setup>
  import { passwordValidator } from '~~/shared/zod';

  const validator = passwordValidator
    .extend({
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ['confirmPassword'],
      error: "Password doesn't match",
    });

  // const { handleSubmit, meta, errors } = useForm({
  //   validationSchema: toTypedSchema(
  //     passwordValidator
  //       .extend({
  //         confirmPassword: z.string(),
  //       })
  //       .refine((data) => data.password === data.confirmPassword, {
  //         path: ['confirmPassword'],
  //         error: "Password doesn't match",
  //       }),
  //   ),
  // });

  const props = defineProps<{
    submit: (values: unknown) => void;
  }>();

  const i = defineModel<string>('identity', { default: '' });
  const u = defineModel<string>('username', { default: '' });
  const p = defineModel<string>('password', { default: '' });

  const showPassword = ref(false);

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

  // const submit = handleSubmit(props.submit);
  const submit = async () => {
    await props.submit({
      identity: identity.value,
      username: username.value,
      password: password.value,
      confirmPassword: confirmPassword.value,
    });
  };

  const valid = computed(
    () =>
      validator.safeParse({
        identity: identity.value,
        username: username.value,
        password: password.value,
        confirmPassword: confirmPassword.value,
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

    <!-- Password-->
    <v-text-field
      v-model="password"
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
      label="Confirm Password"
      :type="showPassword ? 'text' : 'password'"
      class="mb-4"
      required
      :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
      @click:append-inner="showPassword = !showPassword"
    />

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
