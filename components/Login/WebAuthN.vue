<script setup lang="ts">
  import { toTypedSchema } from '@vee-validate/zod';
  import { loginValidator } from '~/shared/zod';

  const { register, authenticate } = useWebAuthn({
    registerEndpoint: '/api/webauthn/register', // Default
    authenticateEndpoint: '/api/webauthn/authenticate', // Default
  });
  const { fetch: fetchUserSession } = useUserSession();

  const { handleSubmit, meta, errors } = useForm({
    validationSchema: toTypedSchema(loginValidator('webauthn')),
  });

  const { value: email } = useField('email');

  // This is registration, not login.
  const submit = (mode: 'signup' | 'login') =>
    handleSubmit(async (values) => {
      // alert(`Form submitted with: ${JSON.stringify(values, null, 2)}`);
      switch (mode) {
        case 'signup':
          await register({ userName: values.email }).then(fetchUserSession);
          break;
        case 'login':
          await authenticate(values.email).then(fetchUserSession);
          break;
      }
    })();

  // const switchToLogin = () => {
  //   alert('Switching to login page (implement routing logic here).');
  // };
</script>

<template>
  <div class="login-container">
    <div class="content">
      <h2>Create an account</h2>

      <form @submit.prevent="() => submit('signup')">
        <div class="form-group">
          <v-text-field
            v-model="email"
            :error-messages="errors.email"
            label="Email address"
            required
          />
        </div>

        <v-btn type="submit" :disabled="!meta.valid"> Sign-up </v-btn>
        <v-btn
          type="submit"
          :disabled="!meta.valid"
          @click="() => submit('login')"
        >
          Login
        </v-btn>

        <!-- <div>
          Already have an account? <a href="#" @click="switchToLogin">Login</a>
        </div> -->
      </form>

      <v-divider class="divider border-opacity-25" color="white">
        OR
      </v-divider>

      <div class="oauth-container">
        <p>oauth here</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .content {
    padding: 1.25rem;
    border: 1px solid #ddd;
    border-radius: 0.5rem;
  }
</style>
