import { getLocalAppsettings } from "../../helper/hqSuite/appSettingsHelper";
import AccessTokenRequestInterceptor from "../interceptors/accessToken-request-interceptor";
import AccessTokenResponseInterceptor from "../interceptors/accessToken-response-interceptor";
import AxiosBase from "./axiosBase";
import OnboardingQuickHireTaxWithHoldingInfo from "../../models/onboarding/OnboardingQuickHireTaxWithHoldingInfo";
export class OnboardingQuickHireTaxWithHoldingInfoApi extends AxiosBase {
    constructor(interceptors: Array<any>) {
        const baseUrl = `${getLocalAppsettings().ClientSide.WorkforceEmployeeManagement}/api/v1/`;
        super(interceptors, baseUrl);
    }

    public async getOnboardingQuickHireTaxWithHoldingInfo(employeeId: number, formId: number) {
        let onboardingQuickHireTaxWithHoldingInfo: OnboardingQuickHireTaxWithHoldingInfo | undefined;
        try {
            const response = await this.axiosInstance.get<OnboardingQuickHireTaxWithHoldingInfo>(`employees/${employeeId}/formFieldValue?formId=${formId}`);
            if (response.data && response.status === 200) {
                onboardingQuickHireTaxWithHoldingInfo = response.data;
            }
        } catch (error) {
            console.error(
                "An unexpected error occurred attempting to retrieve the Onboarding Quick Hire Tax With Holding Info",
                error
            )
            throw error;
        }
        return onboardingQuickHireTaxWithHoldingInfo;
    }

    public async updateOnboardingQuickHireTaxWithHoldingInfo(employeeId: number, formData: OnboardingQuickHireTaxWithHoldingInfo) {
        try {
            await this.axiosInstance.post<OnboardingQuickHireTaxWithHoldingInfo>(`employees/${employeeId}/formFieldValue`, formData);
        } catch (error) {
            console.error(
                "An unexpected error occurred attempting to update the Onboarding Quick Hire Tax With Holding Info",
                error
            )
            throw error;
        }
    }
}

export const onboardingQuickHireTaxWithHoldingInfoApi = new OnboardingQuickHireTaxWithHoldingInfoApi([
    AccessTokenRequestInterceptor,
    AccessTokenResponseInterceptor,
]);
