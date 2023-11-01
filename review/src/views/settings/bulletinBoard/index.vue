<script setup lang="ts">
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPlus } from "@fortawesome/pro-light-svg-icons";
import BryntumSearchBar from "@/components/shared/bryntumGrid/bryntumSearchBar.vue";
import { BryntumGrid } from "@bryntum/grid-vue-3";
import { fsBryntumGridConfig } from "@/plugins/vue/bryntumGrid/defaults/gridConfigDefaults";
import { Popup, Store, Tooltip, Button } from "@bryntum/grid";
import { useCategoryStore } from "@/stores/categoryStore";
import { storeToRefs } from "pinia";
import { ref, onMounted, reactive, Ref } from "vue";
import { useAlerts } from "@/composables/useAlerts";
import {
  BodyCreateCategory,
  DataAddOrEditCategory,
  ResponseAddOrEditError,
} from "@/models/Category";
import addOrEdit from "@/components/viewComponents/settings/bulletinBoard/addOrEdit.vue";

library.add(faPlus);
const categoryStore = useCategoryStore();
const { categoryList } = storeToRefs(categoryStore);
const addOrEditCategoryData = reactive<DataAddOrEditCategory>({
  isOpen: false,
  type: "add",
  category: {
    categoryName: "",
    categoryColor: "#424987",
  },
  error: "",
});

const { notifySuccess, notifyError } = useAlerts();

const getTitle = (data: BodyCreateCategory) => {
  return `<div class="category" style="background-color:${data.categoryColor};">${data.categoryName}</div>`;
};

const renderHTMLDelete = (data) => {
  let disabled = "";
  if (data.isActive) {
    disabled = "disabled-btn";
  }

  renderDisabledDeleteTooltip(data);
  return `<div class="b-action-item b-fa b-fa-trash-alt btn-delete deleteBulletinBtn ms-2 ${disabled}">
    </div>`;
};



const categoryLocalStorageKey = "categoryList";

const gridConfig = ref({
  ...fsBryntumGridConfig.gridConfig,
  minHeight: "80vh",
  emptyText: "",
  columns: [
    {
      flex: 8,
      text: "Category",
      id: "category",
      field: "categoryName",
      htmlEncode: false,
      cellCls: 'ps-4',
      cls: 'ps-4',
      renderer: ({ record }) => `${getTitle(record.data)}`,
    },
    {
      flex: 2,
      text: "Actions",
      type: "action",
      cellCls: "b-action-cell--hover",
      actions: [
        {
          renderer: ({ action, record }) => `
                <div class="b-action-item b-fa b-fa-edit btn-edit updateBulletinBtn btn-link"></div>`,
          onClick: ({ record }) => addOrEditCategory("edit", record.data),
        },
        {
          renderer: ({ action, record }) => renderHTMLDelete(record.data),
          onClick: ({ record }) => deleteBulletin(record),
        },
      ],
    },
  ],
});

const gridStore: Ref<Store> = ref(
  new Store({
    ...fsBryntumGridConfig.gridStoreConfig,
  })
);

onMounted(async () => {
  await categoryStore.fetchCategories();
  gridStore.value.data = categoryList.value.sort((a, b) => (a.categoryName.toLowerCase() > b.categoryName.toLowerCase()) ? 1 : -1);
});

function deleteBulletin(record: any) {
  if (record.data.isActive) {
    return;
  }

  addOrEditCategoryData.category.categoryName = record.data.categoryName;
  const popup = new Popup({
    header: "Delete Category",
    autoShow: false,
    centered: true,
    closeAction: "destroy",
    closable: true,
    autoClose: false,
    width: "500px",
    cls: "popup-delete",
    modal: true,
    bbar: {
      items: {
        cancel: {
          text: "CANCEL",
          minWidth: 100,
          onAction: () => {
            popup.close();
          },
        },
        delete: {
          text: "DELETE",
          minWidth: 100,
          cls: "b-raised b-red",
          onAction: async () => {
            const res = await categoryStore.deleteCategory(record.data.postCategoryId);
            if (!res) {
              notifyError("Category deleted fail.");
            } else {
              notifySuccess("Category deleted.");
              await categoryStore.fetchCategories();
              gridStore.value = {
                data: categoryList.value.sort((a, b) => (a.categoryName.toLowerCase() > b.categoryName.toLowerCase()) ? 1 : -1),
              } as any;
            }
            addOrEditCategoryData.category.categoryColor = ''
            popup.close();
          },
        },
      },
    },
    html: `<i class="b-fa b-fa-exclamation-circle icon-exclamation-circle"></i>
                    <div class="item-text">
                      <p>Are you sure you want to delete the <b>${addOrEditCategoryData.category.categoryName}</b> category?</p>
                    </div>`,
  });
  popup.show();
}

function renderDisabledDeleteTooltip(data) {
  new Tooltip({
    forSelector: `.disabled-btn`,
    html: "Cannot delete. There are posts under this category.",
    hideDelay: 0,
    bodyCls: {
      "tooltip-category": 1,
    },
  });
}

function addOrEditCategory(type = "add", category = null): void {
  addOrEditCategoryData.isOpen = true;
  addOrEditCategoryData.type = type;
  if (type == "edit") {
    addOrEditCategoryData.category = category;
  } else {
    addOrEditCategoryData.category = {
      categoryName: "",
      categoryColor: "#425AFB",
    };
  }
}

async function handleAddOrEdit(data: BodyCreateCategory) {
  addOrEditCategoryData.error = "";
  if (addOrEditCategoryData.type === "add") {
    const obj: ResponseAddOrEditError = await categoryStore.createCategory(
      data
    );

    if (obj.status === 400) {
      addOrEditCategoryData.error = obj.detail;
    } else {
      notifySuccess("Category added.");
      addOrEditCategoryData.isOpen = false;
    }
  } else if (addOrEditCategoryData.type === "edit") {
    const obj: ResponseAddOrEditError = await categoryStore.editCategory(data);
    if (obj.status === 400) {
      addOrEditCategoryData.error = obj.detail;
    } else {
      notifySuccess("Category edited.");
      addOrEditCategoryData.isOpen = false;
    }
  }
  await categoryStore.fetchCategories();

  gridStore.value = {
    data: categoryList.value.sort((a, b) => (a.categoryName.toLowerCase() > b.categoryName.toLowerCase()) ? 1 : -1),
  } as any;
}
</script>

<template>
  <div id="bulletin-board-settings" class="hq-pg list">
    <div class="list__table">
      <BryntumSearchBar title="Category Management">
        <template #buttons>
          <button @click="addOrEditCategory('add')" class="btn btn-add">
            ADD CATEGORY
          </button>
        </template>
      </BryntumSearchBar>
      <bryntum-grid :local-storage-key="categoryLocalStorageKey" v-bind="gridConfig" :store="gridStore" ref="grid" />
      <addOrEdit :error="addOrEditCategoryData.error" :type="addOrEditCategoryData.type"
        :isOpen="addOrEditCategoryData.isOpen" :category="addOrEditCategoryData.category" @save="handleAddOrEdit" @close="
          addOrEditCategoryData.isOpen = false;
        addOrEditCategoryData.error = '';
        " />
    </div>
  </div>
</template>