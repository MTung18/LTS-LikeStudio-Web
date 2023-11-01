<script setup lang="ts">

import { BryntumGrid } from "@bryntum/grid-vue-3";
import { ref, onMounted, Ref} from "vue";
import { storeToRefs } from "pinia";
import { usePermissionGroupStore } from "@/stores/settings/permissionGroupStore";
import { Store } from "@bryntum/grid";
import { useRouter } from "vue-router";
import { stringCaseInsensitiveComparer } from "@/functions/SorterFunctions";

const { fetchPermissionGroupList } = usePermissionGroupStore();
const { permissionGroupList } = storeToRefs(usePermissionGroupStore());

const gridStore: Ref<Store> = ref(new Store());
const router = useRouter();

const isLoading = ref(false);

onMounted(async () => {
  isLoading.value = true;

  await fetchPermissionGroupList();

  gridStore.value.data = permissionGroupList.value;
  gridStore.value.sort({field: 'name', ascending: true});

  isLoading.value = false;
});

const gridConfig = ref({
  autoHeight: true,
  emptyText: "",
  columns: [
    {
      flex: 2,
      text: "Name",
      id: "name",
      field: "name",
      sortable: (record1: any, record2: any) => stringCaseInsensitiveComparer(record1.name, record2.name),
      groupable: false,
      cellCls: 'ps-3',
      cls: 'ps-3',
    },
    {
      flex: 2,
      text: "Description",
      id: "description",
      field: "description",
      sortable: (record1: any, record2: any) => stringCaseInsensitiveComparer(record1.description, record2.description),
      groupable: false,
    },
    {
      flex: 1,
      text: "Users",
      id: "userCount",
      field: "userCount",
      sortable: true,
      groupable: false,
    }
  ],
  sortFeature : {
      prioritizeColumns : true
  }
});

function onCellClick(event: any): void {
  router.push({
    name: 'permissionGroupDetails',
    params: {
      permissionGroupId : event.record.data.id
    }
  });
};

</script>

<template>
  <div>
    <fs-overlay
      :show="isLoading"
      spinner-variant="primary"
      class="fsi-pg__overlay"
      no-wrap
    />
    <div class="list__table b-stripe-vertical b-stripe-horizontal b-grid-header-no-border">
      <bryntum-grid :readOnly="true" v-bind="gridConfig" :store="gridStore" @cellClick="onCellClick"/>
    </div>
  </div>
</template>