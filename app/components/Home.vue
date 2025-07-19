<template>
  <v-container>
    <!-- <v-spacer /> -->
    <v-row align="baseline" justify="center">
      <v-col cols="6">
        <v-file-input
          v-model="files"
          label="Upload Files"
          prepend-icon="mdi-paperclip"
          :rules="[filesRequired]"
          multiple
          chip
          show-size
        />
      </v-col>

      <v-col cols="auto">
        <v-btn prepend-icon="mdi-cloud-upload" @click="handleUpload">
          Upload
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
  const files = ref([]);

  const filesRequired = (value: []) =>
    value.length > 0 || 'You must select at least one file.';

  const handleUpload = () => {
    // Handle file upload action here
    console.log('Upload button clicked', files.value);
  };
</script>
