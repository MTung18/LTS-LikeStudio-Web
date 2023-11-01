<script lang="ts" setup>
import { faAsterisk } from "@fortawesome/pro-solid-svg-icons";
import { computed, Ref, ref, ComputedRef } from "vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import { EmitNames } from "@/enums/EmitName";
import { DeductionMethod } from "@/enums/DeductionType";
import { useBenefitsDeductionStore } from "../../../stores/benefitsDeductionStore";
import { deductionMethodOptions } from "@/constants/deductionMethodOption";
import { useAlerts } from "@/composables/useAlerts";
import { FormContext } from 'vee-validate';
import { useRoute } from "vue-router";
import { BenefitsDeduction, UpSertDeductionRequestModel } from "@/models/benefitsDeductions/BenefitsDeduction";
import CommonModal from '@/components/common/commonModal.vue';

library.add(faAsterisk);
interface Props {
  showEditBenefits: boolean;
  benefitDeductionData: BenefitsDeduction
}

const { notifySuccess, notifyError } = useAlerts();
const store = useBenefitsDeductionStore();
const props = withDefaults(defineProps<Props>(), {
  showEditBenefits: false,
  benefitDeductionData: null
});
const showConfirmationModal = ref<boolean>(false);
const isFormChanged = ref(false);
const route = useRoute();
const employeeId: ComputedRef<string> = computed(() => route.params?.id?.toString());
const emit = defineEmits([EmitNames.RELOAD, EmitNames.CLOSE_FORM]);

const localshowEditBenefits = computed(
  () => props.showEditBenefits
);

const selected: Ref<DeductionMethod> = ref(DeductionMethod.AMOUNT);
const form = ref<FormContext>(null);

const onSaveForm = async () => {
  const { errors } = await form.value.validate();
  if (Object.keys(errors).length === 0) {
    if (selected.value === DeductionMethod.AMOUNT) {
      if (isNaN(props.benefitDeductionData.fixedDedAmount)) {
        props.benefitDeductionData.fixedDedAmount = 0
      }
      props.benefitDeductionData.deductionPercent = 0;
    } else {
      if (isNaN(props.benefitDeductionData.deductionPercent)) {
        props.benefitDeductionData.deductionPercent = 0
      }
      props.benefitDeductionData.fixedDedAmount = 0
    }
    const request: UpSertDeductionRequestModel = {
      employeeId: employeeId.value,
      employeeDeductionId: props.benefitDeductionData.employeeDeductionId,
      data: props.benefitDeductionData
    }
    const response = await store.editbenefits(request);
    if (response.success) {
      notifySuccess("401k benefits update successful");
      emit(EmitNames.CLOSE_FORM, false);
      emit(EmitNames.RELOAD, true);
    } else {
      notifyError("Failed to update 401k benefits");
    }
  }
};

const handleOptionChange = () => {
  if (selected.value === DeductionMethod.AMOUNT) {
    props.benefitDeductionData.deductionPercent = 0;
  } else props.benefitDeductionData.fixedDedAmount = 0
};
const showErrorMessage = ref(false);

function checkDecimalDigits() {
  const decimalDigits = props.benefitDeductionData.deductionPercent?.toString().split('.')[1]?.length || 0;
  showErrorMessage.value = decimalDigits > 7;
  if (props.benefitDeductionData.deductionPercent !== 0) return isFormChanged.value = true;
}

function markFormChanged() {
  if (props.benefitDeductionData.fixedDedAmount !== 0) return isFormChanged.value = true;
}

function openConfirmModal() {
  if (isFormChanged.value) {
    showConfirmationModal.value = true
  } else {
    form.value.resetForm();
    selected.value = DeductionMethod.AMOUNT;
    emit(EmitNames.CLOSE_FORM);
  }
}

function onCancelClick() {
  showConfirmationModal.value = false;
}
function onCloseClick() {
  form.value.resetForm();
  selected.value = DeductionMethod.AMOUNT;
  isFormChanged.value = false;
  emit(EmitNames.CLOSE_FORM);
  showConfirmationModal.value = false;
}

defineExpose({
  selected,
});
</script>
<template>
  <fs-sidebar id="editBenefit" sidebar-class="fsi-sidebar help-center header-grey" body-class="help-center__body" right
    no-close-on-esc no-close-on-backdrop bg-variant="white" width="425px" shadow="sm" header-class="border-bottom"
    footer-class="border-top" aria-label="benefit plan" no-header-close v-model="localshowEditBenefits">
    <!-- header -->
    <template #title>
      <div class="mr-3 d-flex align-items-center">
        <div class="h5 pl-2 my-auto font-weight-bold">
          <b>Edit 401k Amount</b>
        </div>
        <div class="ms-auto">
          <fs-link class="text-secondary" tag="a" @click="openConfirmModal">
            <font-awesome-icon :icon="['fal', 'times']" size="sm"></font-awesome-icon>
          </fs-link>
        </div>
      </div>
    </template>
    <!-- footer -->
    <template #footer>
      <div class="d-flex align-items-center justify-content-between p-2">
        <fs-button variant="outline-secondary" class="btn btn-outline-gray" @click="openConfirmModal()">Cancel</fs-button>
        <fs-button variant="btn-primary" class="btn btn-primary" @click="onSaveForm">SAVE</fs-button>
      </div>
    </template>

    <common-modal :showModal="showConfirmationModal" title="CLOSE Edit 401K panel" okText="CLOSE" cancelText="CANCEL"
      okTextVariant="primary" @emitParent="onCloseClick()" @emitCloseParent="onCancelClick()">
      <template #content>
        <div class="message-content">
          Are you sure you want to close the Edit 401K panel? Any unsaved changes will be lost.
        </div>
      </template>
    </common-modal>
    <div class="d-flex flex-column h-100 w-100 p-2 pt-3" v-if="benefitDeductionData">
      <fs-container fluid>
        <fs-row class="align-items-center">
          <fs-form-radio-group id="radio-group-unit-options" v-model="selected" :options="deductionMethodOptions"
            name="unit-options" @change="handleOptionChange"></fs-form-radio-group>
        </fs-row>
        <VeeForm ref="form">
          <fs-row class="align-items-center pt-2">
            <div class="deduction" v-if="selected == DeductionMethod.AMOUNT">
              <div>
                <label class="fw-bold deduction__label">Deduction Amount</label>
              </div>
              <fs-input-group prepend="$" class="deduction__amount">
                <VeeField class="deduction--prepend" type="number" name="Deduction amount"
                  v-model="benefitDeductionData.fixedDedAmount"
                  :rules="!isNaN(benefitDeductionData.fixedDedAmount) ? { min_value: 0 } : {}">
                  <fs-form-input type="number" v-model="benefitDeductionData.fixedDedAmount"
                    @input="markFormChanged"></fs-form-input>
                </VeeField>
                <ErrorMessage class="message-error" name="Deduction amount" />
              </fs-input-group>
            </div>
            <div class="deduction" v-else>
              <div>
                <label class="fw-bold deduction__label">Deduction Percentage</label>
              </div>
              <fs-input-group append="%" class="deduction__percent">
                <VeeField class="deduction--append" type="number" name="Deduction percentage"
                  v-model="benefitDeductionData.deductionPercent"
                  :rules="!isNaN(benefitDeductionData.deductionPercent) ? { min_value: 0, max_value: 100 } : {}">
                  <fs-form-input type="number" v-model="benefitDeductionData.deductionPercent" step="0.0000001"
                    @input="checkDecimalDigits"></fs-form-input>
                </VeeField>
              </fs-input-group>
              <span v-if="showErrorMessage" style="color: red;">Enter up to 7 digits after the decimal
                point.</span>
              <ErrorMessage class="message-error" name="Deduction percentage" />
            </div>
          </fs-row>
        </VeeForm>
      </fs-container>
    </div>
  </fs-sidebar>
</template>
<style lang="scss" scoped>
#editBenefit {
  .form-check-input:checked {
    background-color: #03a9f4;
    border-color: #03a9f4;
  }

  .form-check-input:focus {
    box-shadow: unset;
  }

  .deduction {
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
        border-radius: 0 3px 3px 0;
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
