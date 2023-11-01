import { getLocalAppsettings } from "../../helper/hqSuite/appSettingsHelper";
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
} from "../../models/EmploymentInformation";
import { UploadPayload } from "../../models/onboarding/WOTC/UploadPayload";
import AccessTokenRequestInterceptor from "../interceptors/accessToken-request-interceptor";
import AccessTokenResponseInterceptor from "../interceptors/accessToken-response-interceptor";
import AxiosBase from "./axiosBase";

export class OnboardingEmploymentInformationApi extends AxiosBase {
  constructor(interceptors: Array<any>) {
    const baseUrl = `${
      getLocalAppsettings().ClientSide.WorkforceEmployeeManagement
    }/api/v1`;
    super(interceptors, baseUrl);
  }

  public async getEmploymentInformation(
    empId: number,
    formId: number
  ): Promise<UploadPayload<EmploymentInformation>> {
    let employmentInformation: UploadPayload<EmploymentInformation> =
      {} as UploadPayload<EmploymentInformation>;
    try {
      const response = await this.axiosInstance.get<
        UploadPayload<EmploymentInformation>
      >(`employees/${empId}/formFieldValue?formId=${formId}`);

      if (response && response.data && response.status === 200) {
        employmentInformation = response.data;
      } else {
        throw new Error("Failed to parse employment information data");
      }
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to retrieve the employment information data.",
        error
      );
    }
    return employmentInformation;
  }

  public async updateEmploymentInformation(
    empId: number,
    formData: Partial<UploadPayload<EmploymentInformation>>
  ): Promise<void> {
    try {
      await this.axiosInstance.post<UploadPayload<EmploymentInformation>>(
        `employees/${empId}/formFieldValue`,
        formData
      );
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to update the employment information.",
        error
      );
    }
  }

  public async getJobTitleOptions(): Promise<JobTitleT[]> {
    let jobTitleOptions: JobTitleT[] = [];
    try {
      const response = await this.axiosInstance.get(
        `${getLocalAppsettings().ClientSide.WorkforceManagement}/v1/JobTitles`
      );

      if (response && response.data && response.status === 200) {
        jobTitleOptions = response.data;
      } else {
        throw new Error("Failed to parse job title list");
      }
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to retrieve the job title list.",
        error
      );
    }
    return jobTitleOptions;
  }

  public async getDepartmentOptions(): Promise<DepartmentT[]> {
    let departmentOptions: DepartmentT[] = [];
    try {
      const response = await this.axiosInstance.get(
        `${
          getLocalAppsettings().ClientSide.WorkforceManagement
        }/v1/departments?IsSynced=true`
      );

      if (response && response.data && response.status === 200) {
        departmentOptions = response.data;
      } else {
        throw new Error("Failed to parse department list");
      }
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to retrieve the department list.",
        error
      );
    }
    return departmentOptions;
  }

  public async getCostCodeOptions(): Promise<CostCodeT[]> {
    let costCodeOptions: CostCodeT[] = [];
    try {
      const response = await this.axiosInstance.get(
        `${
          getLocalAppsettings().ClientSide.WorkforceManagement
        }/v1/FoundationIntegration/costcodes?IsSynced=true`
      );

      if (response && response.data && response.status === 200) {
        costCodeOptions = response.data;
      } else {
        throw new Error("Failed to parse cost code list");
      }
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to retrieve the cost code list.",
        error
      );
    }
    return costCodeOptions;
  }

  public async getTradeOptions(): Promise<TradeT[]> {
    let tradeOptions: TradeT[] = [];
    try {
      const response = await this.axiosInstance.get(
        `${
          getLocalAppsettings().ClientSide.WorkforceManagement
        }/v1/FoundationIntegration/trades?IsSynced=true`
      );

      if (response && response.data && response.status === 200) {
        tradeOptions = response.data;
      } else {
        throw new Error("Failed to parse trade list");
      }
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to retrieve the trade list.",
        error
      );
    }
    return tradeOptions;
  }

  public async getUnionOptions(): Promise<UnionT[]> {
    let unionOptions: UnionT[] = [];
    try {
      const response = await this.axiosInstance.get(
        `${
          getLocalAppsettings().ClientSide.WorkforceManagement
        }/v1/FoundationIntegration/unions?IsSynced=true`
      );

      if (response && response.data && response.status === 200) {
        unionOptions = response.data;
      } else {
        throw new Error("Failed to parse union list");
      }
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to retrieve the union list.",
        error
      );
    }
    return unionOptions;
  }

  public async getGeneralLiabilityClassOptions(): Promise<
    GeneralLiabilityClassT[]
  > {
    let generalLiabilityClassOptions: GeneralLiabilityClassT[] = [];
    try {
      const response = await this.axiosInstance.get(
        `${
          getLocalAppsettings().ClientSide.WorkforceManagement
        }/v1/FoundationIntegration/generalliabilityclasses?IsSynced=true`
      );

      if (response && response.data && response.status === 200) {
        generalLiabilityClassOptions = response.data;
      } else {
        throw new Error("Failed to parse general liability class list");
      }
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to retrieve the general liability class list.",
        error
      );
    }
    return generalLiabilityClassOptions;
  }

  public async getGeneralLiabilityStateOptions(): Promise<
    GeneralLiabilityStateT[]
  > {
    let generalLiabilityStateOptions: GeneralLiabilityStateT[] = [];
    try {
      const response = await this.axiosInstance.get(
        `${
          getLocalAppsettings().ClientSide.WorkforceManagement
        }/v1/FoundationIntegration/generalliabilitystates?IsSynced=true`
      );

      if (response && response.data && response.status === 200) {
        generalLiabilityStateOptions = response.data;
      } else {
        throw new Error("Failed to parse general liability state list");
      }
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to retrieve the general liability state list.",
        error
      );
    }
    return generalLiabilityStateOptions;
  }

  public async getWorkersCompClassesOptions(): Promise<WorkersCompClassT[]> {
    let workersCompClassesOptions: WorkersCompClassT[] = [];
    try {
      const response = await this.axiosInstance.get(
        `${
          getLocalAppsettings().ClientSide.WorkforceManagement
        }/v1/FoundationIntegration/workersCompClasses?IsSynced=true`
      );

      if (response && response.data && response.status === 200) {
        workersCompClassesOptions = response.data;
      } else {
        throw new Error("Failed to parse general worker company class");
      }
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to retrieve the general worker company class.",
        error
      );
    }
    return workersCompClassesOptions;
  }

  public async getWorkersCompStatesOptions(): Promise<WorkersCompStateT[]> {
    let workersCompStatesOptions: WorkersCompStateT[] = [];
    try {
      const response = await this.axiosInstance.get(
        `${
          getLocalAppsettings().ClientSide.WorkforceManagement
        }/v1/FoundationIntegration/workersCompStates?IsSynced=true`
      );

      if (response && response.data && response.status === 200) {
        workersCompStatesOptions = response.data;
      } else {
        throw new Error("Failed to parse general company state list");
      }
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to retrieve the general company state list.",
        error
      );
    }
    return workersCompStatesOptions;
  }

  public async updateJobTitleOptions(newJobTitleName: string): Promise<void> {
    try {
      await this.axiosInstance.post(
        `${getLocalAppsettings().ClientSide.WorkforceManagement}/v1/JobTitles`,
        {
          jobTitleName: newJobTitleName,
        }
      );
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to update the job title list.",
        error
      );
    }
  }

  public async getManagers(): Promise<ManagerT[]> {
    let managerOptions: ManagerT[] = [];
    try {
      const response = await this.axiosInstance.get(
        `${getLocalAppsettings().ClientSide.WorkforceManagement}/v1/Employee`
      );

      if (response && response.data && response.status === 200) {
        managerOptions = response.data;
      } else {
        throw new Error("Failed to parse manager list");
      }
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to retrieve the manager list.",
        error
      );
    }
    return managerOptions;
  }
}

export const onboardingEmploymentInformationApi =
  new OnboardingEmploymentInformationApi([
    AccessTokenRequestInterceptor,
    AccessTokenResponseInterceptor,
  ]);
