import { VacationType } from "@/models/employees/timeOff/VacationType";
import { VacationPlan } from "@/models/employees/timeOff/VacationPlan";
import { TimeOffPlan } from "@/models/employees/timeOff/TimeOffPlan";
import { AssignedVacationPlans } from "@/models/employees/timeOff/AssignedVacationPlans";
import AxiosBase from "./axiosBase";
import AccessTokenRequestInterceptor from "../interceptors/accessToken-request-interceptor";
import AccessTokenResponseInterceptor from "../interceptors/accessToken-response-interceptor";
import { getLocalAppsettings } from "@/helper/hqSuite/appSettingsHelper";
import { OnboardingFormVacation } from '@/models/onboarding/OnboardingVacation';
import { useAlerts } from '../../composables/useAlerts';
import { HttpStatusCode } from "axios";
import { MESSAGE } from "@/data/message";
const { notifyError, notifySuccess } = useAlerts();
export class TimeOffPlanApi extends AxiosBase {
  constructor(interceptors: Array<any>) {
    const baseUrl = getLocalAppsettings().ClientSide.WorkforceManagement + "/v1";
    super(interceptors, baseUrl);
  }

  public async getTimeOffPlan(empId: string): Promise<TimeOffPlan[]> {
    let timeOffPlanList: TimeOffPlan[];
    try {
      const response = await this.axiosInstance.get<TimeOffPlan[]>(
        `AssignedVacationPlans/${empId}/`
      );

      if (response && response.data && response.status === 200) {
        timeOffPlanList = response.data;
      } else {
        throw new Error("Failed to parse time-off plan list");
      }
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to retrieve the time-off plan list.",
        error
      );
    }
    return timeOffPlanList;
  }

  public async getAccrualPlans(employeeId, hasPlanBeenAssigned): Promise<VacationPlan[]> {
    let vacationPlanName: VacationPlan[];
    try {
      const response = await this.axiosInstance.get<VacationPlan[]>(`/employees/${employeeId}/assignedPlans`, {
        params: {
          employeeId: employeeId,
          hasPlanBeenAssigned: hasPlanBeenAssigned
        }
      });

      if (response && response.data && response.status === 200) {
        vacationPlanName = response.data;
      } else {
        throw new Error("Failed to parse time-off plan list");
      }
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to retrieve the time-off plan list.",
        error
      );
    }
    return vacationPlanName;
  }

  public async getAccrualCodes(employeeId): Promise<VacationType[]> {
    let vacationTypeList: VacationType[];
    try {
      const response = await this.axiosInstance.get<VacationType[]>(`/employees/${employeeId}/assignedPlans/types`,
      );

      if (response && response.data && response.status === 200) {
        vacationTypeList = response.data;
      } else {
        throw new Error("Failed to parse time-off plan list");
      }
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to retrieve the time-off plan list.",
        error
      );
    }
    return vacationTypeList;
  }

  public async addTimeOffPlanToEmployee(data: any): Promise<boolean> {
    try {
      const response = await this.axiosInstance.post(`AssignedVacationPlans/${data.employeeId}`, data);
      if (response && response.status === 200) {
        return response.data;
      } else {
        throw new Error("Failed to add time-off plan to employee");
      }
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to retrieve the time-off plan to employee",
        error
      );
      if (error.response.data.status === HttpStatusCode.Conflict && error.response.data.detail === MESSAGE.HR_APPROVAL.UPDATE_ERROR_DETAIL_RESPONSE) {
        notifyError(MESSAGE.HR_APPROVAL.UPDATE_ERROR);
      }
    }
  }

  public async updateTimeOffPlanToEmployee(data: any): Promise<boolean> {
    try {
      const response = await this.axiosInstance.patch(`AssignedVacationPlans/${data.employeeId}/employeeAccrualPlan/${data.employeeAccrualPlanId}`, data);
      if (response && response.status === 200) {
        return response.data;
      } else {
        throw new Error("Failed to update time-off plan to employee");
      }
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to retrieve the time-off plan to employee",
        error
      );
      if (error.response.data.status === HttpStatusCode.Conflict && error.response.data.detail === MESSAGE.HR_APPROVAL.UPDATE_ERROR_DETAIL_RESPONSE) {
        notifyError(MESSAGE.HR_APPROVAL.UPDATE_ERROR);
      }
    }
  }

  public async getVacationPlansByPlanId(planTypeId?: number): Promise<VacationPlan[]> {
    let vacationPlanName: VacationPlan[];
    try {
      const response = await this.axiosInstance.get<VacationPlan[]>(`VacationPlans?planTypeId=${planTypeId}`);

      if (response && response.data && response.status === 200) {
        vacationPlanName = response.data;
      } else {
        throw new Error("Failed to parse time-off plan list");
      }
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to retrieve the time-off plan list.",
        error
      );
      notifyError('There was an error while fetching Vacation Plan.');
    }
    return vacationPlanName;
  }
  public async getFormVacation(employeeId: number, formType: number): Promise<OnboardingFormVacation> {
    const endPoint = `/api/v1/employees/${employeeId}/formFieldValue?formId=${formType}`;
    let formVacation: OnboardingFormVacation;
    try {
      const response = await this.axiosInstance.get(getLocalAppsettings().ClientSide.WorkforceEmployeeManagement + endPoint);

      if (response && response.data && response.status === 200) {
        formVacation = response.data;
      } else {
        throw new Error("Failed to get Form Vacation data");
      }
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to retrieve Form Vacation data.",
        error,
      );
      notifyError('There was an error while fetching Vacation form.');
    }
    return formVacation;
  }
  public async updateOnboardingFormVacation(employeeId: number, formData: OnboardingFormVacation) {
    try {
      await this.axiosInstance.post(
        `${getLocalAppsettings().ClientSide.WorkforceEmployeeManagement}/api/v1/employees/${employeeId}/formFieldValue`, formData);
      notifySuccess('Information updated.')
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to update the Onboarding Vacation",
        error
      )
      notifyError('There was an error while updating Vacation.');
      throw error;
    }
  }


  public async getAssignedVacationPlans(employeeId: number): Promise<AssignedVacationPlans> {
    let assignedVacationPlans: AssignedVacationPlans;
    try {
      const response = await this.axiosInstance.get<AssignedVacationPlans>(`/AssignedVacationPlans/${employeeId}`);

      if (response && response.data && response.status === 200) {
        assignedVacationPlans = response.data;
      } else {
        throw new Error("Failed to parse time-off plan list");
      }
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to retrieve the Assigned Vacation Plans.",
        error
      );
      notifyError('There was an error while fetching Assigned Vacation Plans.');
    }
    return assignedVacationPlans;
  }

  public async upsertAssignedVacationPlans(data: AssignedVacationPlans): Promise<void> {
    try {
      const response = await this.axiosInstance.post(`/AssignedVacationPlans/${data.employeeId}/employeeAccrualPlan`, data);
      if (!response ||  response.status !== 200) {
        throw new Error("Failed to upsert an AssignedVacationPlans");
      } 
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to create the  Assigned Vacation Plans.",
        error
      );
      notifyError('There was an error while updating Assigned Vacation Plans.');
    }
  }

}
export const timeOffPlanApi = new TimeOffPlanApi([
  AccessTokenRequestInterceptor,
  AccessTokenResponseInterceptor,
]);
