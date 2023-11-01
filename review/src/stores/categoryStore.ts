import { acceptHMRUpdate, defineStore } from "pinia";
import { ref } from "vue";
import type { Ref } from "vue";
import {
  Category,
  BodyCreateCategory,
  ResponseAddOrEditError,
} from "@/models/Category";
import { categoryApi } from "@/axios/instances/categoryApi";
export const useCategoryStore = defineStore("category", () => {
  const categoryList: Ref<Category[]> = ref([]);

  async function fetchCategories(): Promise<void> {
    categoryList.value = await categoryApi.getCategories();
    if (categoryList.value.length === 0) {
      await categoryApi.createDefaultCategories();
      categoryList.value = await categoryApi.getCategories();
    }
  }

  async function createCategory(
    body: BodyCreateCategory
  ): Promise<ResponseAddOrEditError> {
    return categoryApi.createCategory(body);
  }

  async function editCategory(
    body: BodyCreateCategory
  ): Promise<ResponseAddOrEditError> {
    return categoryApi.editCategory(body);
  }

  async function deleteCategory(id: number): Promise<boolean> {
    return categoryApi.deleteCategory(id);
  }



  return {
    categoryList,
    fetchCategories,
    createCategory,
    editCategory,
    deleteCategory,
  };
});
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCategoryStore, import.meta.hot));
}
