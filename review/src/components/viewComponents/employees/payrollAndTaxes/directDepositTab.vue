<script setup lang="ts">
import { computed, ComputedRef, onMounted, Ref, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { BryntumGrid } from '@bryntum/grid-vue-3';
import { useEmployeeDirectDepositStore } from '@/stores/employeeDirectDepositStore';
import { EmployeeDirectDeposit } from '@/models/employees/employeeDirectDepositModel';
import DetailsPanelInfo from '@/models/detailsPanelInfo';
import { maskify } from '@/helper/hqSuite/formatHelper';
import detailsPanel from '@/components/shared/detailsPanel/detailsPanel.vue';
import deleteConfirmationModal from '@/components/shared/deleteConfirmationModal.vue';
import { MESSAGE } from '@/data/message';
import { DistributionMethod } from '@/enums/DistributionMethod';
import { ActionPlacement, PanelActionConfig, PanelConfig } from '@/models/panelConfig';
import { useRoute, useRouter } from "vue-router";
import { EssApprovalStatus } from '@/enums/EssApprovalStatus';
import { useDirectDeposit } from "@/composables/useDirectDeposit";
import emptyGridLayout from '@/components/shared/emptyGridLayout.vue';
import directDepositSplash from "@/assets/images/direct_deposit_splash.svg";
import { useEmployeeStore } from '@/stores/employeeStore';
import { useGeneralClientSetting } from '@/composables/useGeneralClientSetting';
import { useEmployeePaymentMethod } from '@/composables/useEmployeePaymentMethod';
import { useEmployeePayrollAndTaxStore } from '@/stores/employeePayrollAndTaxStore';
import { useAlerts } from '@/composables/useAlerts';

const { employeeDetails } = storeToRefs(useEmployeeStore());
const employeeDirectDepositStore = useEmployeeDirectDepositStore();
const { employeeDirectDeposit } = storeToRefs(employeeDirectDepositStore);
const route = useRoute();
const router = useRouter();
const selectedDetails: Ref<DetailsPanelInfo[]> = ref();
const employeeId: ComputedRef<string> = computed(() => route.params?.id?.toString());
const showDetailPanel = ref(false);
const showLoader = ref(false);
const detailsPanelConfig = ref(new PanelConfig({
    title: MESSAGE.DIRECT_DEPOSIT.ACCOUNT_DETAILS,
    showFooter: false,
    showHeader: true,
    actions: [
        new PanelActionConfig(
            {
                name: 'Edit',
                icon: ['fal', 'edit'],
                handler: onEditDirectDepositClick,
                placement: ActionPlacement.Header,
                variant: 'outline-primary',
            }
        )
    ]
}));
const employeePayrollAndTaxStore = useEmployeePayrollAndTaxStore();
const { notifyError, notifySuccess } = useAlerts();
const {
    proceedDirectDepositDelete,
    onDeleteDirectDepositClick,
    hasPendingAccountToSubmit,
    showDeleteModal,
    selectedRow,
} = useDirectDeposit<EmployeeDirectDeposit>(refreshList, +employeeId.value);
const employeeFirstName = computed(() => employeeDetails.value?.fullName ? employeeDetails.value.fullName.split(" ")[0] : 'employee')
const { isPaperCheckAndDirectDepositEnabled, isDirectDepositEnabled } = useGeneralClientSetting();
const { isEmployeePaperCheckEnabled, isEmployeeDirectDepositEnabled } = useEmployeePaymentMethod(+employeeId.value);
const showDirectDepositGrid = computed(() => isDirectDepositEnabled.value &&
    employeeDirectDeposit.value?.length > 0 && !isEmployeePaperCheckEnabled.value);
const showEmptySplashScreen = computed(() => isDirectDepositEnabled.value && employeeDirectDeposit.value?.length <= 0);

const grid = ref(null);
const gridConfig = ref({
    columns: [
        {
            flex: 1,
            text: 'Sequence',
            id: 'ordinalPosition',
            field: 'ordinalPosition',
            groupable: false,
            cellCls: 'ps-4',
            cls: 'ps-4',
            renderer: ({ record }: { record: EmployeeDirectDeposit }) => {
                if (record.distributionMethodId === 4)
                    return DistributionMethod[DistributionMethod.Remaining];
                else
                    return record.ordinalPosition;
            },
            sortable: (record1: any, record2: any) => customSorting(record1, record2, 'bankAccountNumber'),
        },
        {
            flex: 1,
            text: 'Bank Account Type',
            id: 'accountTypeName',
            field: 'accountTypeName',
            groupable: false,
            sortable: (record1: any, record2: any) => customSorting(record1, record2, 'bankAccountNumber'),
        },
        {
            flex: 1,
            text: 'Account Number',
            id: 'bankAccountNumber',
            field: 'bankAccountNumber',
            sortable: (record1: any, record2: any) => customSorting(record1, record2, 'bankAccountNumber'),
            groupable: false,
            htmlEncode: false,
            renderer: ({ record }: { record: EmployeeDirectDeposit }) => {
                return `${maskify(record.bankAccountNumber)}`
            },
        },
        {
            flex: 1,
            text: 'Distribution Method',
            id: 'distributionMethodName',
            field: 'distributionMethodName',
            groupable: false,
            sortable: (record1: any, record2: any) => customSorting(record1, record2, 'bankAccountNumber'),
        },
        {
            flex: 1,
            text: 'Distribution Amount',
            id: 'distributionAmount',
            field: 'distributionAmount',
            groupable: false,
            sortable: (record1: any, record2: any) => customSorting(record1, record2, 'bankAccountNumber'),
        },
        {
            flex: 1,
            text: 'Status',
            id: 'isActive',
            field: 'isActive',
            groupable: false,
            htmlEncode: false,
            renderer: ({ record }: { record: EmployeeDirectDeposit }) => {
                let statusClass = '';
                // This code snippnet will use when we 
                // if (record.approvalStatusId === EssApprovalStatus.PendingHRM || record.approvalStatusId === EssApprovalStatus.PendingFoundation) {
                //     statusClass = 'text--status-pending';
                // } else if (record.approvalStatusId === EssApprovalStatus.Approved) {
                //     statusClass = 'text--status-active';
                // } else if (record.approvalStatusId === EssApprovalStatus.Rejected || (record.approvalStatusId === EssApprovalStatus.Approved && !record.isActive)) {
                //     statusClass = 'text--status-inactive';
                // }
                if (record.isActive) {
                    statusClass = 'text--status-active';
                } else {
                    statusClass = 'text--status-inactive';
                }
                return `<i class="b-fa-solid b-fa-circle fs-7 ${statusClass}"></i><span>${record.isActive ? MESSAGE.COMMON.ACTIVE : MESSAGE.COMMON.INACTIVE}</span>`
            },
            sortable: (record1: any, record2: any) => customSorting(record1, record2, 'bankAccountNumber'),
        },
        {
            flex: 1,
            text: 'Pre-Note',
            id: 'isPrenoteRequired',
            field: 'isPrenoteRequired',
            groupable: false,
            renderer: ({ record }: { record: EmployeeDirectDeposit }) => {
                return record.isPrenoteRequired ? MESSAGE.COMMON.YES : MESSAGE.COMMON.NO;
            },
            sortable: (record1: any, record2: any) => customSorting(record1, record2, 'bankAccountNumber'),
        },
        {
            flex: 1,
            type: "action",
            id: "action",
            text: "Actions",
            minWidth: 200,
            columnDragToolbar: false,
            enableHeaderContextMenu: false,
            enableCellContextMenu: false,
            cellCls: "b-action-cell--hover",
            actions: [
                {
                    visible: true,
                    renderer: () => {
                        return '<i class="b-action-item b-fa b-fa-external-link btn btn-link text-success no-underline"><span>View</span></i>';
                    },
                    onClick: onViewDirectDepositClick,
                },
                {
                    visible: true,
                    htmlEncode: false,
                    renderer: ({ record }) => {
                        const disableDelete = disableEditorDelete(record.data);
                        if (record.data.distributionMethodId !== 4)
                            return `<i title="${disableDelete ? MESSAGE.DIRECT_DEPOSIT.STATUS_INPROGRESS_DELETE : ''}" class="b-action-item b-fa b-fa-trash-alt btn btn-link text-red no-underline ${disableDelete ? 'disabled pe-auto' : ''}"><span>Delete</span></i>`;
                        else
                            return '';
                    },
                    onClick: onDeleteDirectDepositClick,
                },
            ],
        }
    ]
});

async function onViewDirectDepositClick(event: any): Promise<void> {
    if (event.record.data) {
        const selectedDD: EmployeeDirectDeposit = event.record.data;
        selectedRow.value = selectedDD;
        const disable = disableEditorDelete(selectedDD);
        detailsPanelConfig.value.actions[0].class = disable ? 'disabled pe-auto' : '';
        detailsPanelConfig.value.actions[0].tooltip = disable ? MESSAGE.DIRECT_DEPOSIT.STATUS_INPROGRESS_UPDATE : '';
        detailsPanelConfig.value.source = selectedDD;
        detailsPanelConfig.value.subTitle = `${selectedDD.accountTypeName} ${maskify(selectedDD.bankAccountNumber)}`;
        selectedDetails.value = DetailsPanelInfo.ConvertDirectDeposit(event.record.data);
        showDetailPanel.value = true;
    }
}

function disableEditorDelete(data: EmployeeDirectDeposit) {
    return data.approvalStatusId != EssApprovalStatus.PendingFoundation && data.approvalStatusId != EssApprovalStatus.PendingHRM;
}


function customSorting(record1: any, record2: any, sortField: string): number {
    // Avoid sorting for remainder account
    if (record1.data.distributionMethodId === DistributionMethod.Remaining || record2.data.distributionMethodId === DistributionMethod.Remaining) {
        return 0;
    }
    return record1.data[sortField]?.trim() < record2.data[sortField]?.trim() ? -1 : 1;
}

async function onEditDirectDepositClick(source: EmployeeDirectDeposit): Promise<void> {
    const employeeDirectDepositId = Number.parseInt(source.employeeDirectDepositId.toString())
    const directDepositId = isNaN(employeeDirectDepositId) ? null : employeeDirectDepositId;
    router.push({ name: 'manageAccounts', params: { id: employeeId.value, directDepositId } });
}

async function refreshList() {
    showLoader.value = true;
    await employeeDirectDepositStore.fetchEmployeeDirectDeposits(+employeeId.value);
    showLoader.value = false;
}

async function onManageAccountClick() {
    router.push({ name: 'manageAccounts', params: { id: employeeId.value } });
}

async function switchToDirectDeposit() {
    if (await employeePayrollAndTaxStore.switchEmployeePaymentMethod(+employeeId.value, true)) {
        // Clear the existing direct deposit local changes on success of payment switch
        await employeeDirectDepositStore.clearUpsertEmployeeDirectDeposits();
        notifySuccess(MESSAGE.PAYMENT_SWITCHER.PAYMENTMETHOD_UPDATE.replace(`<<type>>`,"Direct Deposit" ));
    } else {
        notifyError(MESSAGE.PAYMENT_SWITCHER.PAYMENTMETHOD_UPDATE_FAILED.replace(`<<type>>`, "Direct Deposit"));
    }
}

async function switchPaymentMethod() {
    router.push({ name: 'paymentMethod', params: { id: employeeId.value } });
}

onMounted(async () => {
    await refreshList();
});
</script>

<template>
    <div class="h-100 list">
        <div class="action-grid list__table list__b-grid--hover">
            <div class="alert alert-danger mb-0 p-2" v-if="hasPendingAccountToSubmit">
                {{ MESSAGE.DIRECT_DEPOSIT.SUBMIT_NOTIFICATION }}
            </div>
            <fs-overlay :show="showLoader" spinner-variant="primary" no-wrap />
            <bryntum-grid v-if="showDirectDepositGrid" :readOnly="true" ref="grid" v-bind="gridConfig"
                :data="employeeDirectDeposit" />
            <empty-grid-layout v-else>
                <template v-slot:custom>
                    <!-- Switch to direct deposit  -->
                    <div class="flex-fill flex-column d-flex align-items-center justify-content-center py-5"
                        v-if="isPaperCheckAndDirectDepositEnabled && isEmployeePaperCheckEnabled">
                        <div class="text-center">
                            <h5 class="fw-bold">
                                {{ MESSAGE.DIRECT_DEPOSIT.PAPERCHECKS_HEADER }}</h5>
                            <img width="120" class="mb-4" :src="directDepositSplash" alt="Switch to Direct Deposit">
                            <div class="text-center text-secondary mb-3"
                                v-html="MESSAGE.DIRECT_DEPOSIT.PAPERCHECKS_SUBTEXT">
                            </div>
                            <fs-button variant="primary" @click="switchPaymentMethod()">{{
                                MESSAGE.DIRECT_DEPOSIT.SWITCH_TO_DIRECT_DEPOSIT_BUTTON_TEXT }}</fs-button>
                        </div>
                    </div>
                    <!-- Manage direct deposits splash screen -->
                    <div class="flex-fill flex-column d-flex align-items-center justify-content-center py-5"
                        v-else-if="isDirectDepositEnabled && isEmployeeDirectDepositEnabled && showEmptySplashScreen">
                        <div class="text-center">
                            <h5 class="fw-bold">
                                {{ MESSAGE.DIRECT_DEPOSIT.SETUP_DIRECTDEPOSIT_HEADER.replace('<<FIRSTNAME>>',
                                    employeeFirstName) }}</h5>
                            <img width="120" class="mb-4" :src="directDepositSplash" alt="Setup Direct Deposit">
                            <div class="text-center text-secondary mb-3"
                                v-html="MESSAGE.DIRECT_DEPOSIT.SETUP_DIRECTDEPOSIT_SUBTEXT">
                            </div>
                            <fs-button variant="primary" @click="onManageAccountClick()">{{
                                MESSAGE.DIRECT_DEPOSIT.MANAGE_ACCOUNTS_BUTTON_TEXT }}</fs-button>
                        </div>
                    </div>
                     <!-- Company doesn't have paper check but employee has paper check -->
                     <div class="flex-fill flex-column d-flex align-items-center justify-content-center py-5"
                        v-else-if="isDirectDepositEnabled && isEmployeePaperCheckEnabled">
                        <div class="text-center">
                            <h5 class="fw-bold">
                                {{ MESSAGE.DIRECT_DEPOSIT.SETUP_DIRECTDEPOSIT_HEADER.replace('<<FIRSTNAME>>',
                                    employeeFirstName) }}</h5>
                            <img width="120" class="mb-4" :src="directDepositSplash" alt="Setup Direct Deposit">
                            <div class="text-center text-secondary mb-3"
                                v-html="MESSAGE.DIRECT_DEPOSIT.SETUP_DIRECTDEPOSIT_SUBTEXT">
                            </div>
                            <fs-button variant="primary" @click="switchToDirectDeposit()">{{
                                MESSAGE.DIRECT_DEPOSIT.SWITCH_TO_DIRECT_DEPOSIT_BUTTON_TEXT }}</fs-button>
                        </div>
                    </div>
                </template>
            </empty-grid-layout>
        </div>
    </div>

    <details-panel :details="selectedDetails" v-model:showPanel="showDetailPanel" :config="detailsPanelConfig" />

    <deleteConfirmationModal v-model:showDeleteModal="showDeleteModal" @OK="proceedDirectDepositDelete()"
        @CANCEL="showDeleteModal = false">
        <span>
            {{ MESSAGE.DIRECT_DEPOSIT.DELETE_CONFIRMATION_MESSAGE }}
            <div class="pt-2">
                <div v-if="selectedRow" class="d-flex mb-1 fw-bold align-items-center">
                    <span class="d-flex border border-info border border-2 rounded-2 px-2">{{
                        selectedRow.ordinalPosition }}</span>
                    <span class="ps-2">
                        {{ `${selectedRow.accountTypeName} ${maskify(selectedRow.bankAccountNumber)}` }}
                    </span>
                </div>
            </div>
        </span>
    </deleteConfirmationModal>
</template>
