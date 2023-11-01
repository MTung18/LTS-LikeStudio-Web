import AccessTokenRequestInterceptor from "../interceptors/accessToken-request-interceptor";
import AccessTokenResponseInterceptor from "../interceptors/accessToken-response-interceptor";
import { getLocalAppsettings } from "../../helper/hqSuite/appSettingsHelper";
import OnboardingEmployerInformation from '../../models/onboarding/OnboardingEmployerInformation';
import AxiosBase from "./axiosBase";

export class OnboardingEmployerInformationApi extends AxiosBase {
    constructor(interceptors: Array<any>) {
        const baseUrl = `${getLocalAppsettings().ClientSide.WorkforceEmployeeManagement}/api/v1/`;
        super(interceptors, baseUrl);
    }

    public async getOnboardingEmployerInformation(employeeId: number, formId: number) {
        let onboardingEmployerInformation: OnboardingEmployerInformation | undefined;
        try {
            const response = await this.axiosInstance.get<OnboardingEmployerInformation>(`employees/${employeeId}/formFieldValue?formId=${formId}`);
            if (response.data && response.status === 200) {
                onboardingEmployerInformation = response.data;
            }
        } catch (error) {
            console.error(
                "An unexpected error occurred attempting to retrieve the Onboarding Employer Information",
                error
            )
            throw error;
        }
        return onboardingEmployerInformation;
    }

    public async updateOnboardingEmployerInformation(employeeId: number, formData: OnboardingEmployerInformation) {
        try {
            await this.axiosInstance.post<OnboardingEmployerInformation>(`employees/${employeeId}/formFieldValue`, formData);
        } catch (error) {
            console.error(
                "An unexpected error occurred attempting to update the Onboarding Employer Information",
                error
            )
            throw error;
        }
    }
}

export const onboardingEmployerInformationApi = new OnboardingEmployerInformationApi([
    AccessTokenRequestInterceptor,
    AccessTokenResponseInterceptor,
]);