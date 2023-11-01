<script lang="ts" setup>
import { Ref, computed, onMounted, ref, watch } from "vue";
import { faPenToSquare } from "@fortawesome/pro-light-svg-icons";
import {
    faAsterisk,
    faCircleXmark,
    faCircleExclamation,
    faExclamationTriangle
} from "@fortawesome/pro-solid-svg-icons";
import {
    faMoneyCheckDollar,
    faHandHoldingDollar
} from "@fortawesome/pro-light-svg-icons"
import { library } from "@fortawesome/fontawesome-svg-core";
import { storeToRefs } from "pinia";
import { useBreakpoints } from "@/composables/useBreakpoints";
import { useAlerts } from "@/composables/useAlerts";
import { PaymentMethod } from "@/models/settings/PaymentMethod";
import { useGeneralClientSettingStore } from "@/stores/generalClientSettingStore";
import _ from 'lodash';
import { GeneralClientSetting } from "@/models/generalClientSetting";
import { LOCAL_STORAGE_KEY } from "@/constants/localStorageKey";
import { useAzureB2CAuthStore } from "@/stores/azureB2CAuthStore";
import PendingFoundationApprovalBanner from '@/components/shared/pendingFoundationApprovalBanner.vue';
import { MESSAGE } from "@/data/message";
import confirmationModal from '@/components/shared/confirmationModal.vue';
const { responsive } = useBreakpoints();
library.add(faPenToSquare, faAsterisk, faExclamationTriangle, faCircleXmark, faCircleExclamation, faMoneyCheckDollar, faHandHoldingDollar);

const showSectionOptions = [
    {
        text: `Paper Checks`,
        value: `isPaperCheck`,
        description: "They provide a paper trail and give employees stubs immediately. Additionally, they don't require employees to have a bank account.",
        icon: "fa-light fa-money-check-dollar"
    },
    {
        text: `Direct Deposit`,
        value: `isDirectDeposit`,
        description: "You can transfer funds electronically from your company's account directly to your employee's account. Employees are required to have a bank account.",
        icon: "fa-light fa-hand-holding-dollar"
    }
];

enum PopupType {
    Reminder,
    EmployeeSwitch
}
const { notifySuccess, notifyError } = useAlerts();
const generalClientSettingStore = useGeneralClientSettingStore();
const { clientPaymentMethod, generalClientSetting } = storeToRefs(generalClientSettingStore);
const azureB2CAuthStore = useAzureB2CAuthStore();
const RemainderKey = computed(() => `${azureB2CAuthStore.activeUserGuid}_${LOCAL_STORAGE_KEY.DirectDepositRemainderDismissed}`);

const paymentMethodData = ref<PaymentMethod>(new PaymentMethod());
const paymentMethodDataOld = ref<PaymentMethod>(new PaymentMethod());

const isEditMode = ref(false);
const showProfileLockedBanner = ref(false)
const isFormSavable = ref(true);
const showConfirmationModal = ref(false);
const showLoader = ref(false);
const confirmationModalTitle = ref('');
const confirmationModalYesTitle = ref('');
const confirmationModalNoTitle = ref('');
const modalType: Ref<PopupType> = ref();

const computedRemindedTxt = computed(() => {
    let txt = "";
    if (paymentMethodData.value.isPaperCheck == true && paymentMethodData.value.isDirectDeposit == true) {
        txt = "You need to inform all your employees to enter their bank account information as soon as possible if they wish to receive direct deposit.";
    } else if (paymentMethodData.value.isDirectDeposit == true) {
        txt = "You will need to inform all of your employees to enter their bank account information as soon as possible.";
    }
    return txt;
});

const isSwitchToSinglePaymentMode = computed(() => {
    return (!paymentMethodData.value.isDirectDeposit && paymentMethodData.value.isPaperCheck) || (paymentMethodData.value.isDirectDeposit && !paymentMethodData.value.isPaperCheck);
});

async function submitDataToGeneralClientSetting(isReminded: boolean) {
    const submitData: GeneralClientSetting = _.cloneDeep(generalClientSetting.value);
    submitData.isDirectDeposit = paymentMethodData.value.isDirectDeposit;
    submitData.isPaperCheck = paymentMethodData.value.isPaperCheck;
    submitData.isReminderForDirectDepositNotification = isReminded;
    if (isSwitchToSinglePaymentMode.value) {
        showLoader.value = true;
        // Switch to any one payment mode
        await generalClientSettingStore.switchEmployeesPaymentMethodByClientAsync(submitData.isDirectDeposit, submitData.isPaperCheck).then(
            async (data) => {
                await switchClientPaymentMethod(submitData);
                showLoader.value = false;
            }
        ).catch(
            () => {
                notifyError(MESSAGE.PAYMENT_SWITCHER.CLIENT_EMPLPOYEE_SWITCH_ERROR_MESSAGE);
            }
        ).finally(() => {
            showLoader.value = false;
        });
    } else {
        await switchClientPaymentMethod(submitData);
    }
}

async function switchClientPaymentMethod(submitData: GeneralClientSetting) {
    if (await generalClientSettingStore.upsertGeneralClientSetting(submitData, true)) {
        notifySuccess("Your company's payment method has been updated.");
        editForm();
        paymentMethodData.value.isReminded = submitData.isReminderForDirectDepositNotification;
        paymentMethodDataOld.value = _.cloneDeep(paymentMethodData.value);
    }
}

async function onSaveClick() {
    if (paymentMethodData.value.isDirectDeposit == true && computedRemindedTxt.value.length > 0) {
        showPopupForReminder(computedRemindedTxt.value);
    }
    else if (isSwitchToSinglePaymentMode.value) {
        showPopupForSwitchEmployee();
    }
    else {
        localStorage.removeItem(RemainderKey.value);
        await submitDataToGeneralClientSetting(false);
    }
}

const onDismissReminded = async () => {
    localStorage.setItem(RemainderKey.value, 'true');
    paymentMethodData.value.isReminded = false;
}

const showPopupForSwitchEmployee = async () => {
    confirmationModalTitle.value = "Warning regarding employees transitioning to a new payment method"
    confirmationModalYesTitle.value = "OKAY";
    confirmationModalNoTitle.value = "Cancel";
    modalType.value = PopupType.EmployeeSwitch;
    showConfirmationModal.value = true;
};

const showPopupForReminder = async (msg: string) => {
    confirmationModalTitle.value = "Inform Employees Of Payment Method Change"
    confirmationModalYesTitle.value = "OKAY";
    confirmationModalNoTitle.value = "REMIND ME";
    modalType.value = PopupType.Reminder;
    showConfirmationModal.value = true;
};

const editForm = async () => {
    isEditMode.value = !isEditMode.value;
};
async function checkAnyEmployeeProfileLockedForThisClient() {
    showProfileLockedBanner.value = await generalClientSettingStore.isAnyEmployeeProfileLocked();
}

async function cancelConfirmationModal() {
    if (modalType.value == PopupType.Reminder) {
        await submitDataToGeneralClientSetting(true);
    } else {
        await onDiscardChanges();
    }
}
const onCancel = async () => {
    isEditMode.value = false;
    paymentMethodData.value = { ...paymentMethodDataOld.value };
}

const onDiscardChanges = async () => {
    isEditMode.value = false;
    await refreshData();
};

async function refreshData() {
    await generalClientSettingStore.fetchGeneralClientSetting();
    checkAnyEmployeeProfileLockedForThisClient();
    paymentMethodData.value = clientPaymentMethod.value;
    paymentMethodDataOld.value = _.cloneDeep(paymentMethodData.value);
}

watch([() => paymentMethodData.value.isDirectDeposit, () => paymentMethodData.value.isPaperCheck], () => {
    if (paymentMethodData.value.isDirectDeposit === paymentMethodDataOld.value.isDirectDeposit && paymentMethodData.value.isPaperCheck === paymentMethodDataOld.value.isPaperCheck ||
        (paymentMethodData.value.isDirectDeposit === false && paymentMethodData.value.isPaperCheck === false)) {
        isFormSavable.value = false;
    } else {
        isFormSavable.value = true;
    }
})

onMounted(async () => {
    await refreshData();
});

</script>

<template>
    <div class="tab-container">
        <div class="form-section">
            <div class="header">
                <fs-container fluid>
                    <fs-row align-v="center" class="py-3">
                        <fs-col :cols="isEditMode && responsive.breakpoint === 'sm' ? 12 : 'auto'">
                            <div class="title ps-4" :class="isEditMode && responsive.breakpoint === 'sm' && 'pb-3'">Payroll
                                Payment Method</div>
                        </fs-col>
                        <fs-col :cols="responsive.breakpoint === 'sm' && 'auto'" class="d-flex justify-content-end">
                            <fs-button v-if="!isEditMode" :disabled="showProfileLockedBanner" variant="outline-primary"
                                @click="editForm" style="gap: 8px">
                                <font-awesome-icon icon="fa-light fa-pen-to-square" />
                                <div v-if="responsive.breakpoint !== 'sm'">Edit</div>
                            </fs-button>
                        </fs-col>
                        <fs-col :cols="responsive.breakpoint === 'sm' ? 12 : 'auto'">

                            <div v-if="isEditMode" class="w-100 px-4"
                                :class="responsive.breakpoint === 'sm' ? 'd-flex justify-content-between border-top pt-3' : 'justify-content-end'">
                                <fs-button :disabled="showProfileLockedBanner" @click="onCancel()"
                                    variant="outline-secondary">Cancel</fs-button>
                                <fs-button @click="onSaveClick" variant="primary"
                                    :disabled="showProfileLockedBanner || !isFormSavable">Save</fs-button>
                            </div>
                        </fs-col>
                    </fs-row>
                </fs-container>
            </div>
            <pending-foundation-approval-banner :hasPendingFoundationApproval="showProfileLockedBanner"
                :isCustomMessage="true" :custom-message="MESSAGE.PAYMENT_SWITCHER.CLIENT_EMPLPOYEE_SWITCH_BANNER_MESSAGE">
            </pending-foundation-approval-banner>
            <fs-overlay :show="showLoader" spinner-variant="primary" no-wrap>
            </fs-overlay>
            <div v-if="!isEditMode" class="details">
                <fs-alert :show="paymentMethodData.isReminded" variant="warning" id="alert-msg"
                    class="mb-4 mt-2 mb-0 d-flex justify-content-between">
                    <div>
                        <font-awesome-icon class="text-warning me-2" :icon="['fal', 'fa-circle-exclamation']" />
                        <span class="p-1 text-black">{{ computedRemindedTxt }}</span>
                    </div>
                    <fs-link @click="onDismissReminded()" class="link text-warning">Dismiss</fs-link>
                </fs-alert>

                <div class="mb-4">
                    <b>
                        Current payroll payment method(s):
                    </b>
                </div>
                <div class="detail-group d-flex" v-if="paymentMethodData.isPaperCheck">
                    <div class="icon-style align-self-center">
                        <font-awesome-icon :icon="showSectionOptions[0].icon" />
                    </div>
                    <div class="d-grid">
                        <label class="label">{{ showSectionOptions[0].text }}</label>
                        <small> {{ showSectionOptions[0].description }} </small>
                    </div>
                </div>
                <div class="detail-group d-flex" v-if="paymentMethodData.isDirectDeposit">
                    <div class="icon-style align-self-center">
                        <font-awesome-icon :icon="showSectionOptions[1].icon" />
                    </div>
                    <div class="d-grid">
                        <label class="label">{{ showSectionOptions[1].text }}</label>
                        <small> {{ showSectionOptions[1].description }} </small>
                    </div>
                </div>
            </div>

            <div v-if="isEditMode" class="details">
                <div>
                    <b>
                        Which Payroll Payment method(s) does your company want to use?
                    </b>
                </div>
                <div class="detail-group d-flex">
                    <fs-form-checkbox :id="showSectionOptions[0].value" v-model="paymentMethodData.isPaperCheck">
                        <div class="d-grid">
                            <label class="label" :for="showSectionOptions[0].value">{{ showSectionOptions[0].text
                            }}</label>
                            <small> {{ showSectionOptions[0].description }} </small>
                        </div>
                    </fs-form-checkbox>

                </div>
                <div class="d-flex">
                    <fs-form-checkbox :id="showSectionOptions[1].value" v-model="paymentMethodData.isDirectDeposit">
                        <div class="d-grid">
                            <label class="label" :for="showSectionOptions[1].value">{{ showSectionOptions[1].text
                            }}</label>
                            <small> {{ showSectionOptions[1].description }} </small>
                        </div>
                    </fs-form-checkbox>
                </div>
            </div>
        </div>
        <!-- confirmation modal for reminder -->
        <confirmationModal v-model:showConfirmationModal="showConfirmationModal" :size="'lg'" :okButtonStyle="'primary'"
            @OK="submitDataToGeneralClientSetting(false)" @CANCEL="cancelConfirmationModal"
            :yes-title="confirmationModalYesTitle" :no-title="confirmationModalNoTitle" :title="confirmationModalTitle"
            :show-discard="false">
            <div class="d-flex flex-column" v-if="modalType == PopupType.Reminder">
                <span v-if="computedRemindedTxt.length > 0"> <font-awesome-icon class="text-warning me-2"
                        :icon="['fa', 'exclamation-triangle']"></font-awesome-icon>
                    All employees will need to be informed to enter their bank account information as soon as possible in
                    order to receive direst deposit.
                </span>
                <span class="pt-2" v-if="isSwitchToSinglePaymentMode">
                    <strong>Note :</strong> <i>{{ MESSAGE.PAYMENT_SWITCHER.CLIENT_EMPLPOYEE_SWITCH_MESSAGE }}</i>
                </span>
            </div>
            <div class="d-flex flex-column" v-else-if="modalType == PopupType.EmployeeSwitch">
                <span v-if="isSwitchToSinglePaymentMode">
                    <font-awesome-icon class="text-warning me-2" :icon="['fa', 'exclamation-triangle']"></font-awesome-icon>
                    {{ MESSAGE.PAYMENT_SWITCHER.CLIENT_EMPLPOYEE_SWITCH_MESSAGE }}
                </span>
            </div>
        </confirmationModal>
    </div>
</template>
<style lang="scss" scoped>
.tab-container {
    display: flex;
    min-height: calc(100vh - 44px - 70px);
}

.action-buttons {
    flex: 1;
    display: flex;
}

.form-section {
    flex: 1;

    .header {
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #e1e4e8;
        align-items: center;

        .title {
            font-size: 18px;
            font-weight: 700;
            line-height: 21px;
        }
    }
}

.details {
    #alert-msg {
        padding: 0.5rem;
        border: 0.7rem dashed #fac880;
        border-width: initial;
        background: #fbf4df8a;
    }

    padding: 10px 24px 24px 24px;

    .detail-group {
        margin: 10px 0px 20px 0px;
    }

    .label {
        font-weight: 700;
        font-size: 14px;
        line-height: 150%;
    }
}

:deep(.form) {
    padding: 24px;
    width: 40%;
    min-width: 300px;

    .form-label {
        display: flex;
        gap: 2px;

        .required-asterisk {
            color: #f5222d;
            font-weight: 700;
            font-size: 14px;
        }
    }

    label {
        font-weight: 700;
        font-size: 14px;
        line-height: 150%;
    }
}

.error-message {
    color: #ff2a2a;
    font-size: 12px;
    font-weight: 400;
    line-height: 22px;
}

.icon-style {
    border-radius: 5px;
    border: 1px solid #03A9F4;
    margin: 0px 8px 0px 15px;

    svg {
        font-size: 24px;
        margin: 8px;
        color: #03A9F4;
    }
}

input[type=checkbox] {
    margin-right: 5px;
}
</style>
