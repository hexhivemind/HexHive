<template>
  <v-row>
    <v-col>
      <v-file-input
        label="Upload Files"
        prepend-icon="mdi-paperclip"
        :rules="[filesRequired]"
        v-model="files"
        multiple
        chip
        show-size
      />
    </v-col>

    <v-col>
      <v-btn prepend-icon="mdi-cloud-upload" @click="handleUpload">
        Upload
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
  export default {
    data() {
      return {
        files: [],
        filesRequired: (value) =>
          value.length > 0 || 'You must select at least one file.',
      };
    },
    methods: {
      handleUpload() {
        // Handle file upload action here
        console.log('Upload button clicked', this.files);
      },
    },
  };
</script>
