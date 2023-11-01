import { acceptHMRUpdate, defineStore } from "pinia";
import { ref } from "vue";
import { onboardingEmploymentInformationApi } from "../axios/instances/employmentInformationApi";
import EmploymentInformation, {
  CostCodeT,
  DepartmentT,
  GeneralLiabilityClassT,
  GeneralLiabilityStateT,
  JobTitleT,
  ManagerT,
  StateOfHireT,
  TradeT,
  UnionT,
  WorkersCompClassT,
  WorkersCompStateT,
} from "../models/EmploymentInformation";
import { UploadPayload } from "../models/onboarding/WOTC/UploadPayload";
import { payrollStateTaxCodeApi } from "@/axios/instances/payrollStateTaxCodeApi";

export const useOnboardingEmploymentInformationStore = defineStore(
  "onboardingEmploymentInformation",
  () => {
    const formEmploymentInformation =
      ref<Partial<UploadPayload<EmploymentInformation>>>();
    const jobTitleOptions = ref<JobTitleT[]>([]);
    const departmentOptions = ref<DepartmentT[]>([]);
    const costCodeOptions = ref<CostCodeT[]>([]);
    const tradeOptions = ref<TradeT[]>([]);
    const unionOptions = ref<UnionT[]>([]);
    const generalLiabilityClassOptions = ref<GeneralLiabilityClassT[]>([]);
    const generalLiabilityStateOptions = ref<GeneralLiabilityStateT[]>([]);
    const workersCompStatesOptions = ref<WorkersCompStateT[]>([]);
    const workersCompClassesOptions = ref<WorkersCompClassT[]>([]);
    const managerOptions = ref<ManagerT[]>([]);
    const payrollStateTaxCodesOptions = ref<StateOfHireT[]>([])
    const fetchFormEmploymentInformationData = async (
      employeeId: number,
      formId: number
    ): Promise<void> => {
      formEmploymentInformation.value =
        await onboardingEmploymentInformationApi.getEmploymentInformation(
          employeeId,
          formId
        );
    };

    const updateFormEmploymentInformationData = async ({
      employeeId,
      formData,
    }: {
      employeeId: number;
      formData: any;
    }): Promise<void> => {
      await onboardingEmploymentInformationApi.updateEmploymentInformation(
        employeeId,
        formData
      );
    };

    const fetchJobTitleOptions = async (): Promise<void> => {
      jobTitleOptions.value =
        await onboardingEmploymentInformationApi.getJobTitleOptions();
    };

    const fetchDepartmentOptions = async (): Promise<void> => {
      departmentOptions.value =
        await onboardingEmploymentInformationApi.getDepartmentOptions();
    };

    const fetchCostCodeOptions = async (): Promise<void> => {
      costCodeOptions.value =
        await onboardingEmploymentInformationApi.getCostCodeOptions();
    };

    const fetchTradeOptions = async (): Promise<void> => {
      tradeOptions.value =
        await onboardingEmploymentInformationApi.getTradeOptions();
    };

    const fetchUnionOptions = async (): Promise<void> => {
      unionOptions.value =
        await onboardingEmploymentInformationApi.getUnionOptions();
    };

    const fetchGeneralLiabilityClassOptions = async (): Promise<void> => {
      generalLiabilityClassOptions.value =
        await onboardingEmploymentInformationApi.getGeneralLiabilityClassOptions();
    };

    const fetchGeneralLiabilityStateOptions = async (): Promise<void> => {
      generalLiabilityStateOptions.value =
        await onboardingEmploymentInformationApi.getGeneralLiabilityStateOptions();
    };
    const fetchWorkersCompStatesOptions = async (): Promise<void> => {
      workersCompStatesOptions.value =
        await onboardingEmploymentInformationApi.getWorkersCompStatesOptions();
    };
    const fetchWorkersCompClassesOptions = async (): Promise<void> => {
      workersCompClassesOptions.value =
        await onboardingEmploymentInformationApi.getWorkersCompClassesOptions();
    };

    const fetchPayrollStateTaxCodes = async (): Promise<void> => {
      payrollStateTaxCodesOptions.value =
        await payrollStateTaxCodeApi.getPayrollStateTaxCodes();
    };

    const fetchManagerOptions = async (): Promise<void> => {
      managerOptions.value =
        await onboardingEmploymentInformationApi.getManagers();
    };

    const updateJobTitleOptions = async (
      jobTitleName: string
    ): Promise<void> => {
      await onboardingEmploymentInformationApi.updateJobTitleOptions(
        jobTitleName
      );
    };

    return {
      formEmploymentInformation,
      fetchFormEmploymentInformationData,
      fetchJobTitleOptions,
      fetchDepartmentOptions,
      fetchCostCodeOptions,
      fetchTradeOptions,
      fetchUnionOptions,
      fetchGeneralLiabilityClassOptions,
      fetchGeneralLiabilityStateOptions,
      fetchWorkersCompStatesOptions,
      fetchWorkersCompClassesOptions,
      fetchManagerOptions,
      fetchPayrollStateTaxCodes,
      jobTitleOptions,
      updateFormEmploymentInformationData,
      updateJobTitleOptions,
      departmentOptions,
      costCodeOptions,
      tradeOptions,
      unionOptions,
      generalLiabilityClassOptions,
      generalLiabilityStateOptions,
      workersCompStatesOptions,
      workersCompClassesOptions,
      managerOptions,
      payrollStateTaxCodesOptions

    };
  }
);

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useOnboardingEmploymentInformationStore, import.meta.hot)
  );
}
