// Used when grid state is loaded from local storage

export function getStatefulSortFeature(
  localStorageKey: string,
  defaultSorter?: object
) {
  const gridState = localStorage.getItem(`${localStorageKey}State`);
  if (gridState) {
    const parsedSorter = JSON.parse(gridState).sorters;
    if (parsedSorter && parsedSorter[0])
      return {
        sortFeature: {
          multiSort: false,
          ...parsedSorter[0],
        },
      };
  }

  return {
    sortFeature: {
      multiSort: false,
      ...(defaultSorter ?? {}),
    },
  };
}
