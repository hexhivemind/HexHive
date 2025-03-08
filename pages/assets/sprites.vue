<script lang="ts" setup>
  definePageMeta({
    name: 'Sprites',
    layout: 'listings',
    key: (route) => route.fullPath,
  });

  const title = useState('title');
  title.value = 'Sprites';
</script>
