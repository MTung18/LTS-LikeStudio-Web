<script setup lang="ts">
import { PayStubDateT } from "@/models/hrmSettings/payrollAndTax/payStub/payStubDate";
import { useSettingsStore } from "@/stores/settingsStore";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faAsterisk } from "@fortawesome/pro-solid-svg-icons";
import { storeToRefs } from "pinia";
import { defineProps, onMounted, ref, watch } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useAlerts } from "@/composables/useAlerts";
import FsInput from '@/components/global/fsInput/fsInput.vue';
import moment from "moment";
library.add(faAsterisk);
const { changePayStub, addPayStub } = useSettingsStore();
const { notifyError, notifySuccess } = useAlerts();
type SidebarT = "EDIT" | "ADD";

interface Props {
  sidebarType: SidebarT;
  isShowSidebar?: boolean;
  payStubId?: number;
  payStubData?: PayStubDateT;
}

const formatDate = (input: string) => {
  return moment(input).format("MM/DD/YYYY");
};

const props = defineProps<Props>();

const { fetchPayStub } = useSettingsStore();
const { payStubList } = storeToRefs(useSettingsStore());
const payStub = ref<PayStubDateT>({} as PayStubDateT);

const enum EmitNames {
  CLOSE = "closeSidebar",
  ADD = "addPayStub",
  UPDATE = "updatePayStub",
}

const form = ref({
  payDate: "",
  availableToEmployeeOnDate: "",
});

const formData = ref(null);

watch(payStub, () => {
  form.value = {
    payDate: formatDate(payStub.value?.payDate),
    availableToEmployeeOnDate: formatDate(
      payStub.value?.availableToEmployeeOnDate
    ),
  };
});

watch(
  () => props.payStubId,
  async () => {
    await refreshData();
  }
);

const onClose = async () => {
  emit(EmitNames.CLOSE);
  if (props.sidebarType === "ADD") {
    form.value = {
      payDate: "",
      availableToEmployeeOnDate: "",
    };
    isEditingPaydate.value = false;
  } else {
    await refreshData();
  }
};
const triggerPayDate = ref(true);
const addPaydate = async () => {
  const { valid } = await formData.value.validate();
  if (!valid) {
    return;
  }
  const response = await addPayStub(form.value);
  if (response.success) {
    emit(EmitNames.CLOSE);
    emit(EmitNames.ADD);
    notifySuccess("Available Date Added.")
  } else if (response.status === 400) {
    triggerPayDate.value = false;
  } else {
    emit(EmitNames.CLOSE);
    notifyError(`${response.errorMessage}`, null, "Error")
  }
};

const onUpdatePaydate = async () => {
  const response = await changePayStub({
    payStubDate: form.value,
    payStubId: props.payStubId,
  });
  if (response.success) {
    emit(EmitNames.CLOSE);
    emit(EmitNames.UPDATE);
    notifySuccess("Available Date Updated.")
  } else {
    emit(EmitNames.CLOSE);
    notifyError(`${response.errorMessage}`, null, "Error")
  }
};

const emit = defineEmits<{
  (e: EmitNames, param?: any): void;
}>();

const isEditingPaydate = ref(false);

const refreshData = async () => {
  await fetchPayStub();
  payStub.value = payStubList.value.find((ps) => ps.payStubSettingId === props.payStubId);
};

onMounted(async () => {
  if (props.sidebarType === "EDIT" && payStubList) {
    await refreshData();
    form.value = {
      payDate: formatDate(payStub.value?.payDate),
      availableToEmployeeOnDate: formatDate(
        payStub.value?.availableToEmployeeOnDate
      ),
    };
  }
});
</script>

<template>
  <fs-sidebar right :shadow="true" :visible="isShowSidebar" no-close-on-esc no-header-close no-close-on-backdrop>
    <template #title>
      <div class="mr-3 d-flex align-items-center">
        <h2 class="h4 pl-2 my-auto fw-bold">
          {{
            `${props.sidebarType === "EDIT"
              ? `Edit Available Date`
              : `Add Available Date`
              }`
          }}
        </h2>
        <div class="ms-auto">
          <fs-link class="text-secondary" tag="a" @click="onClose">
            <font-awesome-icon :icon="['fal', 'times']"></font-awesome-icon>
          </fs-link>
        </div>
      </div>
    </template>

    <div class="px-3 py-4 bg-white w-100 h-100">
      <VeeForm ref="formData">
        <fs-form-group>
          <fs-container>
            <fs-row class="mt-3 d-flex align-items-center">
              <fs-input type="fsDateInput" label="Pay Date" :required="true" rules="required|date|afterToday" name="Pay date"
                v-model="form.payDate" id="payDate" :disabled="props.sidebarType === 'EDIT' ? true : false"
                @change="triggerPayDate = true"></fs-input>
              <span v-show="!triggerPayDate" class="message-error">Duplicate Pay Date</span>
            </fs-row>
            <fs-row class="mt-3 d-flex align-items-center">
              <fs-input type="fsDateInput" name="Available date" label="Available Date" id="availableDate" :required="true"
                v-model="form.availableToEmployeeOnDate" rules="required|date|dateAfterTarget:Pay date,Pay date"></fs-input>
            </fs-row>
          </fs-container>
        </fs-form-group>
      </VeeForm>
    </div>

    <template #footer>
      <div class="d-flex justify-content-between border-top py-3">
        <fs-button size="small" variant="outline-secondary" class="mx-3 text-capitalize" @click="onClose">Cancel
        </fs-button>
        <fs-button size="small" variant="success" class="mx-3 text-capitalize" @click="
          props.sidebarType === 'EDIT' ? onUpdatePaydate() : addPaydate()
          ">Save
        </fs-button>
      </div>
    </template>
  </fs-sidebar>
</template>

<style lang="scss" scoped>
.message-error {
  margin: 5px 0;
  color: #f23648;
}

:deep(.fs-sidebar) {
  top: 44px;
  height: calc(100vh - 44px);
  width: 400px;
  background-color: #fff;
}

:deep(.b-sidebar-header) {
  padding: 16px;
  background: linear-gradient(0deg,
      rgba(255, 255, 255, 0.5),
      rgba(255, 255, 255, 0.5)),
    #e1e4e8;
}

.label {
  font-weight: 700;
  font-size: 14px;
  line-height: 150%;
}

input {
  height: 35px;
  border-radius: 4px;
  border: 1px solid #a7b0bc;
  padding: 0 10px;
}

input:focus-visible {
  outline: none;
}

.content_text {
  font-weight: 400;
  font-size: 14px;
  line-height: 150%;
}

:deep(.fs-input__form-group, .b-field-inner) {
  margin: 0;
  padding: 16px 0;
}
</style>
