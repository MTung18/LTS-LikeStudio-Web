<template>
    <div class="hq-pg pb-0">
        <div class="hq-pg__grid h-100">
            <fs-container fluid class="hq-pg__header contain border-bottom border-2 border-cyan">
                <fs-row align-v="center">
                    <fs-col cols="auto" @click="onGoBackClick()">
                        <font-awesome-icon :icon="['fal', 'circle-arrow-left']" size="2x"
                            class="inner-sidenav__icon text-primary" />
                    </fs-col>
                    <fs-col>
                        <h5 class="hq-pg__title">{{ MESSAGE.DIRECT_DEPOSIT.MANAGE_ACCOUNTS }}</h5>
                    </fs-col>
                    <fs-col cols="auto" class="d-flex">
                        <fs-button variant="outline-secondary" class="me-2" @click="onCancelSubmitClick">
                            {{ MESSAGE.COMMON.CANCEL }}
                        </fs-button>
                        <fs-popper hover tooltip
                            :content="isRemainingAccountAvailable ? '' : MESSAGE.DIRECT_DEPOSIT.REMAINDER_ACCOUNT_MANDATORY"
                            placement="bottom">
                            <fs-button :disabled="isEditMode || !canSubmitNew" variant="primary" @click="onSubmitClick">
                                <span class="d-none d-lg-inline">{{ MESSAGE.COMMON.SUBMIT }}</span>
                            </fs-button>
                        </fs-popper>
                    </fs-col>

                    </fs-row>
            </fs-container>
            <div class="list__table">
                <VeeForm ref="observer" id="observer" v-slot="{ meta }" class="d-flex flex-column overflow-hidden flex-fill">
                    <fs-container fluid class="border-bottom">
                        <fs-row align-v="stretch" style="min-height: 56px;">
                            <fs-col cols="6" class=" contain border-end d-flex align-items-center flex-fill"> <!-- Left Header -->
                                <h5 class="hq-pg__title">{{ MESSAGE.DIRECT_DEPOSIT.DEPOSIT_ORDER }}</h5>
                            </fs-col>
                            <fs-col cols="6" class="contain py-2 d-flex align-items-center flex-fill"><!-- RIGHT HEADER -->
                                <h5 class="hq-pg__title">{{ isNewAccount ? 'New Account' : detailsPanelConfig.subTitle}}
                                </h5>
                                <fs-popper class="ms-auto" hover tooltip
                                    :content="disableEdit ? MESSAGE.DIRECT_DEPOSIT.CANNOT_EDIT_TEXT : ''"
                                    placement="bottom">
                                    <fs-button :disabled="disableEdit" id="editDirectDeposit" v-if="!isEditMode"
                                        variant="outline-primary" class="btn btn-outline-primary" @click="onEditClick()">
                                        {{ MESSAGE.COMMON.EDIT }}
                                    </fs-button>
                                </fs-popper>
                            </fs-col>
                        </fs-row>
                    </fs-container>
                    <fs-container fluid class="flex-fill d-flex flex-column">
                        <fs-row class="flex-fill">
                            <fs-col cols="6" class="border-end p-0"> <!-- LEFT -->
                                <bryntum-grid v-bind="gridConfig" :store="gridStore" ref="grid" />
                            </fs-col>
                            <fs-col cols="6" class="contain d-flex overflow-auto py-3">
                                <div class="d-flex flex-column w-100" style="height: 0;"> <!-- IMPORTANT FOR FLEX BOX OVERFLOW -->
                                    <!-- RIGHT -->
                                    <template v-if="!isEditMode">
                                        <detail-item v-for="(detail, index) in orderedDetails" :key="index" :detail="detail"
                                            :show-border="(orderedDetails?.length - 1) != index">
                                        </detail-item>
                                    </template>

                                    <fs-row v-else class="align-items-center">
                                        <fs-col cols="6">
                                            <fs-input type="fsMultiselectList" label="Account Type" id="accountType"
                                                labelId="accountTypeLabelId" v-model="selectedAccountType" required="true"
                                                :typeaheaddata="masterData.accountTypeList" typeaheadkey="name"
                                                typeaheadvalueattribute="id" name="accountType" :showClear="true"
                                                autocomplete="donotfill" :dropdownSearchable="true"
                                                :rules="{ required: true }"></fs-input>
                                        </fs-col>
                                        <fs-col v-if="!isNewAccount" cols="6">
                                            <fs-input type="fsMultiselectList" label="Status" id="status" labelId="statusLabelId"
                                                v-model="selectedStatus" :typeaheaddata="activeStatusList" typeaheadkey="name"
                                                typeaheadvalueattribute="id" name="status" :showClear="true"
                                                autocomplete="donotfill" :dropdownSearchable="true"
                                                :rules="{ required: false }"></fs-input>
                                        </fs-col>
                                        <fs-col v-else cols="6"></fs-col>
                                        <fs-col cols="6">
                                            <fs-input type="fsMultiselectList" label="Distribution Method" id="distributionMethod"
                                                labelId="distributionMethodLabelId" v-model="selectedDistributionMethod"
                                                :typeaheaddata="masterData.distributionMethodList" typeaheadkey="name"
                                                :required="true" typeaheadvalueattribute="id" name="distributionMethod"
                                                :minvalue="0" :step="0.01" :showClear="true" autocomplete="donotfill"
                                                :dropdownSearchable="true" :rules="{ required: true }"></fs-input>
                                        </fs-col>
                                        <fs-col cols="6">
                                            <fs-input type="fsNumber" v-if="isPercentageDistributionMethod"
                                                label="Distribution Percentage" id="distributionAmount" inputType="number" :rules="{
                                                    required: true,
                                                    between: {
                                                        min: 0.00,
                                                        max: 100.00,
                                                        maxMessage: 'Must be less than or equal to 100.00%',
                                                        minMessage: 'Must be greater than or equal to 0.00%'
                                                    },
                                                    precisionAndScale: {
                                                        precision: 5,
                                                        scale: 2,
                                                        message: 'Can only contain 2 decimals',
                                                        precisionMesage: 'Allowed format is (3,2)XXX.XX'
                                                    }
                                                }" name="distributionPercent" :isDecimal="true" :allowedDigits="2"
                                                :minvalue="0" :step="0.01" append="%" :required="true"
                                                :formMeta="{ ...meta, validated: formHasValidated }"
                                                v-model="selectedRow.distributionAmount">
                                            </fs-input>

                                    <fs-input type="fsNumber" v-else label="Distribution Amount" id="distributionAmount"
                                        :rules="isDistributionAmountEnabled ?  {
                                            required: true,
                                            between: {
                                                min: 0.01,
                                                max: 9999999999.99,
                                                maxMessage: 'Must be below $9999999999.99',
                                                minMessage: 'Must be greater than $0.00.'
                                            },
                                            precisionAndScale: {
                                                precision: 12,
                                                scale: 2,
                                                message: 'Can only contain 2 decimals',
                                                precisionMesage: 'Allowed format is (10,2)XXXXXXXXXX.XX'
                                            }
                                        } : {required: false}" name="distributionAmount" :required="isDistributionAmountEnabled" :disabled="!isDistributionAmountEnabled" :isDecimal="true"
                                        :allowedDigits="2" prepend="$" :formMeta="{ ...meta, validated: formHasValidated }"
                                        v-model="selectedRow.distributionAmount">
                                    </fs-input>
                                </fs-col>
                                <fs-col cols="6">
                                    <fs-input type="fsTextInput" label="Routing Number"
                                        :inputType="hideRoutingNumber ? 'number' : 'password'"
                                        :rules="{ required: true, max: 25 }" name="routingNumber" :required="true"
                                        :minvalue="0" :maxlength="25" :formMeta="{ ...meta, validated: formHasValidated }"
                                        v-model="selectedRow.bankRoutingNumber">
                                        <template #input-group-content>
                                            <fs-button pill variant="outline-green" class="px-2 mt-2 mx-2"
                                                style="height: 19px; width: 30px"
                                                @click="hideRoutingNumber = !hideRoutingNumber">
                                                <font-awesome-icon :icon="['fal', hideRoutingNumber ? 'eye-slash' : 'eye']"
                                                    size="sm" />
                                            </fs-button>
                                        </template>
                                    </fs-input>
                                </fs-col>
                                <fs-col cols="6">
                                    <fs-input type="fsTextInput" label="Account Number"
                                        :inputType="hideAccountNumber ? 'number' : 'password'" :rules="{
                                            required: true
                                            , max: 25
                                            , no_duplicate_number: {
                                                arrayOfObjects: noSelectedAccounts,
                                                fieldInObjectToCheck: 'bankAccountNumber',
                                                message: 'This account number already exists.'
                                            }
                                        }
                                            " name="accountNumber" :required="true" :minvalue="0" :maxlength="25"
                                        :formMeta="{ ...meta, validated: formHasValidated }"
                                        v-model="selectedRow.bankAccountNumber">
                                        <template #input-group-content>
                                            <fs-button pill variant="outline-green" class="px-2 mt-2 mx-2"
                                                style="height: 19px; width: 30px"
                                                @click="hideAccountNumber = !hideAccountNumber">
                                                <font-awesome-icon :icon="['fal', hideAccountNumber ? 'eye-slash' : 'eye']"
                                                    size="sm" />
                                            </fs-button>
                                        </template>
                                    </fs-input>
                                </fs-col>
                                <fs-col cols="6">
                                    <fs-input type="fsTextInput" label="Confirm Account Number"
                                        :inputType="hideAccountNumberConfirm ? 'number' : 'password'" :maxlength="25"
                                        :rules="{ required: true, max: 25, accountNumberMatch: { verify: selectedRow.bankAccountNumber } }"
                                        :minvalue="0" name="confirmAccountNumber" :required="true"
                                        :formMeta="{ ...meta, validated: formHasValidated }" v-model="accountNumberConfirm">
                                        <template #input-group-content>
                                            <fs-button pill variant="outline-green" class="px-2 mt-2 mx-2"
                                                style="height: 19px; width: 30px"
                                                @click="hideAccountNumberConfirm = !hideAccountNumberConfirm">
                                                <font-awesome-icon
                                                    :icon="['fal', hideAccountNumberConfirm ? 'eye-slash' : 'eye']"
                                                    size="sm" />
                                            </fs-button>
                                        </template>
                                    </fs-input>
                                </fs-col>
                                <fs-col cols="12">
                                    <upload-file v-model:file="file" title="Voided Check" :acceptFileList="acceptFileList"
                                        v-model:isValid="isFileUploadValid" @removefile="removefile"
                                        :selectedFile="selectedRow.file" :filePath="selectedRow.voidedCheckFilePath"
                                        ref="uploadFileComponent"></upload-file>
                                </fs-col>
                                <fs-col cols="12">
                                    <fs-input type="fsTextArea" label="Description" :rules="{ required: false, max: 30 }"
                                        rows="3" :maxlength="30" name="description" :required="false"
                                        :formMeta="{ ...meta, validated: formHasValidated }"
                                        v-model="selectedRow.description">
                                    </fs-input>
                                </fs-col>
                            </fs-row>

                                </div>
                            </fs-col>
                        </fs-row>
                    </fs-container>
                    <fs-container fluid class="border-top">
                        <fs-row>
                            <fs-col cols="6" class="contain py-2 border-end"> <!-- LEFT FOOTER -->
                                <fs-popper hover tooltip class="d-flex" v-if="!(disableEdit || isEditMode)"
                                    :content="disableEdit ? MESSAGE.DIRECT_DEPOSIT.CANNOT_ADD_TEXT : ''" placement="bottom">
                                    <fs-button variant="cyan" :disabled="disableEdit || isEditMode" @click="onAddClick()">
                                        <font-awesome-icon icon="fal fa-circle-plus" class="me-2" />
                                        {{ MESSAGE.DIRECT_DEPOSIT.ADD_ACCOUNT }}
                                    </fs-button>
                                </fs-popper>
                            </fs-col>
                            <fs-col cols="6" class="py-2 contain d-flex flex-row-reverse"> <!-- RIGHT FOOTER -->
                                <fs-button v-if="isEditMode" variant="cyan" class=""
                                    :disabled="(!meta.valid && !isSaveEnabled) || !isFileUploadValid" @click="onSaveForm()">
                                    {{ MESSAGE.COMMON.SAVE }}
                                </fs-button>
                                <fs-button v-if="isEditMode" variant="outline-secondary"  class="me-2"
                                    @click="onEditCancelClick()">
                                    {{ MESSAGE.COMMON.CANCEL }}
                                </fs-button>
                            </fs-col>
                        </fs-row>                    
                    </fs-container>

                </VeeForm>            
            </div>
        </div>



        <!-- <div class="d-flex justify-content-between align-items-center h-100"> -->

        <!-- </div> -->
        <!-- START : UNCOMMENT THIS CODE TO ENABLE UNSUBMITTED CHANGES -->
        <!-- <route-change-detector v-model:showDetectionModal="showSubmitNotificationnModal"
            :is-pending="hasPendingAccountToSubmit && !overrideHasPendingAccountToSubmit" @OK="onSubmitClick"
            @NO="onSubmitLater" @CANCEL="showSubmitNotificationnModal = false" :ok-title="MESSAGE.COMMON.SUBMIT_NOW"
            :no-title="MESSAGE.COMMON.SUBMIT_LATER" :title="MESSAGE.DIRECT_DEPOSIT.SUNMIT_NOTIFIICATION_TITLE">
            {{ MESSAGE.DIRECT_DEPOSIT.SUNMIT_NOTIFIICATION_MESSSAGE }}
        </route-change-detector> -->
        <!-- END : UNCOMMENT THIS CODE TO ENABLE UNSUBMITTED CHANGES -->

        <!-- confirmation modal for discard changes -->
        <confirmationModal :size="'lg'" v-model:showConfirmationModal="showConfirmationModal" @OK="okChanges()"
            @DISCARD="discardAllChanges()" :yes-title="confirmationModalYesTitle" :no-title="confirmationModalNoTitle"
            :discard-title="confirmationModalDiscardTitle" :show-discard="confirmationModalShowDiscard"
            :title="confirmationModalTitle" @CANCEL="triggerConfirmationModal(null)">
            {{ confirmationModalMessage }}
        </confirmationModal>

        <!-- delete confirmation modal -->
        <deleteConfirmationModal v-model:showDeleteModal="showDeleteModal" @OK="proceedDirectDepositDelete()"
            @CANCEL="showDeleteModal = false">
            <span>
                {{ MESSAGE.DIRECT_DEPOSIT.DELETE_CONFIRMATION_MESSAGE }}
                <div class="pt-2">
                    <div v-if="selectedRow" class="d-flex mb-1 fw-bold align-items-center">
                        <span class="d-flex border border-info border border-2 rounded-2 px-2">{{
                            selectedRow.ordinalPosition }}</span>
                        <span class="ps-2">
                            {{ `${selectedRow.accountTypeName ?? 'New Account'} ${maskify(selectedRow.bankAccountNumber) ??
                                ''
                                } ` }}
                        </span>
                    </div>
                </div>
            </span>
        </deleteConfirmationModal>

        <failureList v-model:showModal="showFailureList" :title="failureTitle" :warning="failureWarning"
            :failures="failures" failureClass="top-level-page__list" :descriptionName="'Error'">
            <!-- Error for Distribution Method Rules -->
            <template v-slot:custom>
                <fs-row class="fl_validation_message">
                    <fs-col cols="1" class="icon">
                        <font-awesome-icon class="text-warning me-2"
                            :icon="['fa', 'exclamation-triangle']"></font-awesome-icon>
                    </fs-col>
                    <fs-col class="text">
                        <span v-html="failureWarning"></span>
                    </fs-col>
                </fs-row>
                <fs-container v-if="showPercentageDistributionValidationErrorModel" fluid class="w-100 d-inline-block">
                    <fs-table responsive id="percentagedistribution_failure_table" ref="percentageDistributionFailureTable"
                        show-empty small thead-tr-class="list__tr list__tr--thead" tbody-tr-class="list__tr list__tr--tbody"
                        :items="percentDistributionMethodAccount" :fields="percentageRuleTableFields">
                        <template #cell(name)="data">
                            {{ data.value }}
                        </template>
                        <template #cell(value)="data">
                            {{ data.value }}%
                        </template>
                    </fs-table>
                </fs-container>
            </template>
        </failureList>
    </div>
</template>
<script setup lang="ts">
import { fsBryntumGridConfig } from "@/plugins/vue/bryntumGrid/defaults/gridConfigDefaults";
import { GridBase, Store } from "@bryntum/grid";
import { BryntumGrid } from "@bryntum/grid-vue-3";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCirclePlus, faEye, faEyeSlash, faPenToSquare, faPlus, } from "@fortawesome/pro-light-svg-icons";
import { faAsterisk, faExclamationCircle, faUpload, faExclamationTriangle } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { storeToRefs } from "pinia";
import _ from "lodash";
import { onBeforeRouteLeave, useRouter } from "vue-router";
import { useAlerts } from '@/composables/useAlerts';
import { useEmployeeDirectDepositStore } from "@/stores/employeeDirectDepositStore";
import { Ref, onMounted, ref, watch, computed, ComputedRef, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";
import { Form as VeeForm, FormValidationResult } from 'vee-validate';
import { PanelConfig } from "@/models/panelConfig";
import { MESSAGE } from "@/data/message";
import { formatPath, maskify, uniqueFileName } from '@/helper/hqSuite/formatHelper';
import DetailsPanelInfo from "@/models/detailsPanelInfo";
import { focusOnError, focusOnFirstError } from "@/functions/ValidationUtilityFunctions";
import { NamedEntity } from "@/models/namedEntity";
import { DetailValueEntity } from "@/models/detailValueEntity";
import { DistributionMethod } from "@/enums/DistributionMethod";
import { DocumentTypes, makeDocumentPath } from "@/helper/hqSuite/pathHelper";
import { useAzureB2CAuthStore } from "@/stores/azureB2CAuthStore";
import { useDirectDeposit } from "@/composables/useDirectDeposit";
import { EssApprovalStatus } from "@/enums/EssApprovalStatus";
import { dataIsModified } from '@/functions/InputUtilityFunction';
import { ExtendedEmployeeDirectDeposit } from "@/models/directDeposit/extendedEmployeeDirectDeposit";
import { useHQSuiteStore } from "@/stores/hqSuiteStore";
import { capitalizeFirstChar, encodeBase64 } from "@/functions/FormatterUtilityFunction";
import { ExtendedUploadFileModel } from "@/models/hqSuite/hqUploadFile";
import { HQSuiteRecordItem } from "@/models/hqSuite/HQSuiteRecordItem";
import uploadFile from "@/components/shared/uploadFile.vue";
import detailItem from '@/components/shared/detailsPanel/detailItem.vue';
import confirmationModal from '@/components/shared/confirmationModal.vue';
import routeChangeDetector from '@/components/shared/routeChangeDetector.vue';
import deleteConfirmationModal from '@/components/shared/deleteConfirmationModal.vue';
import failureList from '@/components/shared/failureList.vue';
import { FailureItem } from "@/models/error/failureItem";
import { PayrollAndTaxTab } from "@/enums/PayrollAndTaxTab";

library.add(faAsterisk, faPenToSquare, faEye, faPlus, faEyeSlash, faExclamationCircle, faUpload, faCirclePlus, faExclamationTriangle);

enum ConfirmationModelSource {
    Submit,
    Save,
    NewAccountEditCancel,
    NewAccountSubmitCancel
}

enum ValidationType {
    AccountType,
    DistributionMethod,
    DistributionMethodRules,
    RemainingAccount,
    ModelValidation,
    APIError
}
const acceptFileList = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
];
const { notifySuccess, notifyError } = useAlerts();
const route = useRoute();
const employeeDirectDepositStore = useEmployeeDirectDepositStore();
const azureB2CAuthStore = useAzureB2CAuthStore();
const hqSuiteStore = useHQSuiteStore();
const { submitAPIError, masterData, directDepositsToSubmit, originalAccountList, employeeAccountList } = storeToRefs(employeeDirectDepositStore);
const selectedOrdinalPosition = ref<number>(null);
const employeeId: ComputedRef<number> = computed(() => +route.params?.id?.toString());
const refreshList = async () => {
    await employeeDirectDepositStore.fetchEmployeeDirectDeposits(employeeId.value, true);
    await customSort();
}
const {
    proceedDirectDepositDelete,
    onDeleteDirectDepositClick,
    hasPendingAccountToSubmit,
    showDeleteModal,
    selectedRow,
} = useDirectDeposit<ExtendedEmployeeDirectDeposit>(refreshList, employeeId.value);

const router = useRouter();
const selectedAccountType: Ref<NamedEntity> = ref(new NamedEntity());
const selectedDistributionMethod: Ref<NamedEntity> = ref(new NamedEntity());
const selectedDirectDepositId = ref(null);
const selectedStatus: Ref<NamedEntity> = ref(null);

const showFailureList = ref(false);
const failures: Ref<FailureItem[]> = ref([]);
const failureTitle = ref('');
const failureWarning = ref('');
const isFileUploadValid = ref(true);
const isSaveEnabled = ref(false);
const hideAccountNumber = ref(true);
const hideRoutingNumber = ref(true);
const hideAccountNumberConfirm = ref(true);
const canSubmit = ref(false);
const accountNumberConfirm = ref("");
const observer = ref();
const showConfirmationModal = ref(false);
const confirmationModalTitle = ref('');
const confirmationModalMessage = ref('');
const confirmationModalYesTitle = ref('Yes');
const confirmationModalNoTitle = ref('No');
const confirmationModalDiscardTitle = ref('Discard');
const confirmationModalShowDiscard = ref(false);
const showSubmitNotificationnModal = ref(false);
const isEditMode = ref(false);
const isNewAccount = ref(false);
const selectedDetails: Ref<DetailsPanelInfo[]> = ref();
const formHasValidated = ref(false);
const grid = ref(null);
const uploadFileComponent = ref<InstanceType<typeof uploadFile>>(null);
const disableRemainderAccount = ref<boolean>(false);
const activeStatusList = [new NamedEntity({ id: 1, name: MESSAGE.COMMON.ACTIVE }), new NamedEntity({ id: 0, name: MESSAGE.COMMON.INACTIVE })];
const file = ref(null);
const overrideHasPendingAccountToSubmit = ref(false);
const showPercentageDistributionValidationErrorModel = ref(false);
const percentDistributionMethodAccount: Ref<DetailValueEntity[]> = ref([]);
const sumOfDistributionMethodAccountAmount = ref();
const confirmationModalSource = ref<ConfirmationModelSource>(ConfirmationModelSource.Submit);
const originalSelectedAccount: Ref<ExtendedEmployeeDirectDeposit> = ref();
const detailsPanelConfig = ref(new PanelConfig({
    title: MESSAGE.DIRECT_DEPOSIT.ACCOUNT_DETAILS,
    showFooter: false,
    showHeader: true
}));

const percentageRuleTableFields: any[] = [
    {
        key: 'title',
        label: 'Account Number',
        thClass: `list__th`,
        tdClass: `list__td list__td--50`,
    },
    {
        key: 'value',
        label: 'Distribution Amount (%)',
        thClass: `list__th`,
        tdClass: `list__td list__td--50`,
    }];

// COMPUTED PROPERTY 
const clientId = computed(() => azureB2CAuthStore?.activeUserClient?.clientGuid ?? 'Shared');
const disableEdit = computed(() =>
    originalAccountList.value?.filter(x => x.approvalStatusId == EssApprovalStatus.PendingFoundation)?.length > 0
);
const orderedDetails = computed(() => _.sortBy(selectedDetails.value, 'order'));
const directDepositId: ComputedRef<string> = computed(() => route.params?.directDepositId?.toString());
const isRemainingAccountAvailable = computed(() => employeeAccountList.value?.findIndex(x => x.distributionMethodId === DistributionMethod.Remaining) > -1);
const canSubmitNew = computed(() => hasPendingAccountToSubmit.value && isRemainingAccountAvailable.value);
const folderPath = computed(async () => formatPath(await makeDocumentPath(DocumentTypes.EmployeeDirectDepositDocument, clientId.value, employeeId.value.toString())));
const newAccountOnly: ComputedRef<boolean> = computed(() => employeeAccountList.value.length == 1
    && employeeAccountList.value[0] && employeeAccountList.value[0].isNew && !employeeAccountList.value[0].isValid);
const newAccountOnlyWithoutValidCheck: ComputedRef<boolean> = computed(() => employeeAccountList.value.length == 1
    && employeeAccountList.value[0] && employeeAccountList.value[0].isNew);
const nextOrdinalPosition: ComputedRef<number> = computed(() => {
    const maxOrdinalPosition = _.maxBy(employeeAccountList.value, 'ordinalPosition');
    return (maxOrdinalPosition ? maxOrdinalPosition.ordinalPosition : 0) + 1;
});

const noSelectedAccounts = computed(() => {
    return employeeAccountList.value.filter(a => a.employeeDirectDepositId !== selectedRow.value?.employeeDirectDepositId);
});

const gridInstance: ComputedRef<GridBase> = computed(() => grid.value?.instance.value);
const gridStore = new Store({
    ...fsBryntumGridConfig.gridStoreConfig,
});

const isPercentageDistributionMethod = computed(() => {
    return (selectedDistributionMethod.value &&
        (selectedDistributionMethod.value.id === DistributionMethod.Percent_Of_Net
            || selectedDistributionMethod.value.id === DistributionMethod.Percent_Of_Remaining));
});

const isDistributionAmountEnabled = computed(() => {
    return (selectedDistributionMethod.value && selectedDistributionMethod.value.id === DistributionMethod.Dollar_Amount);
});

const gridConfig = ref({
    // minHeight: "78em",
    autoHeight: true,
    selectionMode: {
        cell: false,
        row: false
    },
    features: {
        cellEdit: false,
        columnResize: false,
        enableCellContextMenu: false,
        tooltipRenderer: false,
        headerMenu: {
            disabled: false,
        },
        // sorting by name
        rowReorder: {
            showGrip: true,
            listeners: {
                // Prevent drag Remaining Account
                gridRowBeforeDragStart: ({ context }) => {
                    return !isEditMode.value && (context.records[0].data.distributionMethodId !== DistributionMethod.Remaining && employeeAccountList.value.length > 2);
                },
                gridRowDrop: async ({ context }) => {
                    const sortedData = gridStore.toJSON() as ExtendedEmployeeDirectDeposit[];
                    await customSort(sortedData.map(x => new ExtendedEmployeeDirectDeposit(x)));
                    canSubmit.value = true;
                    selectedRow.value = new ExtendedEmployeeDirectDeposit(context.records[0].data);
                    selectedOrdinalPosition.value = selectedRow.value.ordinalPosition;
                    selectRow();
                },
            },
        },
    },
    emptyText: "",
    columns: [
        {
            flex: 4,
            groupable: false,
            sortable: false,
            select: false,
            text: "Sequence",
            htmlEncode: false,
            enableCellContextMenu: false,
            enableHeaderContextMenu: false,
            renderer: ({ record, cellElement }) => {
                const isActive = record.isActive;
                const ordinalPosition = record.ordinalPosition;
                const isRemainingAccount = record.distributionMethodId === DistributionMethod.Remaining;
                if (isRemainingAccount || employeeAccountList.value.length <= 2 || isEditMode.value) {
                    cellElement.classList.add('hide-grip-icon');
                }
                let statusClass = isActive ? 'text--status-active' : 'text--status-inactive';
                if (record.approvalStatusId === EssApprovalStatus.PendingHRM || record.approvalStatusId === EssApprovalStatus.PendingFoundation) {
                    statusClass = 'text--status-pending';
                }
                return {
                    class: `d-flex align-items-center`,
                    children: [
                        {
                            style: {
                                border: `solid 1px #03A9F4`,
                            },
                            class: `py-1 px-2 me-2 text-blue fw-bold`,
                            text: `${isRemainingAccount ? `R` : ordinalPosition}`,
                        },
                        {
                            class: `${statusClass} b-fa-solid b-fa-circle fs-7 pe-2 rounded-circle`,
                            html: `<div class="p-1"><div/>`,
                            style: {
                                height: '8px'
                            }
                        },
                        {
                            class: `me-2 fw-bold`,
                            text: `${record.accountTypeName ? capitalizeFirstChar(record.accountTypeName) : MESSAGE.DIRECT_DEPOSIT.NEW_ACCOUNT}`,
                        },
                        {
                            class: `fw-bold`,
                            html: `${record.bankAccountNumber ? maskify(record.bankAccountNumber) : ""}`,
                        },
                    ]
                };
            }
        },
        {
            flex: 1,
            type: 'action',
            id: 'action',
            text: '',
            columnDragToolbar: false,
            enableHeaderContextMenu: false,
            enableCellContextMenu: false,
            width: 100,
            maxWidth: 100,
            cellCls: 'b-action-cell--hover justify-content-end px-3',
            actions: [
                {
                    visible: ({ record }: any) => checkDeleteIsAllowed(record.data),
                    renderer: () => {
                        return '<i class="b-action-item b-fa b-fa-trash-alt cursor-pointer no-underline text-danger"></i>';
                    },
                    onClick: onDeleteDirectDepositClick
                },
            ],
        }
    ],
    listeners: {
        cellClick: async ({ column, record }: { record: any; column: any }) => {
            if (column.type !== "action" && !isEditMode.value) {
                selectedRow.value = new ExtendedEmployeeDirectDeposit(record?.data);
                selectedOrdinalPosition.value = record.ordinalPosition;
                selectRow();
            }
        },
        beforeselectionChange: (event) => {
            //Enable selection for Create mode 
            if (selectedRow.value?.isNew) {
                return true;
            }
            //Restrict row selection when in edit mode 
            return !isEditMode.value;
        }
    },
});

async function populateBryntumStore() {
    gridStore.data = employeeAccountList.value;
}

function checkDeleteIsAllowed(data: ExtendedEmployeeDirectDeposit) {
    if (isEditMode.value) {
        return selectedRow.value?.ordinalPosition === data.ordinalPosition && data.employeeDirectDepositId > 0;
    } else {
        return data.employeeDirectDepositId > 0 && data.distributionMethodId !== DistributionMethod.Remaining;
    }
}

async function populateMasterData() {
    await employeeDirectDepositStore.getEmployeeDirectDepositsMasterData(employeeId.value);
}

const resetForm = async () => {
    file.value = null;
    selectedRow.value = new ExtendedEmployeeDirectDeposit();
    selectedRow.value.file = null;
    selectedAccountType.value = null;
    selectedDistributionMethod.value = null;
    selectedStatus.value = null;
    accountNumberConfirm.value = "";
    formHasValidated.value = false;
    isSaveEnabled.value = false;
    await observer.value?.setFieldTouched(false);
    await observer.value?.resetForm();
}

const removefile = async () => {
    file.value = null;
    selectedRow.value.voidedCheckFilePath = "";
    selectedRow.value.file = null;
}

async function disableRemainderAccountDistributionMethod() {
    masterData.value?.distributionMethodList?.forEach((x: NamedEntity) => {
        x.$isDisabled = (disableRemainderAccount.value && x.id === DistributionMethod.Remaining);
    });
}

async function customSort(sortedGridData: any = null) {
    const directDepositAccountList = sortedGridData ?? employeeAccountList.value;
    disableRemainderAccount.value = false;
    if (directDepositAccountList && directDepositAccountList.length > 0) {
        // Set ordinal position based on UI records
        let initialValue = 1;
        directDepositAccountList.forEach(item => {
            if (item.distributionMethodId === DistributionMethod.Remaining) {
                item.ordinalPosition = - 1;
                disableRemainderAccount.value = true;
            } else {
                item.ordinalPosition = initialValue++;
            }
        });
        const sortedEmployeeAcountList = _.sortBy(directDepositAccountList, (e: ExtendedEmployeeDirectDeposit) => {
            return e.ordinalPosition
        });
        // Remove remainder account and append it at last
        if (disableRemainderAccount.value) {
            const remainingAccountIndex = sortedEmployeeAcountList.findIndex(x => x.distributionMethodId === DistributionMethod.Remaining);
            const remainingAccount = sortedEmployeeAcountList[remainingAccountIndex];
            sortedEmployeeAcountList.splice(remainingAccountIndex, 1);
            if (remainingAccount)
                sortedEmployeeAcountList.push(remainingAccount);
        }
        employeeAccountList.value = sortedEmployeeAcountList.filter(x => x);
        await populateBryntumStore();
        //Push to submit changes when it sequence reordered
        if (sortedGridData) {
            employeeDirectDepositStore.assignEmployeeDirectDeposits(sortedEmployeeAcountList);
        }
    }
    disableRemainderAccountDistributionMethod();
}

const triggerConfirmationModal = (source: ConfirmationModelSource) => {
    confirmationModalSource.value = source;
    showConfirmationModal.value = source != null ? true : false;
    if (source === ConfirmationModelSource.Submit) {
        // navigateToDirectDepositList();
        confirmationModalTitle.value = MESSAGE.COMMON.DISCARD_CHANGES_TITLE;
        confirmationModalMessage.value = MESSAGE.COMMON.DISCARD_CHANGES_MESSAGE;

        confirmationModalYesTitle.value = MESSAGE.COMMON.YES;
        confirmationModalNoTitle.value = MESSAGE.COMMON.NO;
        confirmationModalDiscardTitle.value = MESSAGE.COMMON.DISCARD;
        confirmationModalShowDiscard.value = false;

    } else if (source === ConfirmationModelSource.Save) {
        confirmationModalTitle.value = MESSAGE.COMMON.CANCEL_CONFIRMATION_TITLE;
        confirmationModalMessage.value = MESSAGE.COMMON.CANCEL_CONFIRMATION_MESSAGE;

        confirmationModalYesTitle.value = MESSAGE.COMMON.SAVE;
        confirmationModalNoTitle.value = MESSAGE.COMMON.CANCEL;
        confirmationModalDiscardTitle.value = MESSAGE.COMMON.DISCARD;
        confirmationModalShowDiscard.value = true;
    } else if (source === ConfirmationModelSource.NewAccountEditCancel) {
        confirmationModalTitle.value = MESSAGE.COMMON.WARNING;
        confirmationModalMessage.value = MESSAGE.DIRECT_DEPOSIT.NEW_ACCOUNT_CANCEL;

        confirmationModalYesTitle.value = MESSAGE.COMMON.YES;
        confirmationModalNoTitle.value = MESSAGE.COMMON.NO;
        confirmationModalShowDiscard.value = false;
    }
    else if (source === ConfirmationModelSource.NewAccountSubmitCancel) {
        confirmationModalTitle.value = MESSAGE.DIRECT_DEPOSIT.NEW_ACCOUNT_SUBMIT_CANCEL_TITLE;
        confirmationModalMessage.value = MESSAGE.DIRECT_DEPOSIT.NEW_ACCOUNT_SUBMIT_CANCEL;

        confirmationModalYesTitle.value = MESSAGE.COMMON.OK;
        confirmationModalNoTitle.value = MESSAGE.COMMON.CANCEL;
        confirmationModalShowDiscard.value = false;
    }
}

const cancelSubmit = () => {
    navigateToDirectDepositList();
}

const cancelSave = async (isNewAccountOnly: boolean = false) => {
    if (isNewAccountOnly) {
        resetForm();
    }
    else {
        if (selectedRow.value && selectedRow.value.isNew && !selectedRow.value.isValid) {
            await employeeDirectDepositStore.removeDirectDepositData(selectedRow.value?.employeeDirectDepositId);
            await refreshList();
            selectDefaultRow();
        } else {
            selectedRow.value = _.cloneDeep(originalSelectedAccount.value);
        }
        isEditMode.value = false;
        isNewAccount.value = false;
        originalSelectedAccount.value = null;
    }
}

const selectRow = (newRowId = undefined) => {
    isNewAccount.value = selectedRow.value.isNew;
    populateDataToViewDirectDeposit();
    gridRowSelection(newRowId);
}

const selectDefaultRow = () => {
    if (employeeAccountList.value?.length > 0) {
        const selectedDirectDeposit = employeeAccountList.value[0];
        setDataForRightPanel(selectedDirectDeposit, false);
        gridRowSelection();
    }

}
const gridRowSelection = (newRowId = undefined) => {
    gridInstance.value.refreshRows();
    setTimeout(() => {
        gridInstance.value.selectRow({ record: (selectedRow.value as any).id, scrollIntoView: true });
    }, 100);
}

const discardAllChanges = async () => {
    if (confirmationModalSource.value === ConfirmationModelSource.Submit) {
        cancelSubmit();
    }
    else if (confirmationModalSource.value === ConfirmationModelSource.Save) {
        cancelSave();
    }
}

const okChanges = async () => {
    if (confirmationModalSource.value === ConfirmationModelSource.Submit || confirmationModalSource.value === ConfirmationModelSource.NewAccountSubmitCancel) {
        cancelSubmit();
    }
    else if (confirmationModalSource.value === ConfirmationModelSource.Save) {
        onSaveForm();
    }
    else if (confirmationModalSource.value === ConfirmationModelSource.NewAccountEditCancel) {
        cancelSave(true);
    }
}

const populateDataForEdit = async (selectedData: ExtendedEmployeeDirectDeposit) => {
    selectedRow.value = new ExtendedEmployeeDirectDeposit(selectedData);
    selectedOrdinalPosition.value = selectedRow.value.ordinalPosition;
    selectedRow.value.ordinalPosition = selectedOrdinalPosition.value;
    accountNumberConfirm.value = selectedRow.value.bankAccountNumber;
    populateDropdownValues();
    // re-populate store
    gridStore.data = [];
    gridStore.data = employeeAccountList.value;
    selectRow();
}

async function pushDataToSubmitList(data: ExtendedEmployeeDirectDeposit, isNew = true) {
    const newRequest = new ExtendedEmployeeDirectDeposit(data);
    if (isNew && newRequest.isNew && !newRequest.isValid) {
        const ids = employeeAccountList.value.map(x => x.employeeDirectDepositId);
        newRequest.employeeDirectDepositId = (_.max(ids) ?? 0) + 1;
        newRequest.approvalStatusId = EssApprovalStatus.PendingFoundation;

        selectedRow.value = newRequest;
    }
    if (newRequest) {
        newRequest.employeeId = employeeId.value;
        await employeeDirectDepositStore.upsertEmployeeDirectDeposits(newRequest);
    }
    await refreshList();
}

async function populateDataToViewDirectDeposit(): Promise<void> {
    accountNumberConfirm.value = String(selectedRow.value.bankAccountNumber);
    detailsPanelConfig.value.source = selectedRow.value;
    detailsPanelConfig.value.subTitle = `${selectedRow.value.accountTypeName} ${maskify(selectedRow.value.bankAccountNumber)}`;
    selectedDetails.value = DetailsPanelInfo.ConvertDirectDeposit(selectedRow.value);
    if (selectedRow.value.employeeDirectDepositId > 0) {
        populateDropdownValues();
    }
}

function populateDropdownValues() {

    if (selectedRow.value && selectedRow.value.accountTypeId) {
        selectedAccountType.value = { id: selectedRow.value.accountTypeId, name: masterData.value?.accountTypeList?.find((s) => s.id == selectedRow.value.accountTypeId)?.name, $isDisabled: false };
    }
    else {
        selectedAccountType.value = null;
    }
    if (selectedRow.value && selectedRow.value.distributionMethodId) {
        selectedDistributionMethod.value = { id: selectedRow.value.distributionMethodId, name: masterData.value?.distributionMethodList?.find((s) => s.id == selectedRow.value.distributionMethodId)?.name, $isDisabled: false };
    } else {
        selectedDistributionMethod.value = null;
    }
    const statusId = selectedRow.value.isActive ? 1 : 0;
    selectedStatus.value = { id: statusId ? 1 : 0, name: activeStatusList?.find((s) => s.id == statusId)?.name, $isDisabled: false };
}

async function populateRightPanel() {
    if (!Number.isNaN(Number(directDepositId.value))) {
        selectedDirectDepositId.value = parseInt(directDepositId.value);
    }
    //Edit Mode
    if (selectedDirectDepositId.value && (employeeAccountList.value && employeeAccountList.value.length > 0)) {
        const selectedDirectDeposit = employeeAccountList.value.filter((s) => s.employeeDirectDepositId == selectedDirectDepositId.value)[0];
        await setDataForRightPanel(selectedDirectDeposit, true);
    }
    //View Mode
    else if (employeeAccountList.value && employeeAccountList.value.length > 0) {
        await setDataForRightPanel(employeeAccountList.value[0], false);
    }
    //Create Mode
    else {
        await createNewAccount();
    }
    await populateBryntumStore();
    selectRow();
}

async function createNewAccount() {
    selectedRow.value = new ExtendedEmployeeDirectDeposit();
    selectedRow.value.employeeDirectDepositId = 0;
    selectedRow.value.employeeId = +employeeId.value;
    selectedRow.value.isPrenoteRequired = true;
    selectedRow.value.isNew = true;
    selectedRow.value.isActive = true;
    isNewAccount.value = true;
    isEditMode.value = true;
    selectedOrdinalPosition.value = nextOrdinalPosition.value;
    selectedRow.value.ordinalPosition = selectedOrdinalPosition.value;
    await pushDataToSubmitList(selectedRow.value);
    await populateDataToViewDirectDeposit();
}

async function setDataForRightPanel(selectedDirectDeposit: ExtendedEmployeeDirectDeposit, isEdit: boolean) {
    selectedRow.value = selectedDirectDeposit;
    isNewAccount.value = false;
    isEditMode.value = isEdit;
    await populateDataToViewDirectDeposit();
    if (isEdit) {
        await onEditClick();
    }
}
// #endregion LifeCycle

// #region Event 
const onGoBackClick = () => {
    navigateToDirectDepositList();
}

const onCancelSubmitClick = () => {
    if (newAccountOnlyWithoutValidCheck.value) {
        triggerConfirmationModal(ConfirmationModelSource.NewAccountSubmitCancel);
    }
    else if (hasPendingAccountToSubmit.value) {
        triggerConfirmationModal(ConfirmationModelSource.Submit);
    } else {
        cancelSubmit();
    }
}

const onEditClick = async () => {
    isNewAccount.value = false;
    isEditMode.value = true;
    const selectedData = selectedRow.value;
    originalSelectedAccount.value = _.cloneDeep(selectedRow.value);
    await resetForm();
    await populateDataForEdit(selectedData);
}

const onEditCancelClick = async () => {
    if (newAccountOnly.value) {
        triggerConfirmationModal(ConfirmationModelSource.NewAccountEditCancel);
    } else {
        if (dataIsModified(originalSelectedAccount.value, selectedRow.value) || isSaveEnabled.value) {
            triggerConfirmationModal(ConfirmationModelSource.Save);
        } else {
            cancelSave();
        }
    }
}
async function onSubmitLater() {
    if (newAccountOnly.value) {
        await employeeDirectDepositStore.removeDirectDepositData(employeeAccountList.value[0].employeeDirectDepositId);
    }
    overrideHasPendingAccountToSubmit.value = true;
    showSubmitNotificationnModal.value = false;
}

function navigateToDirectDepositList() {
    router.push({ name: 'payrollAndTaxes', params: { id: employeeId.value, tab: PayrollAndTaxTab.DirectDeposit } });
}

function showValidationModel(type: ValidationType, failureList: FailureItem[] = []) {
    showFailureList.value = true;
    showPercentageDistributionValidationErrorModel.value = false;
    switch (type) {
        case ValidationType.AccountType:
            failures.value = [];
            failureTitle.value = "Account Type";
            failureWarning.value = 'Account Type is mandatory.';
            break;
        case ValidationType.DistributionMethod:
            failures.value = [];
            failureTitle.value = "Distribution Method";
            failureWarning.value = 'Distribution Method is mandatory.';
            break;
        case ValidationType.DistributionMethodRules:
            failures.value = [];
            failureTitle.value = "Distribution Amount (%) Rules";
            failureWarning.value = MESSAGE.DIRECT_DEPOSIT.PERCENT_DISTRIBUTION_AMOUNT_EXCEED;
            showPercentageDistributionValidationErrorModel.value = true;
            break;
        case ValidationType.ModelValidation:
            failures.value = failureList;
            failureTitle.value = "Submit Direct Deposit";
            failureWarning.value = "Error while submiting direct deposit accounts.";
            break;
        case ValidationType.APIError:
            failures.value = submitAPIError.value.failureItems;
            failureWarning.value = "Error while submiting direct deposit accounts.";
            failureTitle.value = "Submit Direct Deposit";
            break;
        default:

            break;
    }
}

function validatePercentDistributionAmount(): boolean {
    percentDistributionMethodAccount.value = directDepositsToSubmit.value
        .filter(x => x.distributionMethodId === DistributionMethod.Percent_Of_Net && x.isActive)
        .map(account => new DetailValueEntity({ value: account.distributionAmount, title: account.accountTypeName + ' ' + maskify(account.bankAccountNumber) }));
    if (percentDistributionMethodAccount.value && percentDistributionMethodAccount.value.length > 0) {
        sumOfDistributionMethodAccountAmount.value = _.sumBy(percentDistributionMethodAccount.value, 'value');
        if (sumOfDistributionMethodAccountAmount.value > 100) {
            percentDistributionMethodAccount.value.push(new DetailValueEntity({ value: sumOfDistributionMethodAccountAmount.value, title: 'Total' }));
            showValidationModel(ValidationType.DistributionMethodRules);
            return false;
        }
    }
    return true;
}

function validateDirectDepositAccounts(): boolean {
    if (!validateDirectDepositModel()) {
        return false;
    }
    if (!validatePercentDistributionAmount()) {
        return false;
    }
    return true;
}

function validateDirectDepositModel() {
    let hasRemainderAccount = false;
    const ddDailureItems: FailureItem[] = [];
    const submitData = _.cloneDeep(directDepositsToSubmit.value);
    submitData.forEach((account: ExtendedEmployeeDirectDeposit) => {
        if (!account.accountTypeId) {
            ddDailureItems.push(new FailureItem({ failureTitle: 'Account Type', failureReason: 'AccountType is mandatory' }));
        }
        if (!account.distributionMethodId) {
            ddDailureItems.push(new FailureItem({ failureTitle: 'Distribution Method', failureReason: 'DistributionMethod is mandatory' }));
        }
        if (!account.bankAccountNumber) {
            ddDailureItems.push(new FailureItem({ failureTitle: 'Bank Account Number', failureReason: 'BankAccountNumber is mandatory' }));
        }
        if (!account.bankRoutingNumber) {
            ddDailureItems.push(new FailureItem({ failureTitle: 'Bank Routing Number', failureReason: 'BankRoutingNumber is mandatory' }));
        }
        if (account.distributionMethodId === DistributionMethod.Remaining && account.isActive) {
            hasRemainderAccount = true;
        }
    });
    if (!hasRemainderAccount) {
        ddDailureItems.push(new FailureItem({ failureTitle: 'Remainder Account', failureReason: MESSAGE.DIRECT_DEPOSIT.REMAINDER_ACCOUNT_MANDATORY }));
    }
    const isValid = ddDailureItems.length <= 0;
    if (!isValid) {
        showValidationModel(ValidationType.ModelValidation, ddDailureItems);
    }
    return isValid;
}

async function onSubmitClick() {
    if (validateDirectDepositAccounts()) {
        let uploadedFiles: any = [];
        let hasFileUploadSucess: boolean = true;
        try {
            const filesToUpload = directDepositsToSubmit.value
                .filter(x => !_.isEmpty(x.file))
                .map(x => x.file);
            if (filesToUpload.length > 0) {
                uploadedFiles = await hqSuiteStore.uploadBatchDocuments(filesToUpload, true);
            }
        } catch {
            notifyError(`Error while uploading document`);
            hasFileUploadSucess = false;
        }
        if (hasFileUploadSucess) {
            const dataToSubmit = directDepositsToSubmit.value.map(element => {
                if (element.file) {
                    const uploadedFile = uploadedFiles.find(x => x.id === element.file.uniqueFileName);
                    if (uploadedFile) {
                        const hqSuiteRecord = new HQSuiteRecordItem(uploadedFile.data);
                        if (hqSuiteRecord && hqSuiteRecord.path != '')
                            element.voidedCheckFilePath = hqSuiteRecord.path;
                    }
                }
                element.employeeId = +employeeId.value;
                if (element.isNew) {
                    element.employeeDirectDepositId = 0;
                    element.isPrenoteRequired = true;
                }
                return element;
            });

            if (await employeeDirectDepositStore.submitDirectDeposit(
                dataToSubmit, employeeId.value)) {
                await onSuccessSubmit();
            } else {
                if (!submitAPIError.value.statusCode.toString().startsWith('2')) {
                    if (submitAPIError.value.failureItems.length > 0) {
                        showValidationModel(ValidationType.APIError);
                    } else {
                        notifyError(`${submitAPIError.value.statusCode} - ${submitAPIError.value?.content?.data?.detail}`);
                    }
                } else {
                    // No record is changed
                    await onSuccessSubmit();
                }
            }
        }
    }
}

async function onSuccessSubmit() {
    notifySuccess(MESSAGE.DIRECT_DEPOSIT.SUBMIT_SUCCESS);
    await employeeDirectDepositStore.clearUpsertEmployeeDirectDeposits();
    navigateToDirectDepositList();
    await refreshList();
}

const onAddClick = async () => {
    await resetForm();
    await createNewAccount();
    await customSort();
    await populateBryntumStore();
    selectRow();

}

async function onSaveForm() {
    const result: FormValidationResult<any> = await observer.value.validate();
    formHasValidated.value = true;
    if (result.valid) {
        if (!selectedAccountType.value?.id) {
            focusOnError('observer', '[name="accountType"]');
            showValidationModel(ValidationType.AccountType);
            return false;
        }
        if (!selectedDistributionMethod.value?.id) {
            showValidationModel(ValidationType.DistributionMethod);
            return false;
        }
        canSubmit.value = true;
        selectedRow.value.isActive = true;
        selectedRow.value.isDeleted = false;
        selectedRow.value.accountTypeId = selectedAccountType.value.id;
        selectedRow.value.accountTypeName = selectedAccountType.value.name;
        selectedRow.value.distributionMethodId = selectedDistributionMethod.value.id;
        selectedRow.value.distributionMethodName = selectedDistributionMethod.value.name;
        selectedRow.value.isActive = selectedStatus.value.id == 1;
        selectedRow.value.approvalStatusId = EssApprovalStatus.PendingHRM;
        if (selectedRow.value.distributionMethodId === DistributionMethod.Remaining) {
            selectedRow.value.ordinalPosition = -1;
        } else {
            selectedRow.value.ordinalPosition = selectedOrdinalPosition.value;
        }
        if (file.value) {
            const uploadFolderPath = await folderPath.value;
            selectedRow.value.file = new ExtendedUploadFileModel({ path: uploadFolderPath, file: file.value, fileName: file.value.name, uniqueFileName: uniqueFileName(file.value.name) })
        }
        selectedRow.value.isValid = true;
        selectedRow.value.employeeId = +employeeId.value;
        await pushDataToSubmitList(selectedRow.value, false);
        await refreshList();
        selectRow();
        notifySuccess(MESSAGE.DIRECT_DEPOSIT.SAVE_SUCCESS);
        isEditMode.value = false;
        originalSelectedAccount.value = null;
    } else {
        focusOnFirstError('observer');
    }
}
// #endregion Event

// #region Watcher
watch(
    () => selectedOrdinalPosition.value,
    async () => {
        await populateDataToViewDirectDeposit();
    },
);

watch(
    () => employeeAccountList.value,
    async (newValue, _oldValue) => {
        gridInstance.value.refreshRows();
    }, { deep: true }
);

// To track changes in multi select
watch(() => selectedAccountType.value, (newValue: any, _oldValue: any) => {
    if (originalSelectedAccount.value && newValue && newValue.id) {
        isSaveEnabled.value = originalSelectedAccount.value.accountTypeId !== newValue?.id;
    }
})

watch(() => selectedDistributionMethod.value, (newValue: any, _oldValue: any) => {
    if (originalSelectedAccount.value && newValue && newValue.id) {
        isSaveEnabled.value = originalSelectedAccount.value.distributionMethodId !== newValue?.id;
    }
    if(newValue && selectedRow.value && newValue.id === DistributionMethod.Remaining){
        selectedRow.value.distributionAmount = 0;
    }
})

watch(() => selectedStatus.value, (newValue: any, _oldValue: any) => {
    if (originalSelectedAccount.value && newValue) {
        isSaveEnabled.value = originalSelectedAccount.value.isActive !== (newValue?.id == 1 ? true : false);
    }
})
// #endregion Watcher

// #region LifeCycle
onMounted(async () => {
    if (!Number.isNaN(employeeId)) {
        await populateMasterData();
        await refreshList();
        await populateRightPanel();
    }
});
onBeforeUnmount(async () => {
    await employeeDirectDepositStore.clearUpsertEmployeeDirectDeposits();
});
onBeforeRouteLeave(async (to, from) => {
    await employeeDirectDepositStore.clearUpsertEmployeeDirectDeposits();
});
// #endregion LifeCycle
</script>

<style lang="scss">

</style>