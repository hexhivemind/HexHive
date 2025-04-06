<script setup lang="ts">
  const authMode = ref<'login' | 'signup'>('login');
  const authType = ref<'password' | 'webauthn'>('webauthn');

  const { register, authenticate } = useWebAuthn({
    registerEndpoint: '/api/webauthn/register', // Default
    authenticateEndpoint: '/api/webauthn/authenticate', // Default
  });
  const { fetch: fetchUserSession } = useUserSession();

  const emit = defineEmits<{
    (e: 'submit'): void;
  }>();

  const identity = ref<string>('');
  const username = ref<string>('');
  const password = ref<string>('');

  const isPending = ref(false);
  const errorMessage = ref('');

  const submit = async (values: unknown) => {
    // Minimum loading time after submit. Zero to disable, 400 recommended.
    const MIN_DELAY = 2000;
    const start = Date.now();
    isPending.value = true;
    errorMessage.value = '';

    try {
      if (authType.value === 'webauthn') {
        const { identity, username } = values as {
          identity: string;
          username?: string;
        };
        if (authMode.value === 'signup')
          await register({ userName: identity, displayName: username }).then(
            fetchUserSession,
          );
        else await authenticate(identity).then(fetchUserSession);
      } else {
        // Note: identity not renamed to email because of extra back-end
        // validation, to verify data integrity after submit.
        const { identity, username, password } = values as {
          identity: string;
          username?: string;
          password: string;
        };
        const endpoint =
          authMode.value === 'signup'
            ? '/api/auth/register'
            : '/api/auth/login';

        const body =
          authMode.value === 'signup'
            ? { identity, username, password }
            : { identity, password };

        const { error } = await useFetch(endpoint, {
          method: 'POST',
          body,
        });

        if (error.value) throw error.value;

        await fetchUserSession();
      }
      emit('submit');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const elapsed = Date.now() - start;
      const remaining = Math.max(MIN_DELAY - elapsed, 0);

      setTimeout(
        () =>
          (errorMessage.value =
            error?.data?.message || error?.message || 'Authentication Failed'),
        remaining,
      );
      console.error('[auth]', errorMessage.value);
    } finally {
      const elapsed = Date.now() - start;
      const remaining = Math.max(MIN_DELAY - elapsed, 0);

      setTimeout(() => (isPending.value = false), remaining);
    }
  };
</script>

<template>
  <div class="login-container">
    <div class="content">
      <h2 class="text-xl font-semibold mb-4">
        {{
          authMode === 'signup' ? 'Create an account' : 'Log in to your account'
        }}
      </h2>

      <!-- Tabs for login/signup -->

      <v-tabs v-model="authMode" grow class="mb-4">
        <v-tab :rounded="false" value="login">Login</v-tab>
        <v-tab :rounded="false" value="signup">Sign Up</v-tab>
      </v-tabs>

      <div class="flex justify-center">
        <v-btn-toggle
          v-model="authType"
          :rounded="false"
          mandatory
          class="mb-4 mx-auto"
          divided
        >
          <v-btn value="password">Password</v-btn>
          <v-btn value="webauthn">Passkey</v-btn>
        </v-btn-toggle>
      </div>

      <!-- Loading Overlay -->
      <v-fade-transition>
        <v-overlay
          v-model="isPending"
          contained
          class="z-10 flex items-center justify-center size-full backdrop-blur bg-black/20"
          scrim
        >
          <v-progress-circular
            class="drop-shadow-[0_0_8px_rgba(0,245,255,0.6)]"
            indeterminate
            color="secondary"
            :size="96"
            :width="10"
          />
        </v-overlay>
      </v-fade-transition>

      <!-- Error Message -->
      <v-alert
        v-if="errorMessage"
        type="error"
        variant="tonal"
        density="compact"
        class="mb-4"
      >
        {{ errorMessage }}
      </v-alert>

      <v-expand-transition>
        <LoginFormPasswordLogin
          v-if="authMode === 'login' && authType === 'password'"
          v-model:identity="identity"
          v-model:password="password"
          :submit="submit"
          keep-alive
        />
        <LoginFormPasswordSignup
          v-else-if="authMode === 'signup' && authType === 'password'"
          v-model:identity="identity"
          v-model:username="username"
          v-model:password="password"
          :submit="submit"
        />
        <LoginFormWebauthnLogin
          v-else-if="authMode === 'login' && authType === 'webauthn'"
          v-model:identity="identity"
          :submit="submit"
        />
        <LoginFormWebauthnSignup
          v-else-if="authMode === 'signup' && authType === 'webauthn'"
          v-model:identity="identity"
          v-model:username="username"
          :submit="submit"
        />
      </v-expand-transition>

      <!-- Divider -->
      <v-divider class="divider border-opacity-25 my-6" color="white">
        OR
      </v-divider>

      <!-- OAuth -->
      <div class="oauth-container flex flex-col items-center gap-2">
        <p class="text-gray-400">Continue with</p>
        <v-btn
          color="secondary"
          :rounded="1"
          class="w-48"
          disabled
          prepend-icon="mdi-google"
        >
          Google
        </v-btn>
        <v-btn
          color="secondary"
          :rounded="1"
          class="w-48"
          disabled
          prepend-icon="mdi-github"
        >
          Github
        </v-btn>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .login-container {
    width: 90vw;
    max-width: 30rem;
  }

  .content {
    padding: 1.25rem;
    border: 1px solid #ddd;
    border-radius: 0.5rem;
    position: relative;
  }
</style>
