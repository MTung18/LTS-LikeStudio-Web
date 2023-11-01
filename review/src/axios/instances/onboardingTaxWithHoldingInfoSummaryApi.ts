import AccessTokenRequestInterceptor from "../interceptors/accessToken-request-interceptor";
import AccessTokenResponseInterceptor from "../interceptors/accessToken-response-interceptor";
import { OnboardingTaxWithholdingInfoSummary } from '../../models/onboarding/onboardingTaxWithholdingInfoSummary';
import { getLocalAppsettings } from "../../helper/hqSuite/appSettingsHelper";
import AxiosBase from "./axiosBase";

export class OnboardingTaxWithHoldingInfoSummaryApi extends AxiosBase {
    constructor(interceptors: Array<any>) {
        const baseUrl = `${getLocalAppsettings().ClientSide.WorkforceEmployeeManagement}/api/v1/`;
        super(interceptors, baseUrl);
    }

    public async getOnboardingTaxWithHoldingInfoSummary(employeeId: number, formId: number) {
        let onboardingQuickHireTaxWithHoldingInfo: OnboardingTaxWithholdingInfoSummary | undefined;
        try {
            const response = await this.axiosInstance.get<OnboardingTaxWithholdingInfoSummary>(`employees/${employeeId}/formFieldValue?formId=${formId}`);
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

    public async updateOnboardingTaxWithHoldingInfoSummary(employeeId: number, formData: OnboardingTaxWithholdingInfoSummary) {
        try {
            await this.axiosInstance.post<OnboardingTaxWithholdingInfoSummary>(`employees/${employeeId}/formFieldValue`, formData);
        } catch (error) {
            console.error(
                "An unexpected error occurred attempting to update the Onboarding Quick Hire Tax With Holding Info",
                error
            )
            throw error;
        }
    }
}

export const onboardingTaxWithHoldingInfoSummaryApi = new OnboardingTaxWithHoldingInfoSummaryApi([
    AccessTokenRequestInterceptor,
    AccessTokenResponseInterceptor,
]);