import AccessTokenRequestInterceptor from "../interceptors/accessToken-request-interceptor";
import AccessTokenResponseInterceptor from "../interceptors/accessToken-response-interceptor";
import { getLocalAppsettings } from "../../helper/hqSuite/appSettingsHelper";
import AxiosBase from "./axiosBase";
import { useAlerts } from '../../composables/useAlerts';
import FormField from "../../models/onboarding/FormField";

const { notifyError, notifySuccess } = useAlerts();

export class OnboardingEEOSelfIdentificationApi extends AxiosBase {
    constructor(interceptors: Array<any>) {
        const baseUrl = `${getLocalAppsettings().ClientSide.WorkforceEmployeeManagement}/api/v1/`;
        super(interceptors, baseUrl);
    }

    public async getOnboardingEEOSelfIdentification(employeeId: number, formId: number) {
        let onboardingEEOSelfIdentification: FormField | undefined;
        try {
            const response = await this.axiosInstance.get<FormField>(`employees/${employeeId}/formFieldValue?formId=${formId}`);
            if (response.data && response.status === 200) {
                onboardingEEOSelfIdentification = response.data;
            }
        } catch (error) {
            console.error(
                "An unexpected error occurred attempting to retrieve the Onboarding Quick Hire Tax With Holding Info",
                error
            )
            throw error;
        }
        return onboardingEEOSelfIdentification;
    }

    public async updateOnboardingEEOSelfIdentification(employeeId: number, formData: FormField) {
        try {
            await this.axiosInstance.post<FormField>(`employees/${employeeId}/formFieldValue`, formData);
            notifySuccess('Information updated.')
        } catch (error) {
            console.error(
                "An unexpected error occurred attempting to update the Onboarding Quick Hire Tax With Holding Info",
                error
            )
            notifyError('There was an error while updating information.')
            throw error;
        }
    }
}

export const onboardingEEOSelfIdentificationApi = new OnboardingEEOSelfIdentificationApi([
    AccessTokenRequestInterceptor,
    AccessTokenResponseInterceptor,
]);