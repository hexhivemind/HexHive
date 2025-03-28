type UpdateMode = 'auto' | 'notify' | 'manual';

export const useSettingsStore = defineStore('settings', () => {
  // This will eventually be user-configurable, but this is the default global value.
  const updateMode = ref<UpdateMode>('notify');

  // Not strictly needed, as it can be updated manually, but here for brevity.
  function setUpdateMode(mode: UpdateMode) {
    updateMode.value = mode;
  }

  return { updateMode, setUpdateMode };
});
