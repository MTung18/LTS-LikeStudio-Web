<script setup lang="ts">
import { onMounted, ref, ComputedRef, Ref, watch, computed } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faCircleExclamation } from "@fortawesome/pro-light-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { useAlerts } from '@/composables/useAlerts';
import confirmationModal from '@/components/shared/confirmationModal.vue';
import { useRoute, useRouter } from "vue-router";
import { useEmployeePayrollAndTaxStore } from "@/stores/employeePayrollAndTaxStore";
import { useEmployeePayrollInformationStore } from "@/stores/employeePayrollInformationStore";
import { storeToRefs } from "pinia";
import { MESSAGE } from "@/data/message";
import { useEmployeeDirectDepositStore } from "@/stores/employeeDirectDepositStore";
import { PayrollAndTaxTab } from "@/enums/PayrollAndTaxTab";

library.add(faCircleExclamation);
const showConfirmationModal = ref(false);

const employeePayrollInformationStore = useEmployeePayrollInformationStore();
const employeeDirectDepositStore = useEmployeeDirectDepositStore();
const employeePayrollAndTaxStore = useEmployeePayrollAndTaxStore();
const { payrollInformation } = storeToRefs(employeePayrollInformationStore);
const paymentMethod = {
    DIRECT_DEPOSIT: "Direct Deposit",
    PAPER_CHECKS: "Paper Checks",
};
const route = useRoute();
const router = useRouter();
const paymentMethodRadioState: Ref<boolean> = ref(false);
const isDisabled = ref(true);
const { notifyError, notifySuccess } = useAlerts();
const employeeId: ComputedRef<string> = computed(() => route.params?.id?.toString());
const confirmationModalYesTitle = ref('');
const confirmationModalNoTitle = ref(MESSAGE.COMMON.CANCEL);

function changeCheckboxState() {
    paymentMethodRadioState.value = !paymentMethodRadioState.value;
}

watch(paymentMethodRadioState, (newValue, oldValue) => {
    isDisabled.value = paymentMethodRadioState.value === oldValue;
    confirmationModalYesTitle.value = newValue ?
        MESSAGE.PAYMENT_SWITCHER.SWITCH_TO_DD : MESSAGE.PAYMENT_SWITCHER.SWITCH_TO_PC;
})

onMounted(async () => {
    await employeePayrollInformationStore.fetchPayrollInformation(parseInt(employeeId.value));
    paymentMethodRadioState.value = payrollInformation.value.isDirectDepositEnabled;
});

function cancel() {
    router.push({ name: 'payrollAndTaxes', params: { id: employeeId.value, tab: PayrollAndTaxTab.DirectDeposit } });
}

async function savePaymentMethod() {
    if (paymentMethodRadioState.value) {
        switchPayment();
    } else {
        showConfirmationModal.value = true;
    }
}

const switchPaymentRequest = async () => {
    const typeValue = paymentMethodRadioState.value ? paymentMethod.DIRECT_DEPOSIT : paymentMethod.PAPER_CHECKS;
    switchPayment();
    showConfirmationModal.value = false;
    router.push({ name: 'payrollAndTaxes', params: { id: employeeId.value, tab: PayrollAndTaxTab.DirectDeposit  } });
}

const switchPayment = async () => {
    const typeValue = paymentMethodRadioState.value ? paymentMethod.DIRECT_DEPOSIT : paymentMethod.PAPER_CHECKS;
    if (await employeePayrollAndTaxStore.switchEmployeePaymentMethod(+employeeId.value, paymentMethodRadioState.value)) {
        // Clear the existing direct deposit local changes on success of payment switch
        await employeeDirectDepositStore.clearUpsertEmployeeDirectDeposits();
        notifySuccess(MESSAGE.PAYMENT_SWITCHER.PAYMENTMETHOD_UPDATE.replace(`<<type>>`, typeValue));
        if (typeValue == paymentMethod.DIRECT_DEPOSIT) {
            router.push({ name: 'manageAccounts', params: { id: employeeId.value } });
        }
    } else {
        notifyError(MESSAGE.PAYMENT_SWITCHER.PAYMENTMETHOD_UPDATE_FAILED.replace(`<<type>>`, typeValue));
    }
}

const closeCancelRequestConfirmModal = () => {
    showConfirmationModal.value = false;
}
</script>
<template>
    <div class="hq-pg change-payment-page">
        <fs-container fluid class="hq-pg__header hq-pg__header--sticky contain">
            <fs-row align-v="center">
                <fs-col>
                    <h2 class="hq-pg__title">{{ MESSAGE.PAYMENT_SWITCHER.CHANGE_PAYMENT_TITLE }}</h2>
                </fs-col>
                <fs-col cols="auto">
                    <fs-button variant="outline-secondary" @click="cancel">{{ MESSAGE.COMMON.CANCEL }}</fs-button>
                    <fs-button variant="btn-primary" class="btn btn-primary" type="submit" @click="savePaymentMethod"
                        :disabled="isDisabled">{{ MESSAGE.COMMON.SAVE }}</fs-button>
                </fs-col>
            </fs-row>
        </fs-container>
        <fs-form-group label="Please select how this employee will receive their paycheck:" class="form-radio">
            <fs-form-radio :value="true" v-model="paymentMethodRadioState" @change="changeCheckboxState">{{
                paymentMethod.DIRECT_DEPOSIT
            }}
            </fs-form-radio>
            <fs-form-radio :value="false" v-model="paymentMethodRadioState" @change="changeCheckboxState">{{
                paymentMethod.PAPER_CHECKS
            }}
            </fs-form-radio>
        </fs-form-group>
        <!-- confirmation modal for discard changes -->
        <confirmationModal v-model:showConfirmationModal="showConfirmationModal" @OK="switchPaymentRequest"
            @CANCEL="closeCancelRequestConfirmModal" @DISCARD="closeCancelRequestConfirmModal" :yes-title="confirmationModalYesTitle"
            :no-title="confirmationModalNoTitle" :show-discard="false" :title="'Payment Method Confirmation'">
            <div class="d-flex">
                Changing the payment method to Paper Checks will not delete the employee's bank accounts, however they
                will all be set to "Inactive" status.
            </div>
            <div class="d-flex align-items-center">
                <font-awesome-icon :icon="['fal', 'fa-circle-exclamation']" class="text-warning mx-1"
                    style="font-size: large;" />
                <strong class="ms-2 mt-2">To change back to Direct Deposit, at least one bank account will need to be
                    "Active"
                    before the
                    employee receives any deposits.</strong>
            </div>
        </confirmationModal>
    </div>
</template>
<style lang="scss" scoped>
.change-payment-page {
    .form-radio {
        margin: 25px 0 0 25px;
        font-size: 18px;

        .form-check {
            padding-top: 10px;
        }
    }
}
</style>