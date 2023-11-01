import AxiosBase from "./axiosBase";
import AccessTokenRequestInterceptor from "../interceptors/accessToken-request-interceptor";
import AccessTokenResponseInterceptor from "../interceptors/accessToken-response-interceptor";
import { getLocalAppsettings } from "../../helper/hqSuite/appSettingsHelper";
import OnboardingQuickHireEEO from "../../models/onboarding/OnboardingQuickHireEEO";
import { useAlerts } from '@/composables/useAlerts';

const { notifyError, notifySuccess } = useAlerts();
export default class OnboardingQuickHireEEOApi extends AxiosBase {
    constructor(interceptors: Array<any>) {
        const baseUrl = `${getLocalAppsettings().ClientSide.WorkforceEmployeeManagement}/api/v1/`;
        super(interceptors, baseUrl);
    }

    public async getOnboardingQuickHireEEO(employeeId: number, formId: number) {
        try {
            const response = await this.axiosInstance.get<OnboardingQuickHireEEO>(
                `employees/${employeeId}/formFieldValue?formId=${formId}`
            );

            if (response.status === 200 && response.data) {
                return response.data;
            } else {
                throw new Error("Failed to fetch Onboarding Quick Hire EEO");
            }
        } catch (error) {
            console.error(
                "An unexpected error occurred while retrieving the Onboarding Quick Hire EEO Self Identification.",
                error
            );
            throw error; // Rethrow the error or handle it appropriately
        }
    }

    public async updateOnboardingQuickHireEEO(employeeId: number, formData: OnboardingQuickHireEEO) {
        try {
            await this.axiosInstance.post(
                `employees/${employeeId}/formFieldValue`,
                formData
            )
            notifySuccess('Information updated.')
        } catch (error) {
            console.error(
                "An unexpected error occurred while retrieving the Onboarding Quick Hire EEO Self Identification.",
                error
            );
            notifyError('There was an error while updating information.')
            throw error; // Rethrow the error or handle it appropriately
        }
    }
}

export const onboardingQuickHireEEOApi = new OnboardingQuickHireEEOApi([
    AccessTokenRequestInterceptor,
    AccessTokenResponseInterceptor,
])