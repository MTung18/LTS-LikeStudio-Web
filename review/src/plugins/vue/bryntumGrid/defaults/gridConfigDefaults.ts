import type {
  GridConfig,
  GridFeaturesConfigType,
  StoreConfig,
} from "@bryntum/grid";

export type FSBryntumGridConfig = {
  gridConfig: Partial<GridConfig>;
  gridFeaturesConfig: Partial<GridFeaturesConfigType>;
  gridStoreConfig: Partial<StoreConfig>;
};

const gridFeatureDefaults: Partial<GridFeaturesConfigType> = {
  cellEdit: false,
  cellMenu: false,
  columnPicker: false,
  columnReorder: true,
  filterBar: {
    // @ts-ignore
    hidden: true, // This prop exists even if the type doesn't expose
    prioritizeColumns: true,
  },
  headerMenu: {
    moveColumns: false,
    items: {
      columnPicker: false,
      hideColumn: false,
      toggleFilterBar: false,
    },
  },
  rowReorder: false,
  sort: {
    multiSort: false,
  },
};

// The Vue version of the grid expects each feature prop to be individually listed for reactivity
// When supplied in this format each feature prop needs to have "Feature" added to its key
function mapVueFeatureProps(config: Partial<GridFeaturesConfigType>) {
  let vueFeatureConfig = {};
  for (const key in config) {
    vueFeatureConfig = {
      ...vueFeatureConfig,
      [`${key}Feature`]: config[key as keyof typeof config],
    };
  }
  return vueFeatureConfig;
}

const gridStoreDefaults: Partial<StoreConfig> = {
  useRawData: true, // Boosts record creation performance of the store by requiring correctly formatted data
};

const gridConfigDefaults: Partial<GridConfig> = {
  autoHeight: false, // This will cause a massive performance hit in large grids if enabled
  columnLines: false,
  fixedRowHeight: true, // Opt out of supporting variable row height to prevent long render times
  store: gridStoreDefaults,
  ...mapVueFeatureProps(gridFeatureDefaults),
};

// Use these by applying the spread iterator "..."
// Any property can be overridden by reassigning it after the spread iterator
export const fsBryntumGridConfig: FSBryntumGridConfig = {
  gridConfig: gridConfigDefaults,
  gridFeaturesConfig: gridFeatureDefaults,
  gridStoreConfig: gridStoreDefaults,
};
