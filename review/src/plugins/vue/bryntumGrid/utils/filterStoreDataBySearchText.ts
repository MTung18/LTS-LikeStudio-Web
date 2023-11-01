import type { Store } from "@bryntum/grid";

// Originally designed for use with the BryntumSearchBar component
// This will filter the data array of the store, matching on any non-ignored prop
// This overrides, and works in tandem with, per-column filters
export function filterStoreDataBySearchText(
  data: any[],
  nonFilteredProps: string[],
  filterText: string,
  store: Store,
  dropdownProps?: string[],
  dropdownValueProps?: any[]
) {
  const filteredList = data?.filter((x) =>
    x.name?.toLowerCase().includes(filterText.toLowerCase()) ||
    x.description?.toLowerCase().includes(filterText.toLowerCase()));

  store.data = filteredList;
  return filteredList;
}
