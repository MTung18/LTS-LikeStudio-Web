<script setup lang="ts">
import { useBreakpoints } from "@/composables/useBreakpoints";
import { DISTRIBUTION_METHODS } from "@/constants/common";
import DirectDepositAccount from "@/models/onboarding/OnboardingDirectDeposit";
import { useHQSuiteStore } from "@/stores/hqSuiteStore";
import { useLoadingStore } from "@/stores/loadingStore";
import { useOnboardingDirectDepositStore } from "@/stores/onboardingDirectDepositStore";
import { capitalizeFirstChar, formatCurrency, showLastNChar } from "@/utilities/formatUtils";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faAsterisk, faEye, faPenToSquare } from "@fortawesome/pro-light-svg-icons";
import { faCircle } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { storeToRefs } from "pinia";
import { defineProps, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { getFileName } from "@/helper/hqSuite/formatHelper"
import { downloadOrPreviewFile } from "@/helper/hqSuite/fileHelper";
const { isPending } = storeToRefs(useOnboardingDirectDepositStore());
const { changeStartAtMode } = useOnboardingDirectDepositStore();
const { setLoading } = useLoadingStore();
const { responsive } = useBreakpoints();
library.add(faAsterisk, faPenToSquare, faCircle, faEye);

interface Props {
  isOnboarding?: boolean;
  isShowSidebar?: boolean;
  accountDetail?: DirectDepositAccount;
  isDisabledEdit?: boolean;
  isQuickHire?: boolean;
}
const router = useRouter();
const hqSuiteStore = useHQSuiteStore();
const enum EmitNames {
  CLOSE = "closeSidebar",
}

const onClose = () => {
  emit(EmitNames.CLOSE);
};

const emit = defineEmits<{
  (e: EmitNames): void;
}>();

const { isOnboarding, accountDetail, isShowSidebar, isDisabledEdit } = defineProps<Props>();
const showRoutingNumber = ref(true);
const showAccountNumber = ref(true);
const buttonKey = ref(0);

const distributionAmount = (method: string, amount: number) => {
  switch (method) {
    case DISTRIBUTION_METHODS.amount:
      return formatCurrency(amount);
    case DISTRIBUTION_METHODS.percentageNet || DISTRIBUTION_METHODS.percentageRemaining:
      return `${amount}%`;
    case DISTRIBUTION_METHODS.remaining:
      return ``;
    default:
      return;
  }
};

const changeRoute = () => {
  setLoading(true);
  changeStartAtMode('edit');
  router.push(`direct-deposit/account-management`);
  setLoading(false);
};

watch(
  () => responsive.breakpoint,
  () => {
    buttonKey.value++;
  }
);

const handlePreviewFile = async (filePath: string) => {
  setLoading(true);
  const data: any = await hqSuiteStore.getFile(filePath);
  downloadOrPreviewFile(data, filePath, false);
  setLoading(false);
};

</script>

<template>
  <fs-sidebar right :shadow="true" :visible="isShowSidebar" no-close-on-esc no-header-close no-close-on-backdrop
    @close="onClose">
    <template #title>
      <div class="mr-3 d-flex align-items-center">
        <h2 class="h4 pl-2 my-auto fw-bold">Account Details</h2>
        <div class="ms-auto">
          <span class="cursor-pointer text-secondary" tag="a" @click="onClose">
            <font-awesome-icon :icon="['fal', 'times']"></font-awesome-icon>
          </span>
        </div>
      </div>
    </template>

    <div class="py-3 bg-white w-100 h-100">
      <div class="d-flex justify-content-between align-items-center border-bottom px-3 pb-3">
        <span class="fw-bold">
          Checking
          {{ showLastNChar(String(accountDetail?.bankAccountNumber)) }}
        </span>
        <fs-button size="small" :variant="isQuickHire ? 'outline-success' : (isDisabledEdit || isPending) ? 'outline-secondary' : 'outline-success'"
          class="mx-3 text-capitalize" @click="changeRoute()" :key="buttonKey" :disabled="isQuickHire ? false : (isDisabledEdit || isPending)">
          <font-awesome-icon icon="fa-light fa-pen-to-square" />
          <div v-if="responsive.breakpoint !== 'sm'">Edit</div>
        </fs-button>
      </div>
      <fs-form>
        <fs-form-group>
          <fs-container class="px-3">
            <fs-row class="mt-3 d-flex align-items-center">
              <div class="fw-bold mb-2">Status</div>
              <div class="d-flex align-items-center">
                <font-awesome-icon class="icon-circle" :icon="['fa-solid', 'fa-circle']"
                  :class="[accountDetail?.isActive ? 'text-success' : 'text-inactive']" />
                <div>
                  {{ accountDetail?.isActive ? "Active" : "Inactive" }}
                </div>
              </div>
            </fs-row>
            <fs-row class="mt-3 d-flex align-items-center">
              <div class="fw-bold mb-2">Sequence</div>
              <div>
                {{ accountDetail?.ordinalPosition > 0 ? accountDetail?.ordinalPosition : "Remaining" }}
              </div>
            </fs-row>
            <fs-row class="mt-3 d-flex align-items-center">
              <div class="fw-bold mb-2">Bank Account Type</div>
              <div>
                {{ capitalizeFirstChar(String(accountDetail?.accountTypeName).toLowerCase()) }}
              </div>
            </fs-row>
            <fs-row class="mt-3 d-flex align-items-center" v-if="!isOnboarding">
              <div class="fw-bold mb-2">Pre-note</div>
              <div>
                {{ capitalizeFirstChar(String(accountDetail?.approvalStatusName)) }}
              </div>
            </fs-row>
            <fs-row class="mt-3 d-flex align-items-center">
              <div class="fw-bold mb-2">Distribution Method</div>
              <div>
                {{ accountDetail?.distributionMethodName }}
              </div>
            </fs-row>
            <fs-row class="mt-3 d-flex align-items-center"
              v-if="accountDetail.distributionMethodName !== DISTRIBUTION_METHODS.remaining">
              <div class="fw-bold mb-2">
                {{
                  accountDetail.distributionMethodName === DISTRIBUTION_METHODS.amount
                  ? `Distribution Amount`
                  : `Distribution Percentage`
                }}
              </div>
              <div>
                {{
                  distributionAmount(
                    accountDetail?.distributionMethodName,
                    accountDetail.distributionAmount,
                  )
                }}
              </div>
            </fs-row>
            <fs-row class="mt-3 d-flex align-items-center">
              <div class="fw-bold mb-2">Routing Number</div>
              <div>
                {{
                  showRoutingNumber
                  ? showLastNChar(String(accountDetail?.bankRoutingNumber))
                  : accountDetail?.bankRoutingNumber
                }}
                <span class="cursor-pointer ms-2 text-primary" @click="showRoutingNumber = !showRoutingNumber">
                  <font-awesome-icon class="text-success"
                    :icon="showRoutingNumber ? 'fa-light fa-eye' : 'fa-light fa-eye-slash'" />
                </span>
              </div>
            </fs-row>
            <fs-row class="mt-3 d-flex align-items-center">
              <div class="fw-bold mb-2">Account Number</div>
              <div>
                {{
                  showAccountNumber
                  ? showLastNChar(String(accountDetail?.bankAccountNumber))
                  : accountDetail?.bankAccountNumber
                }}
                <span class="cursor-pointer ms-2 text-primary" @click="showAccountNumber = !showAccountNumber">
                  <font-awesome-icon class="text-success"
                    :icon="showAccountNumber ? 'fa-light fa-eye' : 'fa-light fa-eye-slash'" />
                </span>
              </div>
            </fs-row>
            <fs-row class="mt-3 d-flex align-items-center">
              <div class="fw-bold mb-2">Voided Check</div>
              <span class="text-success cursor-pointer" @click="handlePreviewFile(accountDetail?.voidedCheckFilePath)">
                {{ accountDetail?.voidedCheckFilePath && getFileName(accountDetail?.voidedCheckFilePath, true) }}
              </span>
            </fs-row>
            <fs-row class="mt-3 d-flex align-items-center">
              <div class="fw-bold mb-2">Description</div>
              <div>
                {{ accountDetail?.description }}
              </div>
            </fs-row>
          </fs-container>
        </fs-form-group>
      </fs-form>
    </div>
  </fs-sidebar>
</template>

<style lang="scss" scoped>
.icon-circle {
  font-size: 8px;
  margin-right: 6px;
}

:deep(.fs-sidebar) {
  top: 44px;
  height: calc(100vh - 44px);
  width: 400px;
  background-color: #fff;
}

:deep(.fs-sidebar-header) {
  padding: 16px;
  background: linear-gradient(0deg, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), #e1e4e8;
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

.text-inactive {
  color: rgba(110, 124, 143, 0.5);
}

.cursor-pointer {
  cursor: pointer;
}
</style>
