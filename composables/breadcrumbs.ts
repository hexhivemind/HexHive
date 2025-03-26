export function useBreadcrumbs() {
  const route = useRoute();
  const router = useRouter();

  const breadcrumbs = computed(() => {
    const segments = route.path.split('/').filter(Boolean); // Remove Empty Segments
    const routes = router.getRoutes();
    return segments.map((segment, index) => {
      const to = '/' + segments.slice(0, index + 1).join('/');
      const title =
        routes.find((r) => r.path === to)?.name?.toString() || segment;
      return {
        title,
        to,
      };
    });
  });

  return { breadcrumbs };
}
