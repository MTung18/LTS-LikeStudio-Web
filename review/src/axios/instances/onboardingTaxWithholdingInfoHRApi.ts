import AccessTokenRequestInterceptor from "../interceptors/accessToken-request-interceptor";
import AccessTokenResponseInterceptor from "../interceptors/accessToken-response-interceptor";
import { getLocalAppsettings } from "../../helper/hqSuite/appSettingsHelper";
import FormField from '../../models/onboarding/FormField';
import AxiosBase from "./axiosBase";

export class OnboardingTaxWithHoldingInfoHRApi extends AxiosBase {
    constructor(interceptors: Array<any>) {
        const baseUrl = `${getLocalAppsettings().ClientSide.WorkforceEmployeeManagement}/api/v1/`;
        super(interceptors, baseUrl);
    }

    public async getOnboardingTaxWithHoldingInfoHR(employeeId: number, formId: number): Promise<FormField | undefined> {
        let onboardingTaxWithHoldingInfoHR: FormField | undefined;
        try {
            const response = await this.axiosInstance.get<FormField>(`employees/${employeeId}/formFieldValue?formId=${formId}`);
            if (response.data && response.status === 200) {
                onboardingTaxWithHoldingInfoHR = response.data;
            }
        } catch (error) {
            console.error(
                "An unexpected error occurred attempting to retrieve the Onboarding Tax With Holding Info HR",
                error
            )
            throw error;
        }

        return onboardingTaxWithHoldingInfoHR;
    }

    public async updateOnboardingTaxWithHoldingInfoHR(employeeId: number, formData: FormField): Promise<void> {
        try {
            await this.axiosInstance.post<FormField>(`employees/${employeeId}/formFieldValue`, formData);
        } catch (error) {
            console.error(
                "An unexpected error occurred attempting to update the Onboarding Tax With Holding Info HR",
                error
            );
            throw error;
        }
    }
}

export const onboardingTaxWithHoldingInfoHRApi = new OnboardingTaxWithHoldingInfoHRApi([
    AccessTokenRequestInterceptor,
    AccessTokenResponseInterceptor,
]);