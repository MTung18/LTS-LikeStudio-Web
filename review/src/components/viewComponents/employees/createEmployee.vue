<script setup lang="ts">

import { ref, Ref, onBeforeMount, inject} from 'vue';
import { useRouter } from 'vue-router';
import { Form as VeeForm, Field as VeeField, FormValidationResult } from 'vee-validate';
import { storeToRefs } from "pinia";
import { focusOnFirstError } from '@/functions/ValidationUtilityFunctions';
import { InitialEmployeeStatus } from "@/enums/InitialEmployeeStatus";
import { EmploymentStatus } from "@/enums/EmploymentStatus";
import { useAlerts } from '@/composables/useAlerts';
import { usePermissionGroupStore } from '@/stores/settings/permissionGroupStore';
import { useHonorificStore } from '@/stores/honorificStore';
import { useEmployeeStore } from '@/stores/employeeStore';
import { usePayrollStateTaxCodesStore } from '@/stores/payrollStateTaxCodesStore';
import RadioButton from '@/models/RadioButton';
import CreateEmployeeFormData from "@/models/employees/CreateEmployeeFormData";
import loadingWave from '@/assets/images/Loading_Wave.svg';
import Sent from '@/assets/lottieFiles/Sent.json';
import { useOnboardingTasksStore } from '@/stores/onboardingTasksStore';
import { useOnboardingEmployeeInformationStore } from '@/stores/onboardingEmployeeInformationStore';

const router = useRouter();
const permissions: Ref<Record<string,boolean>> = inject('$providePermissions');

const { createEmployeeAsync, fetchEmployeeList } = useEmployeeStore();
const { employeeCreated, employeeList, } = storeToRefs(useEmployeeStore());

const { seedTasks } = useOnboardingTasksStore();
const { seedProgressData, updateOnboardingInformations } = useOnboardingEmployeeInformationStore();

const { fetchPermissionGroupLookup } = usePermissionGroupStore();
const { permissionGroupLookup} = storeToRefs(usePermissionGroupStore())

const { fetchHonorificDropdownData } = useHonorificStore();
const { honorificDropdownData } = storeToRefs(useHonorificStore())

const { fetchPayrollStateTaxCodes } = usePayrollStateTaxCodesStore();
const { payrollStateTaxCode } = storeToRefs(usePayrollStateTaxCodesStore())

const newHireOptions: RadioButton[] = [
    {text: 'Onboard', value: InitialEmployeeStatus.Onboard},
    {text: 'Quick Hire', value: InitialEmployeeStatus.QuickHire}
]
const employmentStatusOptions: RadioButton[] = [
    { text: 'Full Time', value: EmploymentStatus.FullTime },
    { text: 'Part Time', value: EmploymentStatus.PartTime }
];

const createEmployeeFormData = ref(new CreateEmployeeFormData()); 

const isLoading = ref(false);
const { notifySuccess, notifyError } = useAlerts();
const observer = ref();
const formHasValidated = ref(false);
const showSent = ref(false);
const newEmployee = ref(new CreateEmployeeFormData({
    initialEmployeeStatusId: 2,
    employmentStatusId: 1
}));

const createNewButtonClick = () => {
    window.location.reload();
}

const save = async () => {
    try 
    {
        const validationResult: FormValidationResult<any> = await observer.value.validate();
        
        //isLoading = true will remove all the fields from the dom and the validation result will always be true regardless of the field values
        //in case the validation is done after isLoading = true
        isLoading.value = true;

        if(validationResult.valid)
        {
            await createEmployeeAsync(newEmployee.value.toCreateEmployeeInput());
            
            if(employeeCreated.value) {
                notifySuccess('Employee saved.');
                try {
                    await initializeOnboarding();
                    showSent.value = true;
                } catch {
                    notifyError('Onboarding initialization failed');
                }
            } 
            else
            {
                notifyError('Employee not saved.')
            }
        }    
        else
        {
            focusOnFirstError('observer');

            let error = Object.values(validationResult.errors)[0];
            let errorMessage = error.includes("Field is required") ? "Please fill the required fields" : error;

            notifyError(errorMessage);
        }         
    } 
    catch (error: any) 
    {
        console.log(error);
        notifyError('Employee not saved.')
    }

    isLoading.value = false;
}

const initializeOnboarding = async () => {
    const employeeId: number = employeeCreated?.value?.employeeId;
    if (!employeeId) {
        throw new Error('No employee id was retrieved from the create call');
    }

    await seedTasks(employeeId);
    await seedProgressData(employeeId);
    await updateOnboardingInformations(employeeId, {
        employeeStartDateUTC: new Date(newEmployee.value.startDate),
        onboardingAssignedUTC: new Date(),
    })
};

const cancelPage = () => {
    router.go(-1);
}

onBeforeMount(async () => {
    isLoading.value = true;

    try
    {
        await fetchHonorificDropdownData();
        createEmployeeFormData.value.honorificTypeAhead = honorificDropdownData.value;

        await fetchPermissionGroupLookup(!permissions.value["WHQ_247_3115"]);
        createEmployeeFormData.value.permissionGroupTypeahead = permissionGroupLookup.value;

        await fetchPayrollStateTaxCodes();
        createEmployeeFormData.value.workLocationsTypeahead = payrollStateTaxCode.value;
        
        await fetchEmployeeList();
        createEmployeeFormData.value.supervisorTypeahead = employeeList.value;
    }
    catch(error)
    {
        console.error(error);
    }

    isLoading.value = false;
});

</script>

<template>
    <fs-overlay :show="isLoading" class="fsi-pg__overlay" no-wrap>
      <template #overlay>
        <div class="text-center">
          <img :src="loadingWave" />
        </div>
      </template>
    </fs-overlay>
    <div class="hq-pg d-flex" v-if="showSent" >
        <div class="d-flex flex-fill flex-column justify-content-center">
            <div class="text-center fs-5 fw-bold">An invite link has been sent to {{ newEmployee.firstName }}!</div>
            <LottieAnimation
                :animationData="Sent"
                :height="200"
                :loop="false" />
                <div class="text-center">
                    <fs-button variant="outline-success" @click="createNewButtonClick">Create New Employee</fs-button>
                    <fs-button variant="success" :to="{name: 'employees'}">Go to Employees</fs-button>
                </div>
        </div>
    </div>
    <div v-else class="hq-pg">
        <fs-container fluid class="hq-pg__header hq-pg__header--sticky contain">
            <fs-row align-v="center">
                <fs-col>
                    <h2 class="hq-pg__title">Create Employee</h2>
                </fs-col>
                <fs-col cols="auto">
                    <fs-button variant="outline-secondary"  @click="cancelPage()">Cancel</fs-button>
                    <fs-button variant="primary" @click="save()">Save & Send Invite</fs-button>
                </fs-col>
            </fs-row>
        </fs-container>
        <fs-container fluid class="contain hq-pg__container" v-if="!isLoading">
            <VeeForm ref="observer" id="observer" v-slot="{ meta }">
                <fs-row>
                    <fs-col lg="8">
                        <section class="mb-3">
                            <h3 class="hq-pg__section-head">General</h3>
                            <div class="d-flex">
                            <VeeField
                            v-slot="{ errors, field }"
                            :rules="{ required: true }"
                            :formMeta="{ ...meta, validated: formHasValidated }"
                            v-model="newEmployee.initialEmployeeStatusId"
                            name="newHireType">
                                <fs-form-group 
                                    class="d-flex align-items-center mb-4" 
                                    label-class="fs-input__label position-relative me-2 w-auto"
                                    :invalid-feedback="errors[0]">
                                    <template #label>New Hire Type:<font-awesome-icon  :icon="['fas', 'asterisk']" class="fs-input__indicator"/></template>
                                    <fs-form-radio-group 
                                        id="new_hire_type" 
                                        v-model="newEmployee.initialEmployeeStatusId" 
                                        :options="newHireOptions" 
                                        name="new-hire-options"
                                        :state="errors[0] ? false : undefined  "/>
                                        <template #invalid-feedback><ErrorMessage name="newHireType" class="fs-input__message fs-input__message--error mt-n1"/></template>

                                </fs-form-group>                                
                            </VeeField>
                            <info-sidebar title="New Hire Type" text-color="cyan" icon="info-circle" fa-version="fal">
                                <p><b>Onboard</b> will guide the employee to fill out all the required information that is needed to become an active employee.</p>
                                <p><b>Quick Hire</b> is available as an option to bypass employee onboarding so that HR can quickly fill out the required information in order to turn an employee to active status.</p>
                                <p><span class="text-cyan fw-bold">Note:</span> The employee will receive an invite to activate their WorkforceHQ account regardless of the New Hire type that is selected.</p>
                            </info-sidebar>                               
                            </div>


                            <fs-row>
                                <fs-col md="3" lg="2">
                                    <fs-input 
                                        type="fsMultiselectList"
                                        label="Prefix"
                                        id="hrRepresentativeId"
                                        v-model="newEmployee.honorificSelected"
                                        :typeaheaddata="createEmployeeFormData.honorificTypeAhead"
s                                       typeaheadkey="honorificName"
                                        typeaheadvalueattribute="honorificId"
                                        :rules="{ required: false }"
                                        :formMeta="{ ...meta, validated: formHasValidated }"
                                        name="prefix">
                                    </fs-input>
                                </fs-col>

                                <fs-col lg="3" md="6">
                                    <fs-input 
                                        type="fsTextInput" 
                                        :required="true" 
                                        v-model="newEmployee.firstName" 
                                        label="First Name"
                                        :rules="{ required: true }"
                                        :maxlength="20"
                                        :formMeta="{ ...meta, validated: formHasValidated }"
                                        name="firstName">
                                    </fs-input>
                                </fs-col>
                                <fs-col md="3" lg="2">
                                    <fs-input 
                                        type="fsTextInput" 
                                        v-model="newEmployee.middleName" 
                                        label="Middle Name"
                                        :rules="{ required: false }"
                                        :maxlength="20"
                                        :formMeta="{ ...meta, validated: formHasValidated }"
                                        name="middleName"></fs-input>

                                </fs-col>
                                <fs-col md="9" lg="3">
                                    <fs-input 
                                        type="fsTextInput" 
                                        :required="true" 
                                        v-model="newEmployee.lastName" 
                                        label="Last Name"
                                        :rules="{ required: true }"
                                        :maxlength="20"
                                        :formMeta="{ ...meta, validated: formHasValidated }"
                                        name="lastName"></fs-input>

                                </fs-col>
                                 <fs-col md="3" lg="2">
                                    <fs-input 
                                        type="fsTextInput" 
                                        v-model="newEmployee.suffix" 
                                        label="Suffix"
                                        :rules="{ required: false }"
                                        :maxlength="4"
                                        :formMeta="{ ...meta, validated: formHasValidated }"
                                        name="suffix"></fs-input>

                                </fs-col>
                            </fs-row>
                            <fs-row>
                                <fs-col md="6">
                                    <fs-input 
                                        type="fsTextInput" 
                                        :required="true" 
                                        v-model="newEmployee.email" 
                                        label="Email"
                                        :rules="{ required: true, email: true }"
                                        :maxlength="100"
                                        :formMeta="{ ...meta, validated: formHasValidated }"
                                        :validate-on-input="false"
                                        :validate-on-change="true"
                                        name="email"></fs-input>
                                </fs-col>
                                <fs-col md="6">
                                    <fs-input 
                                        type="fsTextInput" 
                                        :required="true" 
                                        v-model="newEmployee.phone.phoneNumber" 
                                        label="Phone Number"
                                        :rules="{ required: true, phoneNumber: true  }"
                                        :formMeta="{ ...meta, validated: formHasValidated }"
                                        :validate-on-input="false"
                                        :validate-on-change="true"
                                        name="phoneNumber"
                                        mask-format="(###) ###-####"
                                        ></fs-input>
                                </fs-col>
                            </fs-row>
                        </section>
                        <section class="mb-3">
                            <h3 class="hq-pg__section-head">Work</h3>
                            <VeeField
                            v-model="newEmployee.employmentStatusId"
                            v-slot="{ errors, field }"
                            :rules="{ required: true }"
                            :formMeta="{ ...meta, validated: formHasValidated }"
                            name="employmentStatus">
                                <fs-form-group 
                                    class="d-flex align-items-center mb-4" 
                                    label="Employment Status:" 
                                    label-class="fs-input__label position-relative me-2 w-auto"
                                    :invalid-feedback="errors[0]"
                                    >
                                    <template #label>
                                        Employment Status:<font-awesome-icon  :icon="['fas', 'asterisk']" class="fs-input__indicator"/>
                                    </template>
                                    <fs-form-radio-group 
                                        id="employement-status" 
                                        v-model="newEmployee.employmentStatusId" 
                                        :options="employmentStatusOptions" 
                                        name="employment-status"
                                        :state="errors[0] ? false : undefined  "/>
                                        <template #invalid-feedback><ErrorMessage name="employmentStatus" class="fs-input__message fs-input__message--error mt-n1"/></template>

                                </fs-form-group>
                                
                            </VeeField>
                            <fs-row>
                                <fs-col md="4">
                                    <fs-input 
                                        type="fsDateInput"
                                        label="Start Date"
                                        id="startDate"
                                        :required="true"
                                        :rules="{ required: true }" 
                                        v-model="newEmployee.startDate"
                                        :formMeta="{ ...meta, validated: formHasValidated }"
                                        name="startDate" >
                                    </fs-input>
                                </fs-col>
                                <fs-col md="4">
                                    <fs-input 
                                        type="fsMultiselectList"
                                        label="Work Location"
                                        id="workLocation"
                                        v-model="newEmployee.workLocationsSelected"
                                        :typeaheaddata="createEmployeeFormData.workLocationsTypeahead"
                                        typeaheadkey="payrollStateTaxCodeName"
                                        typeaheadvalueattribute="id" 
                                        :multiple="true"
                                        :closeOnSelect="false"
                                        :showClear="true"
                                        :required="true"
                                        :rules="{ required: true }"
                                        :formMeta="{ ...meta, validated: formHasValidated }"
                                        name="workLocation">
                                    </fs-input>
                                </fs-col>
                                <fs-col md="4">
                                    <fs-input 
                                        type="fsMultiselectList"
                                        label="Reporting Supervisor"
                                        id="reportingSupervisor"
                                        v-model="newEmployee.supervisorSelected"
                                        :typeaheaddata="createEmployeeFormData.supervisorTypeahead"
                                        typeaheadkey="fullName"
                                        typeaheadvalueattribute="id"
                                        :rules="{ required: false }"
                                        :formMeta="{ ...meta, validated: formHasValidated }"
                                        name="reportingSupervisor">
                                    </fs-input>

                                </fs-col>
                            </fs-row>
                            <fs-row>
                                <fs-col>
                                    <fs-input 
                                        type="fsMultiselectList"
                                        label="Additional Supervisors"
                                        id="additionalSupervisors"
                                        v-model="newEmployee.additionalSupervisorsSelected"
                                        :typeaheaddata="createEmployeeFormData.supervisorTypeahead"
                                        typeaheadkey="fullName"
                                        typeaheadvalueattribute="id"
                                        :multiple="true"
                                        :closeOnSelect="false"
                                        :showClear="true"
                                        :rules="{ required: false }"
                                        :formMeta="{ ...meta, validated: formHasValidated }"
                                        name="additionalSupervisors">
                                    </fs-input>
                                </fs-col>
                            </fs-row>
                        </section>
                        
                        <section class="mb-3">
                            <h3 class="hq-pg__section-head">Permissions</h3>
                            <fs-row>
                                <fs-col md="6">
                                    <fs-input 
                                        type="fsMultiselectList"
                                        label="Permission Group"
                                        id="permissionGroup"
                                        v-model="newEmployee.permissionGroupSelected"
                                        :typeaheaddata="createEmployeeFormData.permissionGroupTypeahead"
                                        typeaheadkey="name"
                                        typeaheadvalueattribute="id"
                                        :required="true"
                                        :rules="{ required: true }"
                                        :formMeta="{ ...meta, validated: formHasValidated }"
                                        name="permissionGroup">
                                    </fs-input>
                                </fs-col>

                            </fs-row>
                            <fs-form-checkbox v-if="permissions['WHQ_247_3116']"
                                v-model="newEmployee.securedAccess">
                                Secured Access
                            </fs-form-checkbox>
                        </section>
                    </fs-col>
                </fs-row>
            </VeeForm>
        </fs-container>
    </div>
</template>
