<script lang="ts" setup>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTimes, faCheck } from "@fortawesome/pro-light-svg-icons";
import { faAsterisk } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { defineProps, ref, defineEmits, watch, Ref } from "vue";
import { BodyCreateCategory } from "@/models/Category";
library.add(faTimes, faAsterisk, faCheck);

const props = defineProps<{
  isOpen: boolean;
  type: string;
  category: {
    id?: number;
    isDeleted?: boolean;
    categoryName: string;
    categoryColor: string;
  };
  error: string;
}>();

const emit = defineEmits<{
  (e: "save", body: BodyCreateCategory): void;
  (e: "close"): void;
}>();

const form: Ref<any> = ref(null);

const colors: string[] = [
  "#425AFB",
  "#0376F2",
  "#039BB1",
  "#12CBC4",
  "#27CA37",
  "#C43D97",
  "#A03AFF",
  "#D980FA",
  "#F63057",
  "#FF5094",
  "#FF6600",
  "#F79F1F",
];

const categoryObj: Ref<BodyCreateCategory> = ref({
  categoryName: "",
  categoryColor: "#425AFB",
});

function onSubmit(): void {
  emit("save", categoryObj.value);
}

watch(
  () => props.category,
  (newVal) => {
    if (props.type === "edit") {
      categoryObj.value = JSON.parse(JSON.stringify(newVal));
    } else {
      categoryObj.value.categoryName = '';
      categoryObj.value.categoryColor = "#425AFB";
      setTimeout(() => {
        form.value.resetForm();
      }, 0);
    }
  },
  {
    deep: true,
  }
);

watch(
  () => props.error,
  (newVal) => {
    if (newVal) {
      form.value.setFieldError("Category Name", props.error);
    }
  }
);


function close(): void {
  categoryObj.value.categoryName = '';
  categoryObj.value.categoryColor = "#425AFB";
  setTimeout(() => {
    form.value.resetForm();
  }, 0);
  categoryObj.value = JSON.parse(JSON.stringify(props.category));
  emit("close");
}
</script>

<template>
  <fs-sidebar :visible="isOpen" id="publishPostForm-right" class="publishPostForm" right
    sidebar-class="fsi-sidebar help-center" body-class="help-center__body" no-close-on-esc no-close-on-backdrop
    bg-variant="white" width="392px" shadow header-class="border-bottom" footer-class="border-top" no-header-close>
    <template #title>
      <div class="d-flex justify-content-between py-1">
        <span>{{ type === "add" ? "Add" : "Edit" }} Category</span>
        <fs-link class="text-secondary" tag="a" @click.prevent="close()">
          <font-awesome-icon :icon="['fal', 'times']" size="sm"></font-awesome-icon>
        </fs-link>
      </div>
    </template>
    <div>
      <VeeForm @submit="onSubmit" ref="form" class="form" id="form" v-slot="{ errors }">
        <fs-input :required="true" type="fsTextInput" label="Category name" :maxlength="200"
          v-model="categoryObj.categoryName" name="Category Name" rules="required|max:255"></fs-input>
        <div v-if="categoryObj.categoryName" :class="['category mt-1', {
          'mt-3': errors['Category Name']
        }]" :style="{
  'background-color': categoryObj.categoryColor,
}">
          {{ categoryObj.categoryName }}
        </div>
        <div class="select-color">
          <label class="label" for="title">Select a Color
            <font-awesome-icon class="text-danger ms-1" :icon="['fas', 'asterisk']">
            </font-awesome-icon></label>
          <div class="grid">
            <div class="item" v-for="(color, index) in colors" :key="index" :style="{
              'background-color': color,
            }" @click="categoryObj.categoryColor = color">
              <font-awesome-icon v-if="categoryObj.categoryColor === color" class="text-white" :icon="['fal', 'check']"
                size="lg">
              </font-awesome-icon>
            </div>
          </div>
        </div>
      </VeeForm>
    </div>
    <template #footer>
      <div class="p-3 d-flex justify-content-between">
        <fs-button type="button" variant="outline-secondary" @click="close()">
          CANCEL
        </fs-button>
        <fs-button variant="info" type="submit" form="form"> SAVE </fs-button>
      </div>
    </template>
  </fs-sidebar>
</template>
<style lang="scss" scoped>
.form {
  padding: 20px;

  label {
    font-size: 12px;
    font-weight: 700;
    line-height: 22px;
  }

  .grid {
    display: grid;
    gap: 13px;
    grid-template-columns: auto auto auto auto;

    .item {
      width: 82px;
      height: 51px;
      border-radius: 6px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
    }
  }

  .select-color {
    margin-top: 24px;
  }

  .category {
    text-align: left !important;
    font-size: 14px;
    font-weight: 400;
    line-height: 16.41px;
    border-radius: 20px;
    display: inline-block;
    color: white;
    line-break: anywhere;
    // overflow-wrap: break-word;
    text-align: center;
    padding: 4px, 12px, 4px, 12px;
    max-width: 350px;
  }
}

.message-error {
  margin: 5px 0;
  color: #f23648;
  display: block;
}

:deep(.fs-input__form-group) {
  margin-bottom: 0;
}
</style>
