// Used when grid state is loaded from local storage

import type { FilterBarConfig } from "@bryntum/grid";

export function getStatefulFilterFeature(
  localStorageKey: string
): { filterBarFeature: Partial<FilterBarConfig> } | {} {
  const gridState = localStorage.getItem(`${localStorageKey}State`);
  if (gridState) {
    const parsedFilters = JSON.parse(gridState).filters ?? [];
    if (parsedFilters.length > 0) {
      return {
        filterBarFeature: {
          // @ts-ignore
          hidden: true, // This prop exists even if the type doesn't expose
          prioritizeColumns: true,
          filter: parsedFilters,
        },
      };
    }
  }
  // When spread iterator is applied over the return this won't reassign any defaults
  return {};
}
