<script setup>
  import { ref, watch } from 'vue';
  import { useField, useForm } from 'vee-validate';
  import { required, email } from '@vee-validate/rules';

  const { handleSubmit } = useForm();

  const { value: emailField, errorMessage } = useField('email', [
    required,
    email,
  ]);

  const formValid = ref(false);

  const checkValid = () => {
    formValid.value = !errorMessage;
  };

  const submit = handleSubmit((values) => {
    alert(`Form submitted with: ${JSON.stringify(values, null, 2)}`);
  });

  // const switchToLogin = () => {
  //   alert('Switching to login page (implement routing logic here).');
  // };

  watch(() => errorMessage, checkValid);
</script>

<template>
  <div class="container">
    <div class="content">
      <h2>Create an account</h2>

      <form @submit.prevent="submit">
        <div class="form-group">
          <v-text-field
            v-model="emailField"
            :error-messages="errorMessage"
            label="Email address"
            required
          />
        </div>

        <v-btn type="submit" :disabled="formValid">Continue</v-btn>

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
