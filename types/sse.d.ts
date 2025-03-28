declare type SseCallback<T extends ListingData> = (
  payload: ListEntry<T>,
) => void;
