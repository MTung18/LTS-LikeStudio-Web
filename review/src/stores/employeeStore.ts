import Employee from "@/models/employees/Employee";
import EmployeeDetails from "@/models/employees/EmployeeDetails";
import { acceptHMRUpdate, defineStore } from "pinia";
import { computed, ref } from "vue";
import type { Ref } from "vue";
import { whqEmployeesApi } from "@/axios/instances/whqEmployeesApi";
import { employeeStatusApi } from "@/axios/instances/employeeStatusApi";
import Contact from "@/models/employees/Contact";
import ContactMasterData from "@/models/employees/ContactMasterData";
import ContactInput from "@/models/employees/ContactInput";
import EmployeeCurrentLogin from "@/models/employees/EmployeeCurrentLogin";
import CreateEmployeeInput from "@/models/employees/CreateEmployeeInput";
import CreateEmployeeResult from "@/models/employees/CreateEmployeeResult";
import { Employment } from "@/models/employees/Employment";
import EmployeePersonalInfoInput from "@/models/employees/EmployeePersonalInfoInput";
import EmployeeStatus, { EmployeeStatusReason } from '@/models/employees/EmployeeStatus';
import { getCurrentTimezoneDate } from '@/helper/hqSuite/formatHelper';
import EmployeeDeduction from "@/models/employees/EmployeeDeduction";
import { MinorityCode } from "@/models/foundationIntegration/MinorityCode";
import EmployeeRenderedDocumentInformation from "@/models/employees/EmployeeRenderedDocumentInformation";
import moment from 'moment';

export const useEmployeeStore = defineStore("employee", () => {
  const employeeList: Ref<Employee[]> = ref(new Array<Employee>());
  const employeeCurrentLogin: Ref<EmployeeCurrentLogin> = ref(new EmployeeCurrentLogin());
  const contactList: Ref<Contact[]> = ref(new Array<Contact>);
  const employeeDetails: Ref<EmployeeDetails> = ref(new EmployeeDetails());
  const employeeDetailsUpdated: Ref<EmployeeDetails> = ref(new EmployeeDetails());
  const employeeContactUpdated: Ref<boolean> = ref(false);
  const employeeContactCanBeDeleted: Ref<boolean> = ref(false);
  const employeeContactDeleted: Ref<boolean> = ref(false);
  const contactMasterData: Ref<ContactMasterData> = ref(new ContactMasterData());
  const employeeContactCreated: Ref<boolean> = ref(false);
  const employeeCreated: Ref<CreateEmployeeResult> = ref(new CreateEmployeeResult());
  const primaryContactedUpdated: Ref<boolean> = ref(false);
  const employeeSsn: Ref<string> = ref(null);
  const employeeContactSSN: Ref<number> = ref(null as number);
  const employment: Ref<Employment> = ref();
  const employmentUpdate: Ref<boolean> = ref();
  const employeeStatusList: Ref<Object> = ref(Object);
  const employeeStatusId: Ref<number> = ref(null);
  const employeeDeductions: Ref<EmployeeDeduction[]> = ref(new Array<EmployeeDeduction>());
  const employeeHasExistingPendingFoundationApprovals: Ref<boolean> = ref(false);
  const getEmployeeDetails = computed(() => {
    return employeeDetails.value;
  });
  const employeeStatus: Ref<EmployeeStatus> = ref(new EmployeeStatus());
  const employeeStatusReasons: Ref<EmployeeStatusReason[]> = ref([]);
  const minorityCodeList: Ref<MinorityCode[]> = ref([]);
  const employeeW4RenderedDocumentInformation: Ref<EmployeeRenderedDocumentInformation[]> = ref([]);
  const employeeFederalRenderedDocumentInformation: Ref<EmployeeRenderedDocumentInformation[]> = ref([]);

  async function fetchEmployeeList(): Promise<void> {
    employeeList.value = await whqEmployeesApi.getEmployees();
  }

  async function fetchEmployeeContactList(employeeId: number): Promise<void> {
    contactList.value = await whqEmployeesApi.getEmployeeContacts(employeeId);
  }

  async function fetchEmployeeDetails(id: string | number): Promise<void> {
    employeeDetails.value = await whqEmployeesApi.getEmployeeDetails(id);
  }

  async function fetchEmployeeContactSsn(employeeContactId: string | number): Promise<number> {
    employeeContactSSN.value = await whqEmployeesApi.getEmployeeContactSsn(employeeContactId);

    return employeeContactSSN.value;
  }

  async function fetchEmployeeSsn(employeeId: number | string): Promise<void> {
    try {
      employeeSsn.value = await whqEmployeesApi.getEmployeeSsn(employeeId);
    } catch (error) {
      console.error(error);
      employeeSsn.value = null;
    }
  }

  async function fetchContactMasterData(): Promise<void> {
    contactMasterData.value = await whqEmployeesApi.getContactsMasterData();
  }

  async function updateEmployeeContactAsync(contact: ContactInput): Promise<boolean> {
    employeeContactUpdated.value = await whqEmployeesApi.updateEmployeeContactAsync(contact);

    return employeeContactUpdated.value;
  }

  async function checkEmployeeContactCanBeDeletedAsync(employeeContactId: number): Promise<boolean> {
    employeeContactCanBeDeleted.value = await whqEmployeesApi.checkEmployeeContactCanBeDeletedAsync(employeeContactId);

    return employeeContactCanBeDeleted.value;
  }

  async function deleteEmployeeContactAsync(employeeContactId: number): Promise<boolean> {
    employeeContactDeleted.value = await whqEmployeesApi.deleteEmployeeContactAsync(employeeContactId);

    return employeeContactDeleted.value;
  }


  async function createEmployeeAsync(newEmployee: CreateEmployeeInput): Promise<CreateEmployeeResult> {

    employeeCreated.value = await whqEmployeesApi.createEmployeeAsync(newEmployee);

    return employeeCreated.value;
  }

  async function createEmployeeContactAsync(contact: ContactInput): Promise<boolean> {
    employeeContactCreated.value = await whqEmployeesApi.addNewContact(contact);

    return employeeContactCreated.value;
  }

  async function updatePrimaryContactAsync(employeeContactId: number): Promise<boolean> {
    primaryContactedUpdated.value = await whqEmployeesApi.updatePrimaryContactAsync(employeeContactId);

    return primaryContactedUpdated.value;
  }

  async function fetchEmployment(employeeId: string | number): Promise<void> {
    employment.value = await whqEmployeesApi.getEmployment(employeeId);
  }

  async function fetchEmployeeCurrentLogin(): Promise<void> {
    employeeCurrentLogin.value = await whqEmployeesApi.getEmployeeCurrentLogin();
  }

  async function editEmployment(employment: Partial<Employment>): Promise<boolean> {
    employmentUpdate.value = await whqEmployeesApi.updateEmployment(employment);
    return employmentUpdate.value;
  }

  async function fetchEmployeeStatusList(): Promise<void> {
    employeeStatusList.value = await whqEmployeesApi.getEmployeeStatusListAsync();
  }

  async function fetchEmployeeDeductionsList(employeeId: number): Promise<void> {
    employeeDeductions.value = await whqEmployeesApi.getEmployeeDeductionsListAsync(employeeId);
  }

  async function updateEmployeeDetails(employeePersonalInfoInput: EmployeePersonalInfoInput): Promise<EmployeeDetails> {
    employeeDetailsUpdated.value = await whqEmployeesApi.updateEmployeePersonalInformationAsync(employeePersonalInfoInput);
    return employeeDetailsUpdated.value;
  }

  function formatEmployeeStatusDates(data: EmployeeStatus): void {
    data.terminationDate = data.terminationDate ? moment(data.terminationDate).format('MM/DD/YYYY') : null;
    data.dateRehired = data.dateRehired ? moment(data.dateRehired).format('MM/DD/YYYY') : null;
    data.dateHired = data.dateHired ? moment(data.dateHired).format('MM/DD/YYYY') : null;
    data.startDate = data.startDate ? moment(data.startDate).format('MM/DD/YYYY') : null;
    data.dateLastWorked = data.dateLastWorked ? moment(data.dateLastWorked).format('MM/DD/YYYY') : null;
  }

  async function fetchEmployeeStatus(employeeId: number): Promise<void> {
    const result = await employeeStatusApi.getEmployeeStatus(employeeId);
    formatEmployeeStatusDates(result);
    employeeStatus.value = result;
  }

  async function fetchEmployeeStatusId(employeeId: number | string) {
    employeeStatusId.value = await whqEmployeesApi.getEmployeeStatus(employeeId);
  }

  async function fetchEmployeeStatusReasons(): Promise<void> {
    employeeStatusReasons.value = await employeeStatusApi.getEmployeeStatusReasons();
  }

  async function fetchEmployeeMinorityCodelist() {
    minorityCodeList.value = await whqEmployeesApi.getEmployeeMinorityCodeList();
  }

  async function updateEmployeeStatus(data: EmployeeStatus): Promise<boolean> {
    const result = await employeeStatusApi.updateEmployeeStatus(data);

    if (result) {
      const updatedData = { ...employeeStatus.value, ...data };
      formatEmployeeStatusDates(updatedData);
      employeeStatus.value = updatedData;
    }

    return result;
  }

  async function updateEmployeeStatusId(employeeId: number | string, statusId: number | string): Promise<void> {
    await whqEmployeesApi.updateEmployeeStatus(employeeId, statusId);
  }

  async function checkHRApprovalCategoryEmployeePendingFoundationStatusExistsAsync(employeeId: number): Promise<boolean> {
    employeeHasExistingPendingFoundationApprovals.value = await whqEmployeesApi.checkHRApprovalCategoryEmployeePendingFoundationStatusExistsAsync(employeeId);
    return employeeHasExistingPendingFoundationApprovals.value;
  }

  async function fetchEmployeeW4RenderedDocumentInformation(employeeId: number | string) {
    employeeW4RenderedDocumentInformation.value = await whqEmployeesApi.getEmployeeW4RenderedDocumentInformation(employeeId);
  }

  async function fetchEmployeeFederalRenderedDocumentInformation(employeeId: number | string) {
    employeeFederalRenderedDocumentInformation.value = await whqEmployeesApi.getEmployeeFederalRenderedDocumentInformation(employeeId);
  }

  return {
    employeeList,
    employeeDetails,
    contactList,
    employeeContactUpdated,
    getEmployeeDetails,
    employeeContactCanBeDeleted,
    employeeContactDeleted,
    contactMasterData,
    employeeContactCreated,
    primaryContactedUpdated,
    employeeSsn,
    employeeContactSSN,
    employeeCurrentLogin,
    employeeCreated,
    employment,
    employmentUpdate,
    employeeStatusList,
    employeeStatusId,
    employeeDeductions,
    employeeDetailsUpdated,
    employeeStatus,
    employeeStatusReasons,
    minorityCodeList,
    employeeHasExistingPendingFoundationApprovals,
    employeeW4RenderedDocumentInformation,
    employeeFederalRenderedDocumentInformation,
    fetchEmployeeContactList,
    fetchEmployeeContactSsn,
    fetchEmployeeList,
    fetchEmployeeDetails,
    updateEmployeeContactAsync,
    checkEmployeeContactCanBeDeletedAsync,
    deleteEmployeeContactAsync,
    createEmployeeAsync,
    fetchContactMasterData,
    createEmployeeContactAsync,
    updatePrimaryContactAsync,
    fetchEmployment,
    fetchEmployeeSsn,
    fetchEmployeeCurrentLogin,
    editEmployment,
    fetchEmployeeStatusList,
    fetchEmployeeStatusId,
    fetchEmployeeDeductionsList,
    updateEmployeeDetails,
    fetchEmployeeStatus,
    fetchEmployeeStatusReasons,
    updateEmployeeStatus,
    updateEmployeeStatusId,
    fetchEmployeeMinorityCodelist,
    checkHRApprovalCategoryEmployeePendingFoundationStatusExistsAsync,
    fetchEmployeeW4RenderedDocumentInformation,
    fetchEmployeeFederalRenderedDocumentInformation,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useEmployeeStore, import.meta.hot));
}
