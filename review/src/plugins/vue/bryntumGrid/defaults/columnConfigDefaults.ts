import type { ActionColumnConfig, ColumnConfig } from "@bryntum/grid";

export type FSBryntumColumnConfig = {
  columnConfig: Partial<ColumnConfig>;
  actionColumnConfig: Partial<ActionColumnConfig>;
};

const columnConfigDefaults: Partial<ColumnConfig> = {
  autoHeight: false, // This will cause a massive performance hit in large grids if enabled
  filterable: true,
  draggable: false,
  editor: false,
  enableCellContextMenu: false,
  flex: 1,
  groupable: false,
  readOnly: true,
  resizable: false,
  searchable: false,
  sortable: true,
};

const actionColumnConfigDefaults: Partial<ActionColumnConfig> = {
  ...columnConfigDefaults,
  type: "action",
  filterable: false,
  headerMenuItems: {},
  searchable: false,
  sortable: false,
};

// Use these by applying the spread iterator "..."
// Any property can be overridden by reassigning it after the spread iterator
export const fsBryntumColumnConfig: FSBryntumColumnConfig = {
  columnConfig: columnConfigDefaults,
  actionColumnConfig: actionColumnConfigDefaults,
};
