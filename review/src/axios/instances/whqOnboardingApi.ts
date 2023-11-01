import AxiosBase from "./axiosBase";
import AccessTokenRequestInterceptor from "../interceptors/accessToken-request-interceptor";
import AccessTokenResponseInterceptor from "../interceptors/accessToken-response-interceptor";
import OnboardingPlan from "@/models/onboarding/OnboardingPlan";
import CurrentOnboards, { EmployeeOnboardList } from "@/models/CurrentOnboards";
import { EmployeeOnboardingCountStatuses } from "@/models/onboarding/EmployeeOnboardingCountStatuses";
import { getLocalAppsettings } from "@/helper/hqSuite/appSettingsHelper";
import OnboardingProgress from "@/models/onboarding/onboardingProgress";
import { ActionType } from "@/enums/ActionType";
import { saveAs } from "file-saver";
import { DownloadReviewPDFPayload } from '@/models/onboarding/OnboardingFinalReview';

export const baseUrlOnboardingApi = "onboarding";
export const baseUrlCurrentEmployeeApi = "Employee";
export const baseUrlEmployeeOnboardListApi = "Employee/currentOnboards";
export const baseUrlDetailEmployeeApi = "ProgressSidebar";
export default class WhqOnboardingApi extends AxiosBase {
  constructor(interceptors: Array<any>) {
    const baseUrl = getLocalAppsettings().ClientSide.WorkforceManagement + "/v1";
    super(interceptors, baseUrl, 'onboarding plan');
  }

  public async getCurrentOnboard(): Promise<CurrentOnboards[]> {
    let currentOnboard: CurrentOnboards[];
    try {
      const response = await this.PerformFetch<CurrentOnboards[]>(baseUrlCurrentEmployeeApi);
      currentOnboard = response.map(employee => new CurrentOnboards(employee));
    } catch (error) {
      console.error(this.errormessage(ActionType.Fetch), error);
    }
    return currentOnboard;
  }

  public async getEmployeeOnboardList(tabNumber: number): Promise<EmployeeOnboardList[]> {
    let employeeList: EmployeeOnboardList[];
    try {
      const response = await this.PerformFetch<EmployeeOnboardList[]>(`${baseUrlEmployeeOnboardListApi}?tabNumber=${tabNumber}`);
      employeeList = response;
    } catch (error) {
      console.error(this.errormessage(ActionType.Fetch), error);
    }
    return employeeList;
  }

  public async getOnboardingPlans(): Promise<OnboardingPlan[]> {
    let onboardingPlanList: OnboardingPlan[];
    try {
      const response = await this.PerformFetch<OnboardingPlan[]>(`${baseUrlOnboardingApi}/plan`);
      onboardingPlanList = response.map(
        (onboardingPlan) => new OnboardingPlan(onboardingPlan)
      );
      if (
        response
      ) {
        onboardingPlanList = response.map(
          (onboardingPlan) => new OnboardingPlan(onboardingPlan)
        );
      } else {
        throw new Error("Failed to parse current onboard list");
      }
    } catch (error) {
      console.error(this.errormessage(ActionType.Fetch), error);
    }
    return onboardingPlanList;
  }

  public async changeEmployeeStatus(listEmployeeId: number[], type: number): Promise<void> {
    try {
      await this.axiosInstance.put(
        `/Employee/Ids/status?statusId=${type}`, listEmployeeId
      );
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to cancel onboarding plan.",
        error
      );
    }
  }

  public async fetchOnboardingProgress(): Promise<OnboardingProgress> {
    const progress: OnboardingProgress = new OnboardingProgress();
    try {
      await this.PerformFetch<OnboardingProgress>(`${baseUrlOnboardingApi}/progress`);
    } catch (error) {
      console.error(this.errormessage(ActionType.Fetch, 'onboarding progress'), error);
    }
    return progress;
  }

  public async getOnboardingPaymentMethodSetting() {
    let paymentMethodSetting = { isPaperCheck: false, isDirectDeposit: false };
    try {
      const response = await this.axiosInstance.get(`GeneralClientSettings`);
      paymentMethodSetting = {
        isPaperCheck: response.data.isPaperCheck,
        isDirectDeposit: response.data.isDirectDeposit,
      };
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to get onboarding payment method setting.",
        error
      );
    }
    return paymentMethodSetting;
  }

  public async getEmployeeFormSubmit(employeeId: number): Promise<boolean> {
    let isSubmitted = false;
    try {
      const response = await this.axiosInstance.get(
        `/Employee/formsubmit?employeeId=${employeeId}`
      );
      isSubmitted = !!response.data
    } catch (error) {
      if (error && error.response && error.response.status == '404') {
        isSubmitted = false
      } else {
        console.error(
          "An unexpected error occurred attempting to get employee form submit status.",
          error
        );
      }
    }
    return isSubmitted;
  }

  public async updateForm(employeeId: number, isClear: boolean): Promise<boolean> {
    let result: boolean;
    try {
      const response = await this.axiosInstance.post(
        getLocalAppsettings().ClientSide.WorkforceEmployeeManagement + `/api/v1/employees/${employeeId}/skipOnboarding?isClearValue=${isClear}`
      )
      result = response.data;
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to update form.",
        error
      );
    }
    return result
  }

  public async updateMultipleSidebar(listEmployeeId: number[]): Promise<boolean> {
    let result: boolean;
    try {
      const response = await this.axiosInstance.put(
        getLocalAppsettings().ClientSide.WorkforceEmployeeManagement + "/api/v1/ProgressSidebars/employeeSelfServiceStatus", listEmployeeId
      )
      result = response.data;
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to update.",
        error
      );
    }
    return result
  }

  public async downloadFinalReview(payload: DownloadReviewPDFPayload) {
    try {
      const res = await this.axiosInstance.get(`employees/${payload.employeeId}/FinalReviews/pdf?type=${payload.type}`,
        {
          'responseType': 'blob',
          'headers': {
            'Accept': 'application/octet-stream'
          }
        }
      );
      const blob: Blob = new Blob([res.data], { type: 'application/pdf' });
      saveAs(blob, payload.filename);
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to get employee form submit status.",
        error
      );
      throw error;
    }

  }

  public async getOnboardingProgressStatus(): Promise<EmployeeOnboardingCountStatuses> {
    let employeeOnboardingCountStatuses: EmployeeOnboardingCountStatuses;
    try {
      employeeOnboardingCountStatuses = await this.PerformFetch<EmployeeOnboardingCountStatuses>(`${baseUrlOnboardingApi}/countsByStatus`);
    } catch (error) {
      console.error(this.errormessage(ActionType.Fetch), error);
    }
    return employeeOnboardingCountStatuses;
  }
}

export const whqOnboardingApi = new WhqOnboardingApi([
  AccessTokenRequestInterceptor,
  AccessTokenResponseInterceptor,
]);
