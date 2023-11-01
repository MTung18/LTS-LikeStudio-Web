import AxiosBase from "./axiosBase";
import AccessTokenRequestInterceptor from "../interceptors/accessToken-request-interceptor";
import AccessTokenResponseInterceptor from "../interceptors/accessToken-response-interceptor";
import FormFieldModel from '../../models/onboarding/FormField';
import { getLocalAppsettings } from "../../helper/hqSuite/appSettingsHelper";
import { useAlerts } from '../../composables/useAlerts';

const { notifyError } = useAlerts();

export class OnboardingEmployeeWithholdingCertificateApi extends AxiosBase {
    constructor(interceptors: Array<any>) {
        const baseUrl = `${getLocalAppsettings().ClientSide.WorkforceEmployeeManagement}/api/v1/`;
        super(interceptors, baseUrl);
    }

    public async getOnboardingEmployeeWithholdingCertificate(employeeId: number, formId: number) {
        let onboardingEmployeeWithholdingCertificate: FormFieldModel | undefined;
        try {
            const response = await this.axiosInstance.get<FormFieldModel>(`employees/${employeeId}/formFieldValue?formId=${formId}`);
            if (response.data && response.status === 200) {
                onboardingEmployeeWithholdingCertificate = response.data;
            }
        } catch (error) {
            console.error(
                "An unexpected error occurred attempting to retrieve the Onboarding Employee Withholding Certificate",
                error
            )
            notifyError('There was an error while fetching employee withholding certificate')
            throw error;
        }
        return onboardingEmployeeWithholdingCertificate;
    }
}

export const onboardingEmployeeWithholdingCertificateApi = new OnboardingEmployeeWithholdingCertificateApi([
    AccessTokenRequestInterceptor,
    AccessTokenResponseInterceptor,
]);