<script setup lang="ts">
import BryntumSearchBar from "@/components/shared/bryntumGrid/bryntumSearchBar.vue";
import { BryntumGrid } from "@bryntum/grid-vue-3";
import Note from "@/models/employees/Note";
import { filterStoreDataBySearchText } from "@/plugins/vue/bryntumGrid/utils/filterStoreDataBySearchText";
import { Grid } from "@bryntum/grid";
import { Ref, ref, computed, onMounted, watch, ComputedRef, isReadonly } from "vue";
import DetailsPanelInfo from "@/models/detailsPanelInfo";
import { useEmployeeNotesStore } from '@/stores/EmployeeNotesStore';
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import { formatUTCToLocalDate } from "@/functions/DateUtilityFunctions";
import { PanelConfig, ActionPlacement, PanelActionConfig } from "@/models/panelConfig";
import { useAlerts } from "@/composables/useAlerts";
import { faExternalLink, faStickyNote, faTrash } from "@fortawesome/pro-light-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import deleteConfirmationModal from '@/components/shared/deleteConfirmationModal.vue';
import detailsPanel from '@/components/shared/detailsPanel/detailsPanel.vue';
import employeeCreateNotePanel from '@/components/viewComponents/employees/employeeCreateNotePanel.vue';
import { useBryntumGridSearchFilter } from "@/composables/useBryntumGridSearchFilter";
import { MESSAGE } from "@/data/message";

library.add(
  faStickyNote,
  faExternalLink,
  faTrash
);

interface Props {
  readOnly: boolean;
  showCreate: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  readOnlyGrid: true,
  showCreate: true
});

//#region Store Initialization
const employeeNotesStore = useEmployeeNotesStore();
const { employeeNotes } = storeToRefs(employeeNotesStore);
////#endregion Store Initialization

const route = useRoute();
const { notifySuccess, notifyError } = useAlerts();

let showCreateNotePanel = ref(false);
const showPanel = ref(false);
const showDeleteModal = ref(false);
const noteToBeDelete: Ref<Note> = ref();

const selectedNote: Ref<any> = ref();
const employeeId: ComputedRef<string> = computed(() => route.params?.id?.toString());

const detailsPanelConfig = ref(new PanelConfig({
  showFooter: true,
  showHeader: false,
  title: MESSAGE.NOTES.VIEW_NOTE,
  actions: [
    new PanelActionConfig(
      {
        name: MESSAGE.NOTES.DELETE_NOTE,
        icon: ['fal', 'fa-trash-can'],
        handler: onDeleteClickFromPanel,
        placement: ActionPlacement.Footer,
        variant: 'danger'
      }
    )
  ]
}));

const actionColumn = {
  flex: 1,
  type: "action",
  id: "action",
  text: "Actions",
  minWidth: 200,
  columnDragToolbar: false,
  enableHeaderContextMenu: false,
  enableCellContextMenu: false,
  cellCls: "b-action-cell--hover",
  actions: [
    {
      visible: true,
      renderer: () => {
        return '<i class="b-action-item b-fa b-fa-external-link btn btn-link text-success no-underline"><span>View</span></i>';
      },
      onClick: onViewNoteClick,
    },
    {
      visible: true,
      renderer: () => {
        return '<i class="b-action-item b-fa b-fa-trash-alt btn btn-link text-red no-underline"><span>Delete</span></i>';
      },
      onClick: onDeleteNoteClick,
    },
  ],
};

const grid: Ref<Grid> = ref(null);
const gridFeatures = computed(() => (grid as any).value?.instance.value.features);
const gridLocalStorageKey = "noteListGrid";
const defaultSorter = {
  field: "date",
  descending: true,
};

const {
  filteredData,
  defaultGridConfig,
  statefulFilterFeature,
  statefulSortFeature,
  filterCount,
  searchText,
  gridStore,
  saveGridSettings,
  clearGridSettings,
  hideFilterBar,
  populateBryntumStore
} = useBryntumGridSearchFilter<Note>(gridFeatures, gridLocalStorageKey, defaultSorter, filterBryntumStore);

const gridConfig = ref({
  ...defaultGridConfig,
  ...statefulFilterFeature,
  ...statefulSortFeature,
  minHeight: "100%",
  emptyText: MESSAGE.NOTES.NO_RECORD,
  columns: [
    {
      flex: 1,
      text: 'Date',
      id: 'date',
      field: 'date',
      groupable: false,
      renderer: ({ row, value }) => {
        return formatUTCToLocalDate(value);
      }
    },
    {
      flex: 1,
      text: 'Created By',
      id: 'createdBy',
      field: 'createdBy',
      groupable: false,
    },
    {
      flex: 1,
      text: 'Title',
      id: 'title',
      field: 'title',
      groupable: false,
      renderer: ({ row, value }) => {
        row.eachElement(el => el.style.background = '#ffffff');
        return value;
      }
    },
    {
      flex: 2,
      text: 'Notes',
      id: 'note',
      field: 'note',
      groupable: false,
    },
    // Add the action column when it is not readonly
    ...(!props.readOnly ? [actionColumn] : [])
  ]
});

const nonFilteredProps = ["id"];

function filterBryntumStore() {
  filterStoreDataBySearchText(
    filteredData.value,
    nonFilteredProps,
    searchText.value,
    gridStore.value
  );
}

//#region Details Panel
function onViewNoteClick(event: any): void {
  if (event.record.data) {
    detailsPanelConfig.value.source = event.record.data;
    selectedNote.value = DetailsPanelInfo.ConvertNotes(event.record.data);
    showPanel.value = true;
  }
}
//#endregion Details Panel

//#region Delete
async function onDeleteNoteClick(event: any): Promise<void> {
  if (event.record.data) {
    noteToBeDelete.value = event.record.data;
    showDeleteModal.value = true;
  }
}

async function onDeleteClickFromPanel(source: any): Promise<void> {
  if (source) {
    noteToBeDelete.value = source;
    showDeleteModal.value = true;
    showPanel.value = false;
  }
}

async function proceedDelete(): Promise<void> {
  if (noteToBeDelete.value) {
    await deleteNote(noteToBeDelete.value.id);
    await refreshNoteList();
  }
}

function cancelDelete() {
  showDeleteModal.value = false;
  noteToBeDelete.value = null;
}

async function deleteNote(id: number): Promise<void> {
  if (await employeeNotesStore.deleteEmployeeNote(id)) {
    notifySuccess(MESSAGE.NOTES.DELETE_SUCCESS);
  } else {
    notifyError(MESSAGE.NOTES.DELETE_ERROR);
  }
}
//#endregion Delete

//#region Create
async function onCreateNote() {
  refreshNoteList();
}
//#endregion Create

async function refreshNoteList() {
  await employeeNotesStore.fetchEmployeeNotes(+employeeId.value);
  filteredData.value = employeeNotes.value;
  populateBryntumStore();
  if (searchText.value !== "") {
    filterBryntumStore();
  }
}

onMounted(async () => {
  await refreshNoteList();
});

</script>
<template>
  <div class="hq-pg__grid large-header">
    <bryntumSearchBar title="Notes" :local-storage-key="gridLocalStorageKey" :show-settings-button="true"
      :show-search-button="true" :show-filter-button="true" :show-refresh-button="false" :show-footer-search="false"
      @save-settings="saveGridSettings()" @clear-settings="clearGridSettings()" @hide-filter-bar="hideFilterBar()"
      @show-filter-bar="gridFeatures.filterBar.showFilterBar()" @search-text-input="searchText = $event">
      <template #buttons v-if="showCreate">
        <fs-button variant="btn-primary ms-0" class="btn btn-primary" @click="showCreateNotePanel = true">Create
          Note</fs-button>
      </template>
    </bryntumSearchBar>
    <div class="action-grid list__table list__table--onpage list__b-grid--hover">
      <bryntum-grid v-bind="gridConfig" :store="gridStore" ref="grid" />
    </div>

    <template v-if="!readOnly">
      <details-panel :details="selectedNote" v-model:showPanel="showPanel" :config="detailsPanelConfig"></details-panel>

      <delete-confirmation-modal v-model:showDeleteModal="showDeleteModal" :title="`Delete Note Confirmation`"
        :type="`Note`" @OK="proceedDelete" @CANCEL="cancelDelete">
        <span>
          {{ MESSAGE.NOTES.DELETE_MESSAGE }}
        </span>
        <br />
        <span v-if="noteToBeDelete">
          <i class="me-2 mt-2 b-fa b-fa-sticky-note text-success no-underline"></i>
          <b>{{ `${formatUTCToLocalDate(noteToBeDelete.date)} | ${noteToBeDelete.title} ` }}</b>
        </span>
      </delete-confirmation-modal>
    </template>

    <template v-if="showCreate">
      <employeeCreateNotePanel v-if="showCreate" v-model:showCreateNotePanel="showCreateNotePanel"
        @noteUpdated="onCreateNote" />
    </template>

  </div>
</template>

