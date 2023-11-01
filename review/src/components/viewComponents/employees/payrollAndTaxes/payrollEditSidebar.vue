<script setup lang="ts">
import { defineProps, ref, watch } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faAsterisk } from "@fortawesome/pro-light-svg-icons";
import { Payroll } from "@/models/payroll/Payroll";
import { formatDateInputTime } from "@/utilities/formatUtils";
import { computed } from "vue";
library.add(faAsterisk);

interface Props {
  isShowSidebar: boolean;
  payHistoryDetail?: Partial<Payroll>;
}

// eslint-disable-next-line vue/no-setup-props-destructure
const { isShowSidebar, payHistoryDetail } = defineProps<Props>();
const availableDate = ref(formatDateInputTime(payHistoryDetail.availableToEmployeeOnDate));
const errorMessage = ref("");
const isError = computed(() => {
  if (errorMessage.value) {
    return true
  } else return false
});

const handleChangeInput = (value: string) => {
  const selectedDate = Date.parse(value);
  const payDate = Date.parse(formatDateInputTime(payHistoryDetail.payDate));

  if (selectedDate < payDate) {
    errorMessage.value = "Must be after or equal Pay Date";
  } else {
    errorMessage.value = "";
  }
};

watch(
  payHistoryDetail,
  () => {
    availableDate.value = formatDateInputTime(payHistoryDetail.availableToEmployeeOnDate);
  },
  {
    immediate: true,
  },
);
</script>

<template>
  <fs-sidebar right :shadow="true" :visible="isShowSidebar" no-close-on-esc no-header-close no-close-on-backdrop>
    <template #title>
      <div class="mr-3 d-flex align-items-center">
        <div class="sidebar-header h5 pl-2 my-auto font-weight-bold">Edit Available Date</div>
        <div class="ms-auto">
          <fs-link class="text-secondary" tag="a" @click="$emit('closeSidebar')">
            <font-awesome-icon :icon="['fal', 'times']"></font-awesome-icon>
          </fs-link>
        </div>
      </div>
    </template>

    <div class="px-3 py-4 h-100 bg-white w-100">
      <fs-container class="container-fluid">
        <fs-form>
          <div class="py-3 d-flex">
            <div class="label">Available To Employee On</div>
            <font-awesome-icon :icon="['fal', 'asterisk']" class="text-danger require-icon"></font-awesome-icon>
          </div>
          <div v-if="payHistoryDetail" class="input-date">
            <fs-form-input v-model="availableDate" required type="date" @change="handleChangeInput"></fs-form-input>
            <p class="error-message" v-if="errorMessage">{{ errorMessage }}</p>
          </div>
        </fs-form>
      </fs-container>
    </div>
    <template #footer>
      <div class="d-flex justify-content-between border-top py-3">
        <fs-button variant="outline-secondary" size="small" class="mx-3" @click="$emit('closeSidebar')">Cancel</fs-button>
        <fs-button size="small" variant="success" class="mx-3" :disabled="isError" @click="
          $emit('update-available-date', {
            availableDate
          })
          ">Save</fs-button>
      </div>
    </template>
  </fs-sidebar>
</template>

<style lang="scss" scoped>
:deep(.fs-sidebar) {
  top: 44px;
  height: calc(100vh - 44px);
  width: 400px;
  background-color: #fff;
}

:deep(.b-sidebar-header) {
  padding: 16px;
  background: linear-gradient(0deg, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), #e1e4e8;
}

.sidebar-header {
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;
}

.label {
  font-weight: 700;
  font-size: 14px;
  line-height: 150%;
}

.content_text {
  font-weight: 400;
  font-size: 14px;
  line-height: 150%;
}

.error-message {
  margin-top: 12px;
  color: red;
}
</style>
