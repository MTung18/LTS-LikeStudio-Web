<script lang="ts" setup>
import {
    IReportGet,
    IReportPost,
    IField
} from "@/models/report/Report";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTimes, faCheck } from "@fortawesome/pro-light-svg-icons";
import { faAsterisk } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
    defineProps,
    ref,
    reactive,
    defineEmits,
    Ref,
    watch,
    nextTick,
    computed
} from "vue";
import { useReportsStore } from "@/stores/reportsStore";
import { storeToRefs } from 'pinia';
import { ReportTypeGuid } from '@/enums/ReportType'
import { Form as VeeForm, Field as VeeField, FormValidationResult } from 'vee-validate';
import { useLocalStorage } from "@vueuse/core";

const reportStore = useReportsStore();
const { reportsCriteriaStore } = storeToRefs(reportStore);
library.add(faTimes, faAsterisk, faCheck);

const form: Ref<HTMLFormElement | null> = ref(null);

defineProps<{
    typeReport: ReportTypeGuid;
    isOpen: boolean;
}>();

const reportName = {
    [ReportTypeGuid.PendingAndApprovedTimeOff]: 'Pending and Approved Time Off Report',
    [ReportTypeGuid.TimeOffBalance]: 'Time Off Balance Report',
    [ReportTypeGuid.EmployeeContactInformation]: 'Employee Contact Information',
    [ReportTypeGuid.W2ElectronicConsent]: 'W-2 Electronic Consent Report'
}

const emit = defineEmits<{
    (e: "save", body: Partial<IReportPost[]>): void;
    (e: "close"): void;
}>();


const mapObjectToArr = (pData: IReportGet) => {
    const arr = []
    for (const [key] of Object.entries(reportsCriteriaStore.value)) {
        arr.push({
            name: key,
            value: []
        })
    }
    for (const [key, item] of Object.entries(pData)) {
        if (key === 'dateRange') {
            arr.push({
                name: key,
                value: item
            })
        } else {
            const itemFound = arr.find(item => item.name === key);
            if (itemFound) {
                itemFound.value = item
            }
        }
    }
    return arr
}

const employees = useLocalStorage<IField[]>('employees', [])

//-- Reset data and invalid error
function close(): void {
    nextTick(() => {
        for (const [key] of Object.entries(dataObj)) {
            dataObj[key] = []
        }
        dateRange.fromTime = null;
        dateRange.toTime = null;
        setTimeout(() => {
            form.value.resetForm()
        })
        emit("close");
    })
}

const dataObj = reactive<IReportGet>({
    dateRange: []
})

function onSubmit(): void {
    if ((!dataObj['employees'] && dataObj['reportingSupervisors'] && dataObj['reportingSupervisors'].length > 0) || (dataObj['employees'] && dataObj['employees'].length === 0 && dataObj['reportingSupervisors'] && dataObj['reportingSupervisors'].length > 0)) {
        const supervisorIds = dataObj['reportingSupervisors'].map(e => e.id);
        employees.value = reportsCriteriaStore.value.employees.filter(e => supervisorIds.includes(+e.referenceInformation))
    }
    if ((!dataObj['employees'] && !dataObj['reportingSupervisors']) || (dataObj['employees'] && dataObj['reportingSupervisors'] && dataObj['employees'].length === 0 && dataObj['reportingSupervisors'] && dataObj['reportingSupervisors'].length === 0) || (!dataObj['employees'] && dataObj['reportingSupervisors'] && dataObj['reportingSupervisors'].length === 0) || (dataObj['employees'] && dataObj['employees'].length === 0 && !dataObj['reportingSupervisors'])) {
        employees.value = reportsCriteriaStore.value.employees;
    }
    const arr = mapObjectToArr(dataObj)
    emit('save', arr)
}

const dateRange = reactive({
    fromTime: '',
    toTime: ''
})

watch(() => dateRange.fromTime, (newVal) => {
    dataObj.dateRange[0] = {
        "name": "fromTime",
        "id": 1,
        "guid": null,
        "default": false,
        "referenceInformation": newVal,
        "sortByField": null
    }
})

watch(() => dateRange.toTime, (newVal) => {
    dataObj.dateRange[1] = {
        "name": "toTime",
        "id": 1,
        "guid": null,
        "default": false,
        "referenceInformation": newVal,
        "sortByField": null
    }
})

const computedEmployee = computed(() => {
    if (dataObj['reportingSupervisors'] !== undefined && dataObj['reportingSupervisors'].length > 0) {
        const supervisorIds = dataObj['reportingSupervisors'].map(e => e.id);
        return reportsCriteriaStore.value.employees.filter(e => supervisorIds.includes(+e.referenceInformation));
    }
    return reportsCriteriaStore.value.employees
})

watch(() => dataObj['reportingSupervisors'], (newVal) => {
    if (newVal && newVal.length > 0) {
        const supervisorIds = newVal.map(e => e.id);

        if (dataObj.employees && dataObj['employees'].length > 0) {
            dataObj['employees'] = dataObj['employees'].filter(e => supervisorIds.includes(+e.referenceInformation))
        }
    }
})
</script>

<template>
    <fs-sidebar :visible="isOpen" sidebar id="report-sidebar" class="publishPostForm" right
        sidebar-class="fsi-sidebar help-center header-grey" body-class="help-center__body" no-close-on-esc
        no-close-on-backdrop bg-variant="white" width="392px" shadow header-class="border-bottom" footer-class="border-top"
        no-header-close>
        <template #title>
            <div class="d-flex justify-content-between py-2">
                <span>Generate Report </span>
                <fs-link class="text-secondary" role="button" @click="close">
                    <font-awesome-icon :icon="['fal', 'times']" size="sm"></font-awesome-icon>
                </fs-link>
            </div>
        </template>
        <fs-container fluid class="px-3 py-3">
            <VeeForm @submit="onSubmit" ref="form" class="form" id="form" v-slot="{ errors }">

                <fs-input label="Report Name" id="title" type="fsTextInput" v-model="reportName[typeReport]" name="title"
                    placeholder="Title here..." disabled />
                <fs-row
                    v-if="ReportTypeGuid.W2ElectronicConsent !== typeReport && ReportTypeGuid.EmployeeContactInformation !== typeReport">
                    <fs-col>
                        <fs-input type="fsDateInput" name="From Date" v-model="dateRange.fromTime" label="From Date"
                            :required="true" :rules="{
                                required: true,
                                dateBeforeOrEqualTarget: ['To Date', dateRange.toTime]
                            }" />
                    </fs-col>
                    <fs-col>
                        <fs-input type="fsDateInput" name="To Date" v-model="dateRange.toTime" label="To Date"
                            :required="true" :rules="{
                                required: true,
                                dateAfterOrEqualTarget: ['From Date', dateRange.fromTime]
                            }" />
                    </fs-col>
                </fs-row>

                <div v-if="reportsCriteriaStore.status && reportsCriteriaStore.status.length > 0">
                    <fs-input type="fsMultiselectList" :multiple="true" :closeOnSelect="false" :showClear="true"
                        label="Status" :typeaheaddata="reportsCriteriaStore?.status" typeaheadkey="name"
                        typeaheadvalueattribute="id" name="Status" autocomplete="donotfill" v-model="dataObj['status']"
                        :defaultEmptyValue="null">
                    </fs-input>
                </div>

                <div
                    v-if="reportsCriteriaStore.reportingSupervisors && reportsCriteriaStore.reportingSupervisors.length > 0">
                    <fs-input type="fsMultiselectList" label="Reporting Supervisor(s)" :multiple="true"
                        :closeOnSelect="false" :showClear="true" :typeaheaddata="reportsCriteriaStore.reportingSupervisors"
                        typeaheadkey="name" typeaheadvalueattribute="id" name="supervisors"
                        v-model="dataObj['reportingSupervisors']">
                    </fs-input>
                </div>
                <div v-if="reportsCriteriaStore?.employees && reportsCriteriaStore?.employees.length > 0">
                    <fs-input type="fsMultiselectList" label="Employee(s)" :multiple="true" :closeOnSelect="false"
                        :showClear="true" :typeaheaddata="computedEmployee" :defaultEmptyValue="null" typeaheadkey="name"
                        v-model="dataObj['employees']" typeaheadvalueattribute="id" name="employees">
                    </fs-input>
                </div>

                <div v-if="reportsCriteriaStore?.consentStatus && reportsCriteriaStore?.consentStatus.length > 0">
                    <fs-input type="fsMultiselectList" :multiple="true" :closeOnSelect="false" :showClear="true"
                        label="Consent Status" :typeaheaddata="reportsCriteriaStore?.consentStatus" typeaheadkey="name"
                        typeaheadvalueattribute="default" name="Consent Status" autocomplete="donotfill"
                        :defaultEmptyValue="null" v-model="dataObj['consentStatus']">
                    </fs-input>
                </div>

                <div v-if="reportsCriteriaStore?.unions && reportsCriteriaStore?.unions.length > 0">
                    <fs-input type="fsMultiselectList" :multiple="true" :closeOnSelect="false" :showClear="true"
                        label="Union(s)" :typeaheaddata="reportsCriteriaStore?.unions" typeaheadkey="name"
                        typeaheadvalueattribute="id" name="Union(s)" autocomplete="donotfill" :defaultEmptyValue="null"
                        v-model="dataObj['unions']">
                    </fs-input>
                </div>

                <div v-if="reportsCriteriaStore?.trades && reportsCriteriaStore?.trades.length > 0">
                    <fs-input type="fsMultiselectList" :multiple="true" :closeOnSelect="false" :showClear="true"
                        label="Trade(s)" :typeaheaddata="reportsCriteriaStore?.trades" typeaheadkey="name"
                        typeaheadvalueattribute="id" name="Trade(s)" autocomplete="donotfill" :defaultEmptyValue="null"
                        v-model="dataObj['trades']">
                    </fs-input>
                </div>

                <div v-if="reportsCriteriaStore?.departments && reportsCriteriaStore?.departments.length > 0">
                    <fs-input type="fsMultiselectList" :multiple="true" :closeOnSelect="false" :showClear="true"
                        label="Department(s)" :typeaheaddata="reportsCriteriaStore?.departments" typeaheadkey="name"
                        typeaheadvalueattribute="id" name="Department(s)" autocomplete="donotfill" :defaultEmptyValue="null"
                        v-model="dataObj['departments']">
                    </fs-input>
                </div>
            </VeeForm>
        </fs-container>
        <template #footer>
            <div class="p-3 d-flex justify-content-between">
                <fs-button type="button" variant="outline-secondary" @click="close">
                    CANCEL
                </fs-button>
                <fs-button variant="primary" type="submit" form="form">
                    RUN REPORT
                </fs-button>
            </div>
        </template>
    </fs-sidebar>
</template>

<style lang="scss" scoped>
:deep(label) {
    font-size: 0.75rem;
    font-weight: bold;
}

:deep(.date-width) {
    width: 48%;
}
</style>
