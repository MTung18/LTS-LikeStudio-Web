import { acceptHMRUpdate, defineStore, storeToRefs } from "pinia";
import OnboardingEmployeeInformation from "@/models/onboarding/OnboardingEmployeeInformation";
import OnboardingProgressOverview from "@/models/onboarding/OnboardingProgressOverview";
import { Ref, ref } from "vue";
import { onboardingEmployeeInformationApi } from "@/axios/instances/onboardingEmployeeInformationApi";
import { onboardingInformationApi } from "@/axios/instances/onboardingInformationApi";
import { AddressObject, MaritalObject, PersonalInformation, PhoneObject, StateObject, UpdatePersonalInfoRequestModel } from "@/models/onboarding/PersonalInformation";
import { OnboardingEmployeeMaritalStatus } from "@/models/onboarding/OnboardingEmployeeMaritalStatus";
import { ApiResponse } from "@/models/ApiResponse";

import { onboardingTaxWithHoldingInfoHRApi } from "../axios/instances/onboardingTaxWithholdingInfoHRApi";
import { FormField as FormFieldEnum } from '@/enums/FormField';
import {
  EmployeePayrollFederalTaxDetail,
  EmployeePayrollLocalTaxCodeDetails,
  EmployeePayrollStateTaxCodeDetails,
  EmployeeTaxInformation,
  PayrollTaxAddOn,
  PayrollTaxOverride
} from '@/models/employees/EmployeeTaxInformation';
import PayrollStateTaxCode from '@/models/foundationIntegration/PayrollStateTaxCode';
import DropdownOption from '@/models/DropdownOptions';
import { employeeTaxInformationApi } from "../axios/instances/employeeTaxInformationApi";
import { LocalTaxCode } from "@/models/foundationIntegration/LocalTaxCode";
import { whqEmployeesApi } from "@/axios/instances/whqEmployeesApi";
import { timeOffPlanApi } from "@/axios/instances/timeOffPlanApi";
import { useOnboardingEmploymentInformationStore } from "./employmentInformationStore";
import { EmploymentStatus } from "@/enums/EmploymentStatus";
import { whqEmployeePayrollInformationApi } from "@/axios/instances/EmployeePayrollInformationApi";
import { PayrollInformation } from "@/models/employees/PayrollInformation";
import { TaxGroup } from "@/models/foundationIntegration/TaxGroup";
import { useOnboardingEmployerPayrollInformationStore } from '@/stores/onboardingEmployerPayrollInformationStore';
import moment from "moment";

const { fetchFormEmploymentInformationData } = useOnboardingEmploymentInformationStore();
const { formEmploymentInformation } = storeToRefs(useOnboardingEmploymentInformationStore());

const onboardingEmployerPayrollInformationStore = useOnboardingEmployerPayrollInformationStore();
const { dataOnboardingEmployerPayrollInformation } = storeToRefs(useOnboardingEmployerPayrollInformationStore());


export const useOnboardingEmployeeInformationStore = defineStore(
  "onboardingEmployeeInformation",
  () => {
    const listOfEmployeeInformation: Ref<OnboardingEmployeeInformation[]> = ref(
      new Array<OnboardingEmployeeInformation>()
    );
    const progressOverview: Ref<OnboardingProgressOverview> = ref(
      new OnboardingProgressOverview()
    );
    const maritalStatusListOfEmployeeInformation: Ref<OnboardingEmployeeMaritalStatus[]> = ref(
      new Array<OnboardingEmployeeMaritalStatus>
    );

    const personalInformation: Ref<PersonalInformation> = ref({} as PersonalInformation);
    const isSubmittedOnboardFormStatus: Ref<boolean> = ref(false);
    const personalSSN: Ref<string> = ref(null);

    async function seedProgressData(employeeId: number) {
      await onboardingEmployeeInformationApi.seedProgressData(employeeId);
    }

    async function getEmployeeInformation(employeeId: number) {
      let response =
        await onboardingEmployeeInformationApi.getListOnboardingEmployeeInformation(employeeId);
      if (response.list?.length == 0 || response.list == undefined) {
        response =
          await onboardingEmployeeInformationApi.getListOnboardingEmployeeInformation(employeeId);
      }
      listOfEmployeeInformation.value = response.list;
    }

    async function fetchProgressOverview(employeeId: number) {
      progressOverview.value = await onboardingInformationApi.fetchOnboardingEmployeeInformation(employeeId);
    }

    async function fetchEmployeeInformationById(id: number): Promise<void> {
      personalInformation.value = await onboardingEmployeeInformationApi.getEmployeeInformationDetail(id);
      if (personalInformation.value.mainPhone == null) {
        personalInformation.value.mainPhone = {} as PhoneObject;
        personalInformation.value.mainPhone.id = null;
        personalInformation.value.mainPhone.phoneId = null;
        personalInformation.value.mainPhone.personId = null;
        personalInformation.value.mainPhone.phoneNumber = null;
        personalInformation.value.mainPhone.phoneExtension = null;
        personalInformation.value.mainPhone.isMain = null;
        personalInformation.value.mainPhone.allowText = null;
        personalInformation.value.mainPhone.phoneNumberType = null;
        personalInformation.value.mainPhone.changeTrackingDate = null;
      }
      if (personalInformation.value.address == null) {
        personalInformation.value.address = {} as AddressObject;
        personalInformation.value.address.id = personalInformation.value.address.id == null ? 0 : personalInformation.value.address.id;
        personalInformation.value.address.addressId = null;
        personalInformation.value.address.address1 = null;
        personalInformation.value.address.address2 = null;
        personalInformation.value.address.city = null;
        personalInformation.value.address.state = null;
        personalInformation.value.stateSelectState = {} as StateObject;
        personalInformation.value.address.country = null;
        personalInformation.value.address.personAddressType = null;
        personalInformation.value.address.changeTrackingDate = null;
      }
      if (personalInformation.value.maritalStatus == null) {
        personalInformation.value.maritalStatus = {} as MaritalObject;
      }
      if (personalInformation.value.driversLicenseState == '' || personalInformation.value.driversLicenseState == null) personalInformation.value.driversLicenseSelectState = {} as StateObject;
    }

    async function updateEmployeeInformationById(data: UpdatePersonalInfoRequestModel): Promise<ApiResponse> {
      return await onboardingEmployeeInformationApi.putEmployeeInformationDetail(data);
    }

    async function fetchPersonalInfoFormStatus(id: number): Promise<void> {
      isSubmittedOnboardFormStatus.value = await onboardingEmployeeInformationApi.getPersonalInfoFormStatus(id);
    }

    async function fetchPersonalInfoSsn(id: number): Promise<void> {
      const data = await onboardingEmployeeInformationApi.getPersonalInformationSsn(id);
      personalSSN.value = data ? data : '';
    }

    async function fetchMaritalStatusList(): Promise<void> {
      maritalStatusListOfEmployeeInformation.value = await onboardingEmployeeInformationApi.fetchMaritalStatusList();
    }

    async function updateOnboardingInformations(employeeId: number, payload: Partial<OnboardingProgressOverview>): Promise<boolean> {
      return await onboardingInformationApi.updateOnboardInformation(employeeId, payload);
    }

    async function completeOnboarding(employeeId: number): Promise<unknown> {
      await transferDataEmployeeEmployment(employeeId);
      await transferDataEmployeePayrollAndTax(employeeId);
      await transferDataTaxWithholdingInfo(employeeId);
      await transferDataVacationPlan(employeeId);
      return await onboardingInformationApi.completeOnboarding(employeeId);
    }

    async function transferDataVacationPlan(employeeId: number) {
      const assignedVacationPlans = await timeOffPlanApi.getAssignedVacationPlans(employeeId);

      if (!formEmploymentInformation) {
        await fetchFormEmploymentInformationData(employeeId, FormFieldEnum.EmploymentInformation)
      }

      const getValueEmploymentInformationByKey = (key: string): any => {
        return formEmploymentInformation.value.fieldModels.find(field => field.fieldKey === key)?.fieldValue
      }
      const vacationTypeDynamic = await timeOffPlanApi.getFormVacation(employeeId, FormFieldEnum.Vacation)
      const getValueByKey = (key: string): any => {
        return vacationTypeDynamic.fieldModels.find(field => field.fieldKey === key)?.fieldValue
      }

      let data: any = {
        vacationPlanId: getValueByKey('plan')?.id,
        employeeId: Number(employeeId),
        startDate: getValueEmploymentInformationByKey("startDate"),
        isActive: true,
      };

      const assignedVacationPlan = assignedVacationPlans && Array.isArray(assignedVacationPlans) && assignedVacationPlans.length > 0 ? assignedVacationPlans[assignedVacationPlans.length - 1] : assignedVacationPlans;
      if (assignedVacationPlan && assignedVacationPlan?.id) {
        data.id = assignedVacationPlan?.id;
        await timeOffPlanApi.upsertAssignedVacationPlans(data);
      } else {
        await timeOffPlanApi.upsertAssignedVacationPlans(data);
      }
    }

    async function transferDataTaxWithholdingInfo(employeeId: number,) {

      let employeeTaxInformation: EmployeeTaxInformation;
      try {
        employeeTaxInformation = await employeeTaxInformationApi.getEmployeeTaxInformation(employeeId);
      } catch (error) {
        if (error.response?.status !== 404) {
          throw error;
        }
      }

      // if (employeeTaxInformation
      //   && employeeTaxInformation.employeePayrollFederalTaxDetail != null
      //   && employeeTaxInformation.employeePayrollStateTaxCodeDetails && employeeTaxInformation.employeePayrollStateTaxCodeDetails.length > 0) {
      //   return;
      // }

      //Only update if the required table are missing data.
      let employeeTaxInformationUpsert = new EmployeeTaxInformation();
      const defaultEmployeePayrollFederalTaxDetail = {
        id: 0,
        employeeId: employeeId,
        useXxxxOrLaterW4Version: true,
        federalFilingStatus: null,
        hasCheckboxWithholding: false,
        claimDependents: 0,
        otherIncome: 0,
        deductions: 0,
        extraWithholding: 0,
        payrollTaxOverride: null,
        federalW4: '',
        exemptions: 0,
        amount: 0,
        percent: 0,
        isResident: false,
        resident: null,
        payrollTaxAddOn: null,
      } as EmployeePayrollFederalTaxDetail;

      if (employeeTaxInformation) {
        //binding data employeeTaxInformation
        Object.assign(employeeTaxInformationUpsert, employeeTaxInformation);
        //remove item by list
        employeeTaxInformationUpsert.employeePayrollLocalTaxCodeDetails = [];
        employeeTaxInformationUpsert.employeePayrollStateTaxCodeDetails = [];

        if (employeeTaxInformationUpsert.employeePayrollFederalTaxDetail == null) {
          employeeTaxInformationUpsert.employeePayrollFederalTaxDetail = defaultEmployeePayrollFederalTaxDetail;
        }
        employeeTaxInformationUpsert.employeePayrollFederalTaxDetail.useXxxxOrLaterW4Version = true;
      }
      else {
        employeeTaxInformationUpsert = {
          employeeId: employeeId,
          employeePayrollFederalTaxDetail: defaultEmployeePayrollFederalTaxDetail,
          employeePayrollStateTaxCodeDetails: [],
          employeePayrollLocalTaxCodeDetails: [],
          payrollLocalTaxGroup: null,
          isResidenceTax: false
        };
      }

      const payloadUploadForm = await onboardingTaxWithHoldingInfoHRApi.getOnboardingTaxWithHoldingInfoHR(employeeId, FormFieldEnum.TaxWithholdingInfoHR)
      const data = payloadUploadForm.fieldModels.reduce((acc, { fieldKey, fieldValue }) => {
        if (fieldValue !== undefined) {
          acc[fieldKey] = fieldValue;
        }
        if (fieldKey === 'states' && fieldValue === "") {
          acc[fieldKey] = []
        }
        if (fieldKey === 'locals' && fieldValue === "") {
          acc[fieldKey] = []
        }
        return acc as any;
      }, {});

      employeeTaxInformationUpsert.isResidenceTax = data.otherIsResidence;

      //add employeePayrollFederalTaxDetail required
      let employeePayrollFederalTaxDetail = employeeTaxInformationUpsert.employeePayrollFederalTaxDetail;

      employeePayrollFederalTaxDetail.employeeId = employeeId;
      employeePayrollFederalTaxDetail.claimDependents = data.federalClaimDependentAndOtherCredits;
      employeePayrollFederalTaxDetail.otherIncome = data.federalOtherIncome;
      employeePayrollFederalTaxDetail.deductions = data.federalDeductions;
      employeePayrollFederalTaxDetail.extraWithholding = data.federalExtraWithholding;
      employeePayrollFederalTaxDetail.isResident = data.otherIsResidence;

      if (data.federalFilingStatus) {
        employeePayrollFederalTaxDetail.federalFilingStatusId = data.federalFilingStatus.id;
        employeePayrollFederalTaxDetail.federalFilingStatus = {
          id: data.federalFilingStatus.id,
          federalFilingStatusName: '',
          federalFilingStatusDescription: data.federalFilingStatus.name,
        }
      }

      if (data.federalOverride) {
        employeePayrollFederalTaxDetail.payrollTaxOverrideId = data.federalOverride.id;
        employeePayrollFederalTaxDetail.payrollTaxOverride = new PayrollTaxOverride();
        employeePayrollFederalTaxDetail.payrollTaxOverride.id = data.federalOverride.id;
        employeePayrollFederalTaxDetail.payrollTaxOverride.payrollTaxOverrideDescription = data.federalOverride.name;
      }

      //add employeePayrollStateTaxCodeDetails required
      let employeePayrollStateTaxCodeDetails = employeeTaxInformationUpsert.employeePayrollStateTaxCodeDetails;
      data.states.forEach(c => {
        let employeePayrollStateTaxCodeDetailCreate = new EmployeePayrollStateTaxCodeDetails();
        employeePayrollStateTaxCodeDetailCreate.employeeId = employeeId;

        employeePayrollStateTaxCodeDetailCreate.exemptions = c.exemptions;
        employeePayrollStateTaxCodeDetailCreate.percent = c.extraStateWithholdingPercent;
        employeePayrollStateTaxCodeDetailCreate.amount = c.extraStateWithholdingAmount;

        if (c.stateInfo) {
          employeePayrollStateTaxCodeDetailCreate.payrollStateTaxCodeId = c.stateInfo.value;
          employeePayrollStateTaxCodeDetailCreate.payrollStateTaxCode = new PayrollStateTaxCode();
          employeePayrollStateTaxCodeDetailCreate.payrollStateTaxCode.id = c.stateInfo.value;
          employeePayrollStateTaxCodeDetailCreate.payrollStateTaxCode.payrollStateTaxCodeName = c.stateInfo.name;
          employeePayrollStateTaxCodeDetailCreate.payrollStateTaxCode.payrollStateTaxCodeFsNo = c.stateInfo.text;
        }

        if (c.filingStatus) {
          employeePayrollStateTaxCodeDetailCreate.stateFilingStatusId = c.filingStatus.id;
          employeePayrollStateTaxCodeDetailCreate.stateFilingStatus = {
            id: c.filingStatus.id,
            stateFilingStatusName: '',
            stateFilingStatusDescription: c.filingStatus.name
          };
        }

        if (c.override) {
          employeePayrollStateTaxCodeDetailCreate.payrollTaxOverrideId = c.override.id;
          employeePayrollStateTaxCodeDetailCreate.payrollTaxOverride = new PayrollTaxOverride();
          employeePayrollStateTaxCodeDetailCreate.payrollTaxOverride.id = c.override.id;
          employeePayrollStateTaxCodeDetailCreate.payrollTaxOverride.payrollTaxOverrideDescription = c.override.name;
        }

        if (c.addOn) {
          employeePayrollStateTaxCodeDetailCreate.payrollTaxAddOnId = c.addOn.id;
          employeePayrollStateTaxCodeDetailCreate.payrollTaxAddOn = new PayrollTaxAddOn();
          employeePayrollStateTaxCodeDetailCreate.payrollTaxAddOn.id = c.addOn.id;
          employeePayrollStateTaxCodeDetailCreate.payrollTaxAddOn.payrollTaxAddOnDescription = c.addOn.name;
        }


        employeePayrollStateTaxCodeDetails.push(employeePayrollStateTaxCodeDetailCreate);
      })

      //add employeePayrollLocalTaxCodeDetails no required
      let employeePayrollLocalTaxCodeDetails = employeeTaxInformationUpsert.employeePayrollLocalTaxCodeDetails;
      data.locals.forEach(c => {
        let employeePayrollLocalTaxCodeDetailCreate = new EmployeePayrollLocalTaxCodeDetails();
        employeePayrollLocalTaxCodeDetailCreate.isNew = true;
        employeePayrollLocalTaxCodeDetailCreate.employeeId = employeeId;

        employeePayrollLocalTaxCodeDetailCreate.amount = c.extraLocalWithholdingAmount;
        employeePayrollLocalTaxCodeDetailCreate.percent = c.extraLocalWithholdingPercent;
        employeePayrollLocalTaxCodeDetailCreate.exemptions = c.exemptions;

        if (c.stateInfo) {
          employeePayrollLocalTaxCodeDetailCreate.payrollStateTaxCode = new PayrollStateTaxCode();
          employeePayrollLocalTaxCodeDetailCreate.payrollStateTaxCode.id = c.stateInfo.value;
          employeePayrollLocalTaxCodeDetailCreate.payrollStateTaxCode.payrollStateTaxCodeName = c.stateInfo.name;
          employeePayrollLocalTaxCodeDetailCreate.payrollStateTaxCode.payrollStateTaxCodeFsNo = c.stateInfo.text;
        }

        if (c.locality) {
          employeePayrollLocalTaxCodeDetailCreate.payrollLocalTaxCodeId = c.locality.id;
          employeePayrollLocalTaxCodeDetailCreate.payrollLocalTaxCode = new LocalTaxCode();
          employeePayrollLocalTaxCodeDetailCreate.payrollLocalTaxCode.id = c.locality.id;
          employeePayrollLocalTaxCodeDetailCreate.payrollLocalTaxCode.payrollLocalTaxCodeName = c.locality.payrollLocalTaxCodeName;

          employeePayrollLocalTaxCodeDetailCreate.payrollLocalTaxCodeOptions = [];
          employeePayrollLocalTaxCodeDetailCreate.payrollLocalTaxCodeOptions.push(employeePayrollLocalTaxCodeDetailCreate.payrollLocalTaxCode);
        }

        if (c.override) {
          employeePayrollLocalTaxCodeDetailCreate.payrollTaxOverrideId = c.override.id;
          employeePayrollLocalTaxCodeDetailCreate.payrollTaxOverride = new PayrollTaxOverride();
          employeePayrollLocalTaxCodeDetailCreate.payrollTaxOverride.id = c.override.id;
          employeePayrollLocalTaxCodeDetailCreate.payrollTaxOverride.payrollTaxOverrideDescription = c.override.name;
        }

        if (c.residence) {
          employeePayrollLocalTaxCodeDetailCreate.resident = {
            id: c.residence.id,
            name: c.residence.name
          } as DropdownOption;
        }

        if (c.addOn) {
          employeePayrollLocalTaxCodeDetailCreate.payrollTaxAddOnId = c.addOn.id;
          employeePayrollLocalTaxCodeDetailCreate.payrollTaxAddOn = new PayrollTaxAddOn();
          employeePayrollLocalTaxCodeDetailCreate.payrollTaxAddOn.id = c.addOn.id;
          employeePayrollLocalTaxCodeDetailCreate.payrollTaxAddOn.payrollTaxAddOnDescription = c.addOn.name;
        }

        employeePayrollLocalTaxCodeDetailCreate.isNew = true;

        //add new employeePayrollLocalTaxCodeDetail
        employeePayrollLocalTaxCodeDetails.push(employeePayrollLocalTaxCodeDetailCreate);
      })

      //add payrollLocalTaxGroup no required
      if (data.otherPayrollTaxGroup) {
        if (!employeeTaxInformationUpsert.payrollLocalTaxGroup) {
          employeeTaxInformationUpsert.payrollLocalTaxGroup = new TaxGroup()
        }

        let payrollLocalTaxGroup = employeeTaxInformationUpsert.payrollLocalTaxGroup;
        payrollLocalTaxGroup.id = data.otherPayrollTaxGroup.id;
        payrollLocalTaxGroup.payrollLocalTaxGroupName = data.otherPayrollTaxGroup.payrollLocalTaxGroupName;
        payrollLocalTaxGroup.isDeleted = false;
        payrollLocalTaxGroup.isActive = true;
      }

      //create TaxInformation
      await employeeTaxInformationApi.editEmployeeTaxInformation(employeeTaxInformationUpsert);
    }

    async function transferDataEmployeePayrollAndTax(employeeId: number,) {
      const employeePayrollAndTax = await whqEmployeePayrollInformationApi.getPayrollInformation(employeeId);

      await onboardingEmployerPayrollInformationStore.fetchFormPayrollInformation(Number(employeeId), FormFieldEnum.PayrollInformation)
      const getValueByKey = (key: string): any => {
        return dataOnboardingEmployerPayrollInformation.value.fieldModels.find(field => field.fieldKey === key)?.fieldValue
      }

      let employeePayrollAndTaxUpsert = {} as PayrollInformation;
      employeePayrollAndTaxUpsert.employeeId = employeeId;
      employeePayrollAndTaxUpsert.payTypeId = getValueByKey('payType')?.value;
      employeePayrollAndTaxUpsert.earnCodeId = getValueByKey('earnCode')?.id;
      employeePayrollAndTaxUpsert.payPeriodId = getValueByKey('payPeriod')?.id;
      employeePayrollAndTaxUpsert.payType = {
        id: getValueByKey('payType')?.value,
        payTypeName: getValueByKey('payType')?.text
      }
      employeePayrollAndTaxUpsert.earnCode = {
        id: getValueByKey('earnCode')?.id,
        earnCodeName: getValueByKey('earnCode')?.earnCodeName
      };
      employeePayrollAndTaxUpsert.payPeriod = {
        id: getValueByKey('payPeriod')?.id,
        payPeriodName: getValueByKey('payPeriod')?.payPeriodName
      };;
      employeePayrollAndTaxUpsert.payRate = getValueByKey('payRatePerPayPeriod');
      employeePayrollAndTaxUpsert.payPeriodsPerYear = getValueByKey('payPeriodsPerYear');
      employeePayrollAndTaxUpsert.isHoursRequiredForSalary = getValueByKey('hoursRequiredForSalary');
      employeePayrollAndTaxUpsert.isCertifiedPayroll = getValueByKey('certifiedPayroll');
      employeePayrollAndTaxUpsert.isFutaSutaExempt = getValueByKey('futaFusaExempt');

      if (employeePayrollAndTax) {
        Object.assign(employeePayrollAndTax, employeePayrollAndTaxUpsert)
        await whqEmployeePayrollInformationApi.editPayrollInformation(employeePayrollAndTax);
      } else {
        await whqEmployeePayrollInformationApi.editPayrollInformation(employeePayrollAndTaxUpsert);
      }

    }

    const employmentStatus = [
      { text: 'Full Time', value: EmploymentStatus.FullTime },
      { text: 'Part Time', value: EmploymentStatus.PartTime },
      { text: 'Variable Hour', value: EmploymentStatus.VariableHour },
      { text: 'Seasonal', value: EmploymentStatus.Seasonal },
    ];

    async function transferDataEmployeeEmployment(employeeId: number,) {
      const employmentDetail = await whqEmployeesApi.getEmployment(employeeId);
      // if (employmentDetail)
      //   return;

      await fetchFormEmploymentInformationData(employeeId, FormFieldEnum.EmploymentInformation)
      const getValueByKey = (key: string): any => {
        return formEmploymentInformation.value.fieldModels.find(field => field.fieldKey === key)?.fieldValue
      }

      let employeeEmploymentCreate = {} as any;
      if (employmentDetail) {
        Object.assign(employeeEmploymentCreate, employmentDetail);
      }
      else {
        employeeEmploymentCreate.i9Verified = true;
        employeeEmploymentCreate.employeeId = employeeId;
      }

      employeeEmploymentCreate.employmentStatusId = employmentStatus.find((item) => item.text === getValueByKey('employmentStatus')?.text)?.value;
      employeeEmploymentCreate.jobTitleId = getValueByKey(' ')?.id;
      employeeEmploymentCreate.departmentId = getValueByKey('department')?.id;
      employeeEmploymentCreate.stateOfHire = getValueByKey('stateOfHire')?.payrollStateTaxCodeFsNo;
      employeeEmploymentCreate.unionId = getValueByKey('union')?.id;
      employeeEmploymentCreate.tradeId = getValueByKey('trade')?.id;

      if (getValueByKey('acaExempt'))
        employeeEmploymentCreate.acaExempt = getValueByKey('acaExempt');

      employeeEmploymentCreate.oshaLevel = getValueByKey('oshaLevel');
      employeeEmploymentCreate.oshaCertificateNumber = getValueByKey('oshaCertificationNumber');
      employeeEmploymentCreate.oshaTradeLicense = getValueByKey('oshaTradeLicense');
      employeeEmploymentCreate.reportingSupervisorId = getValueByKey('reportingManager')?.id;
      employeeEmploymentCreate.additionalSupervisorIds = [];

      if (Array.isArray(getValueByKey('additionalManager'))) {
        employeeEmploymentCreate.additionalSupervisorIds = [...getValueByKey('additionalManager')?.map((item) => item?.id)];
      }
      
      employeeEmploymentCreate.workersCompStateId = getValueByKey('workerCompState')?.id;
      employeeEmploymentCreate.workersCompClassId = getValueByKey('workerCompClassNumber')?.id;

      if (getValueByKey('corporateOfficer'))
        employeeEmploymentCreate.corporateOfficer = getValueByKey('corporateOfficer');

      employeeEmploymentCreate.costCodeId = getValueByKey('costCodeNumber')?.id;
      employeeEmploymentCreate.generalLiabilityStateId = getValueByKey('generalLiabilityState')?.id;
      employeeEmploymentCreate.generalLiabilityClassId = getValueByKey('generalLiabilityClass')?.id;
      employeeEmploymentCreate.ownerOperator = true;

      await whqEmployeesApi.updateEmployment(employeeEmploymentCreate);
    }

    return {
      seedProgressData,
      listOfEmployeeInformation,
      getEmployeeInformation,
      fetchProgressOverview,
      progressOverview,
      personalInformation,
      fetchEmployeeInformationById,
      updateEmployeeInformationById,
      fetchPersonalInfoFormStatus,
      isSubmittedOnboardFormStatus,
      fetchPersonalInfoSsn,
      personalSSN,
      fetchMaritalStatusList,
      maritalStatusListOfEmployeeInformation,
      updateOnboardingInformations,
      completeOnboarding
    };
  }
);

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useOnboardingEmployeeInformationStore, import.meta.hot)
  );
}
