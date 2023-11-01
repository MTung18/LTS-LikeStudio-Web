<script lang="ts" setup>
import { faAsterisk } from "@fortawesome/pro-solid-svg-icons";
import { computed, ref, Ref, watch } from "vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import { DeductionMode } from "@/enums/DeductionMode";
import { Deduction } from "@/models/benefitsDeductions/Deduction";
import { EmitNames } from "@/enums/EmitName";
import { DeductionType } from "@/enums/DeductionType";
import { useDeductionStore } from "@/stores/deductionStore";
import { useAlerts } from "@/composables/useAlerts";
import { deductionRadioOptions } from "@/constants/benefitDeduction";
import { DeductionOption } from "@/models/benefitsDeductions/BenefitsDeduction";
import { isEqual } from 'lodash';
import { ApiResponse } from "@/models/ApiResponse";
const deductionStore = useDeductionStore();
const notify = useAlerts();
library.add(faAsterisk);
interface Props {
  showAssignOnboardingPlan: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  showAssignOnboardingPlan: false,
});

const originalFormData = ref(null);

const listOfFoundationDeduction: Ref<DeductionOption[]> = ref<DeductionOption[]>([]);

const formData: Ref<Deduction> = ref<Deduction>({} as Deduction);
const form = ref(null);

const localShowAssignOnboardingPlan = computed(() => props.showAssignOnboardingPlan);
const emit = defineEmits([EmitNames.RELOAD, EmitNames.CLOSE_FORM]);
const selectedDeductionType = ref(DeductionType.BENEFIT);

const deductionModeActive: Ref<DeductionMode> = ref<DeductionMode>(null);

enum TitleModel {
  ADD = "Add Benefit/Deduction",
  EDIT = "Edit Benefit/Deduction",
}

const getTitle = () => {
  if (deductionModeActive.value == DeductionMode.EDIT) {
    return TitleModel.EDIT;
  }
  return TitleModel.ADD;
};

watch(() => selectedDeductionType.value, () => {
  formData.value.deductionTypeId = selectedDeductionType.value;
}, { immediate: true });

const onFoundationDeductionUpdate = (selected: any) => {
  if (selected) {
    formData.value.deductionFsNo = selected.value;
  }
  else {
    formData.value.deductionFsNo = null;
  }
}

const onSaveForm = async () => {
  const deductionMode = deductionModeActive.value;
  const deductionAction = deductionMode === DeductionMode.EDIT ? 'edit' : 'add';

  let response: ApiResponse;
  if (deductionMode === DeductionMode.EDIT) {
    response = await deductionStore.updateDeduction(formData.value);
  }
  else {
    response = await deductionStore.activateDeduction(formData.value);
  }

  if (response.success) {

    const deductionTypeName = selectedDeductionType.value == DeductionType.BENEFIT ? "Benefit" : "Deduction";
    notify.notifySuccess(`${deductionTypeName} ${deductionAction === 'edit' ? 'updated' : 'added'}.`);
  } else {
    notify.notifyError(response.errorMessage);
  }

  emit(EmitNames.RELOAD);
  resetDeduction();
  setTimeout(() => {
    form.value.resetForm();
  })
};

const resetDeduction = () => {
  formData.value.id = 0;
  formData.value.customizedName = "";
  formData.value.deductionName = "";
  formData.value.isViewInESS = false;
  formData.value.isWHQEditable = true;
  formData.value.foundationDeduction = null;
};

const closeForm = () => {
  resetDeduction();
  setTimeout(() => {
    form.value.resetForm();
  })
  selectedDeductionType.value = DeductionType.BENEFIT;
  emit(EmitNames.CLOSE_FORM);
}

defineExpose({
  formData,
  selectedDeductionType,
  deductionModeActive,
  listOfFoundationDeduction,
  originalFormData,
});

</script>
<template>
  <VeeForm ref="form" id="form" @submit="onSaveForm" v-slot="{ meta }">
    <fs-sidebar id="editBenefit" sidebar-class="fsi-sidebar help-center" body-class="help-center__body" right
      no-close-on-esc no-close-on-backdrop bg-variant="white" width="425px" shadow="sm" header-class="border-bottom"
      footer-class="border-top" aria-label="benefit plan" no-header-close v-model="localShowAssignOnboardingPlan">
      <!-- header -->
      <template #title>
        <div class="mr-3 d-flex align-items-center">
          <div class="h5 pl-2 my-auto font-weight-bold">{{ getTitle() }}</div>
          <div class="ms-auto">
            <fs-link class="text-secondary" tag="a" @click="closeForm">
              <font-awesome-icon :icon="['fal', 'times']" size="sm"></font-awesome-icon>
            </fs-link>
          </div>
        </div>
      </template>
      <!-- footer -->
      <template #footer>
        <div class="d-flex align-items-center justify-content-between p-2">
          <fs-button variant="outline-secondary" class="btn btn-outline-gray" @click="closeForm">Cancel</fs-button>
          <fs-button v-if="deductionModeActive == DeductionMode.EDIT" variant="btn-primary" class="btn btn-primary"
            type="submit" form="form" :disabled="!(meta.valid && !isEqual(originalFormData, formData))">SAVE</fs-button>
          <fs-button v-else variant="btn-primary" class="btn btn-primary" type="submit" form="form"
            :disabled="!meta.valid">SAVE</fs-button>
        </div>
      </template>
      <div class="d-flex flex-column h-100 w-100 p-2 pt-3 toggle--green">
        <fs-container fluid>
          <fs-row class="align-items-center">
            <fs-form-radio-group id="radio-group-unit-options" v-model="selectedDeductionType"
              :options="deductionRadioOptions" name="unit-options"></fs-form-radio-group>
          </fs-row>
          <fs-row class="align-items-center pt-2">
            <div class="deduction">
              <fs-input :required="true" label="Name" rules="required" type="fsTextInput" :maxlength="255"
                name="DeductionName" v-model="formData.customizedName"></fs-input>
            </div>
            <div class="deduction">
              <fs-input type="fsMultiselectList" label="Foundation Deduction" :required="true"
                :typeaheaddata="listOfFoundationDeduction" typeaheadkey="text" v-model="formData.foundationDeduction"
                typeaheadvalueattribute="value" name="FoundationDeduction" autocomplete="donotfill"
                :rules="{ required: true }"
                :disabled="deductionModeActive == DeductionMode.EDIT && formData.deductionFsNo != ''"
                @update:modelValue="onFoundationDeductionUpdate">
              </fs-input>
            </div>
            <div>
              <fs-form-checkbox v-model="formData.isViewInESS" switch size="lg" name="viewableInESS">Viewable to
                Employee</fs-form-checkbox>
            </div>
            <div v-if="selectedDeductionType == DeductionType.BENEFIT">
              <fs-form-checkbox v-model="formData.isWHQEditable" switch size="lg" name="isWHQEditable">401K
                Plan</fs-form-checkbox>
            </div>
          </fs-row>
        </fs-container>
      </div>
    </fs-sidebar>
  </VeeForm>
</template>
<style lang="scss" scoped>
:deep(.fs-sidebar-header) {
  background: linear-gradient(0deg, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), #e1e4e8;
}

#editBenefit {
  .form-check-input:checked {
    background-color: #03a9f4;
    border-color: #03a9f4;
  }

  .form-check-input:focus {
    box-shadow: unset;
  }

  .deduction {
    padding-top: 16px;

    .fa-asterisk {
      color: #fb4040;
    }

    &__label {
      &::after {
        content: "*";
        color: red;
        margin-right: 5px;
        font-size: 15px;
        margin-left: 3px;
        margin-bottom: 2px;
      }
    }

    .input-group-text {
      border-right: 1px solid rgba(110, 124, 143, 0.5);
    }

    input {
      width: calc(100% - 36px);
      border: 1px solid rgba(110, 124, 143, 0.5);
      padding-left: 10px;
    }

    &__amount {
      .input-group-text {
        border-radius: 3px 0px 0px 3px;
      }

      input {
        border-radius: 3px;
      }
    }

    &__percent {
      input {
        border-radius: 3px 0px 0px 3px;
      }
    }

    svg {
      font-size: 70%;
    }
  }

  .message-error {
    margin: 5px 0;
    color: #f23648;
    display: block;
  }
}
</style>
