<script lang="ts" setup>
  definePageMeta({
    name: 'Assets',
    layout: 'listings',
    key: (route) => route.fullPath,
  });

  const title = useState('title');
  title.value = 'Assets';
</script>
