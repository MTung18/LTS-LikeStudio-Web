<script setup lang="ts">
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTimes, faXmark, faRightToLine, faFileCheck, faTriangleExclamation } from "@fortawesome/pro-light-svg-icons";
import { computed } from "vue";
import { EmployeeOnboardList } from "@/models/CurrentOnboards";
import { ref } from "vue";
import { EmployeeStatusEnum } from "@/enums/EmployeeStatusEnum";
import { useOnboardingStore } from "@/stores/onboardingStore";
import CommonModal from "@/components/common/commonModal.vue";
import { useLoadingStore } from "@/stores/loadingStore";
import { useAlerts } from "@/composables/useAlerts";

const { setLoading } = useLoadingStore();
const { notifySuccess } = useAlerts();

library.add(faTimes, faXmark, faRightToLine, faFileCheck, faTriangleExclamation);
const showCancelPlanDetails = ref(false);
const showSkipPlanDetails = ref(false);
const showAssignPlanDetails = ref(false);
const isCheckAssign = ref(false);
const isCheckSkip = ref(false);

const { changeEmployeeStatus, updateForm, updateMultipleSidebar, clearOnboardingStartedDate } = useOnboardingStore();

interface Props {
  showAssignOnboardingPlan: boolean;
  listCurrentOnboard: Array<EmployeeOnboardList>;
}

const props = withDefaults(defineProps<Props>(), {
  showAssignOnboardingPlan: false,
  listCurrentOnboard: () => [],
});

const emit = defineEmits(["update:showAssignOnboardingPlan", "refreshOnboardingPlan"]);

const onCancelListPlan = async (value) => {
  setLoading(true);
  const listCurrentOnboardId = props.listCurrentOnboard.map((item) => item.employeeId);
  await changeEmployeeStatus(listCurrentOnboardId, EmployeeStatusEnum.Cancelled).then(() => {
    emit('refreshOnboardingPlan');
    emit('update:showAssignOnboardingPlan', value);
    notifySuccess("Onboarding Canceled!");
  });
  setLoading(false);
}
const onChangeEmployeeStatus = async (statusType: number) => {
  setLoading(true);
  const listCurrentOnboardId = statusType === EmployeeStatusEnum.QuickHire ? props.listCurrentOnboard.filter((item) => !item.isSubmitted).map(x => x.employeeId) :
    props.listCurrentOnboard.map((item) => item.employeeId);
  if (listCurrentOnboardId.length > 0) {
    // Implement logic when remove all data when switch status
    await updateForm(listCurrentOnboardId, isCheckSkip.value || isCheckAssign.value);
    //Change all sidebar menu to not done when remove all data
    if (isCheckSkip.value || isCheckAssign.value) {
      await Promise.all([updateMultipleSidebar(listCurrentOnboardId), clearOnboardingStartedDate(listCurrentOnboardId)]);
    }
    await changeEmployeeStatus(listCurrentOnboardId, statusType).then(() => {
      emit('refreshOnboardingPlan');
      emit('update:showAssignOnboardingPlan', props.listCurrentOnboard);
    })
    handleResetCheckBox();
  }
  setLoading(false)
}
const handleResetCheckBox = () => {
  isCheckAssign.value = false;
  isCheckSkip.value = false;
}
const handleCancelListOnboard = () => {
  showCancelPlanDetails.value = true
}
const handleSkipListOnboard = () => {
  showSkipPlanDetails.value = true
}
const handleAssignListOnboard = () => {
  showAssignPlanDetails.value = true
}
const localShowAssignOnboardingPlan = computed({
  get() {
    return props.showAssignOnboardingPlan;
  },
  set(value) {
    emit("update:showAssignOnboardingPlan", value);
  },
});

const renderText = computed(() => {
  let text = "";
  if (props.listCurrentOnboard.length) {
    if (props.listCurrentOnboard[0].employeeStatusId == EmployeeStatusEnum.Onboard) text = "Skip"
    else if (props.listCurrentOnboard[0].employeeStatusId == EmployeeStatusEnum.QuickHire) text = "Assign"
  }
  return text;
})
</script>

<template>
  <fs-sidebar id="onboardingPlanId" sidebar-class="fsi-sidebar help-center" body-class="help-center__body" right
    no-close-on-esc no-close-on-backdrop bg-variant="white" width="425px" shadow="sm" header-class="border-bottom"
    footer-class="border-top" aria-label="onboarding plan" no-header-close v-model="localShowAssignOnboardingPlan">
    <template #title="{ hide }">
      <div class="mr-3 d-flex align-items-center">
        <div class="h5 pl-2 my-auto font-weight-bold">
          Actions
        </div>
        <div class="ms-auto">
          <fs-link class="text-secondary" tag="a" @click="hide">
            <font-awesome-icon :icon="['fal', 'times']" size="sm"></font-awesome-icon>
          </fs-link>
        </div>
      </div>
    </template>
    <div class="onboard-panel">
      {{ listCurrentOnboard.length }} items are selected
      <button v-if="renderText == 'Skip'" class="onboard-panel-cancel" @click="handleSkipListOnboard">
        <font-awesome-icon :icon="['fal', 'right-to-line']"></font-awesome-icon>
        <div>{{ renderText }}</div>
      </button>
      <button v-else class="onboard-panel-cancel" @click="handleAssignListOnboard">
        <font-awesome-icon :icon="['fal', 'file-check']"></font-awesome-icon>
        <div>{{ renderText }}</div>
      </button>
      <button class="onboard-panel-cancel" @click="handleCancelListOnboard">
        <font-awesome-icon :icon="['fal', 'xmark']"></font-awesome-icon>
        <div>Cancel</div>
      </button>
    </div>
    <Teleport to="body">
      <common-modal :data="listCurrentOnboard" @emitParent="onCancelListPlan" centered v-model="showCancelPlanDetails"
        okText="Yes, Cancel" cancelText="No, Go back" title="Cancel Onboarding" okTextVariant="danger"
        buttonCancelCustomClass="custom-btn">
        <template #content>
          <div class="message-content" style="display: flex; gap: 8px">
            <div>
              Are you sure you want to cancel onboarding for <span
                :class="props.listCurrentOnboard.length == 1 ? 'fw-bold' : ''">{{ props.listCurrentOnboard.length == 1 ?
                  props.listCurrentOnboard[0].fullName : 'the selected Employees' }}</span>?
              <br>
              <font-awesome-icon class="text-danger" :icon="['fal', 'triangle-exclamation']"></font-awesome-icon>
              <span class="fw-bold">
                This action will remove {{ props.listCurrentOnboard.length == 1 ? props.listCurrentOnboard[0].fullName :
                  'the Employee(s)' }} from the current list of Onboards.
              </span>
            </div>
          </div>
        </template>
      </common-modal>
      <common-modal :data="listCurrentOnboard" @emitParent="onChangeEmployeeStatus(EmployeeStatusEnum.QuickHire)"
        @emitCloseParent="handleResetCheckBox" centered v-model="showSkipPlanDetails" okText="Yes, Skip" cancelText="No"
        title="Skip Onboarding" okTextVariant="success" buttonCancelCustomClass="custom-btn">
        <template #content>
          <div class="message-content" style="display: flex; gap: 8px">
            <div>
              <font-awesome-icon class="text-warning" :icon="['fas', 'circle-exclamation']"></font-awesome-icon>
            </div>
            <div>
              Are you sure you want to skip onboarding?
              <br>
              This action will prevent the employee(s) from entering their own information!
              <div class="mt-2 d-flex">
                <fs-form-checkbox v-model="isCheckSkip" id="clearInformationSkipPanel" /> <label
                  for="clearInformationSkipPanel">Clear all entered information.</label>
              </div>
            </div>
          </div>
        </template>
      </common-modal>
      <common-modal :data="listCurrentOnboard" @emitParent="onChangeEmployeeStatus(EmployeeStatusEnum.Onboard)"
        @emitCloseParent="handleResetCheckBox" centered v-model="showAssignPlanDetails" okText="Yes, Assign Plan"
        cancelText="No" title="Assign Onboarding Plan" okTextVariant="success" buttonCancelCustomClass="custom-btn">
        <template #content>
          <div class="message-content" style="display: flex; gap: 8px">
            <div>
              <font-awesome-icon class="text-warning" :icon="['fas', 'circle-exclamation']"></font-awesome-icon>
            </div>
            <div>
              Are you sure you want to assign onboarding plan?
              <br>
              This action will allow the employee(s) to enter their own information!
              <div class="mt-2 d-flex">
                <fs-form-checkbox v-model="isCheckAssign" type="checkbox" id="clearInformationAssignPanel" /> <label
                  for="clearInformationAssignPanel">Clear all entered information.</label>
              </div>
            </div>
          </div>
        </template>
      </common-modal>
    </Teleport>

  </fs-sidebar>
</template>
<style scoped lang="scss">
:deep(.fs-sidebar-body) {
  background: #F0F2F4;
}

:deep(.fs-sidebar-header) {
  background: #F0F2F4;
}

#onboardingPlanId {
  .onboard-panel {
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
    color: #6e7c8f;
    padding: 20px;

    .onboard-panel-cancel {
      margin-top: 16px;
      display: flex;
      gap: 8px;
      align-items: center;
      font-size: 20px;
      padding: 10px;
      background: #FFFFFF;
      width: 100%;
      border: 1px solid #E1E4E8;
      border-radius: 3px;
      font-family: 'Roboto';
      font-style: normal;
      font-weight: 400;
      font-size: 14px;
      line-height: 22px;
      /* identical to box height, or 157% */

      text-align: center;
      text-transform: capitalize;

      :hover {
        cursor: pointer;
      }

      &:not(:first-child) {
        margin-top: 0px;
      }
    }
  }
}</style>