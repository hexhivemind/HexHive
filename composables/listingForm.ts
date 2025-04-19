export const useListingForm = () => {
  const { value: title } = useField<ListingData['title']>('title');
  const { value: permissions } =
    useField<ListingData['permissions']>('permissions');
  const { value: description } =
    useField<ListingData['description']>('description');
  const { value: slug } = useField<RomhackData['slug']>('slug');
  // Other ListingData properties are set by server or are not needed at creation.

  const { value: targetedRoms } =
    useField<AssetHive['targetedRoms']>('targetedRoms');
  // Other AssetHive properties are set by server.

  return { title, permissions, description, slug, targetedRoms };
};
