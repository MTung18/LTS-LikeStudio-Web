import { ActionType } from "@/enums/ActionType";
import { getLocalAppsettings } from "@/helper/hqSuite/appSettingsHelper";
import Contact from "@/models/employees/Contact";
import ContactInput from "@/models/employees/ContactInput";
import ContactMasterData from "@/models/employees/ContactMasterData";
import CreateEmployeeInput from "@/models/employees/CreateEmployeeInput";
import CreateEmployeeResult from "@/models/employees/CreateEmployeeResult";
import Employee from "@/models/employees/Employee";
import EmployeeCurrentLogin from "@/models/employees/EmployeeCurrentLogin";
import EmployeeDetails from "@/models/employees/EmployeeDetails";
import EmployeePersonalInfoInput from "@/models/employees/EmployeePersonalInfoInput";
import EmployeeDeduction from "@/models/employees/EmployeeDeduction";
import { MinorityCode } from "@/models/foundationIntegration/MinorityCode";
import { HttpStatusCode } from "axios";
import { MESSAGE } from "@/data/message";
import { useAlerts } from '@/composables/useAlerts';
const { notifyError } = useAlerts();
import { Employment } from '@/models/employees/Employment';
import Note from "@/models/employees/Note";
import PendingApproval from "@/models/employees/PendingApproval";
import PendingApprovalResult from "@/models/employees/PendingApprovalResult";
import AccessTokenRequestInterceptor from "../interceptors/accessToken-request-interceptor";
import AccessTokenResponseInterceptor from "../interceptors/accessToken-response-interceptor";
import AxiosBase from "./axiosBase";
import EmployeeRenderedDocumentInformation from "@/models/employees/EmployeeRenderedDocumentInformation";

export const baseUrlEmployeeApi = "employee";

export default class WhqEmployeesApi extends AxiosBase {
  constructor(interceptors: Array<any>) {
    const baseUrl = getLocalAppsettings().ClientSide.WorkforceManagement + "/v1";
    super(interceptors, baseUrl);
  }

  public async getEmployees(): Promise<Employee[]> {
    let employeeList: Employee[];

    try {
      const response = await this.PerformFetch<Employee[]>(baseUrlEmployeeApi);
      employeeList = response.map(employee => new Employee(employee));
    } catch (error) {
      console.error(this.errormessage(ActionType.Fetch), error);
    }
    return employeeList;
  }

  public async getEmployeesPendingApproval(): Promise<Employee[]> {
    let employeeList: Employee[];

    try {
      const response = await this.PerformFetch<Employee[]>(`${baseUrlEmployeeApi}/employeesPendingApproval`);
      employeeList = response.map(employee => new Employee(employee));
    } catch (error) {
      console.error(this.errormessage(ActionType.Fetch), error);
    }
    return employeeList;
  }

  public async getPendingApprovals(employeeId: number): Promise<PendingApproval[]> {
    let pendingApprovals: PendingApproval[] = []

    try {
      const response = await this.PerformFetch<PendingApproval[]>(`${baseUrlEmployeeApi}/${employeeId}/pendingApprovals`);
      pendingApprovals = response.map(employee => new PendingApproval(employee));
    } catch (error) {
      console.error(this.errormessage(ActionType.Fetch), error);
    }

    return pendingApprovals
  }

  public async submitApprovals(employeeId: number, data: PendingApprovalResult[]): Promise<boolean> {
    try {
      return await this.PerformPost<boolean>(`${baseUrlEmployeeApi}/${employeeId}/submitApprovals`, data, true)
    } catch (error) {
      console.error("An error occurred attempting to submit the approvals", error)
    }
  }

  public async getEmployeeContacts(employeeId: number): Promise<Contact[]> {
    let contactList: Contact[];
    try {
      const url = `${baseUrlEmployeeApi}/${employeeId}/contact`;
      const response = await this.PerformFetch<Contact[]>(url);
      contactList = response.map(
        contact => new Contact({ ...contact, birthDate: contact.birthDate ? new Date(contact.birthDate) : undefined }),
      );
    } catch (error) {
      console.error(this.errormessage(ActionType.Fetch), error);
    }
    return contactList;
  }

  public async getEmployeeContactSsn(employeeContactId: string | number): Promise<number> {

    try {
      const url = `${baseUrlEmployeeApi}/contact/${employeeContactId}/ssn`;
      return await this.PerformFetch<number>(url);
    } catch (error) {
      if (error?.response?.status === 404) {
        console.info(`No SSN found for employee contact with id ${employeeContactId}`);
      }
      else {
        console.error(this.errormessage(ActionType.Fetch), error);
      }
    }
  }

  public async getEmployeeSsn(employeeId: string | number): Promise<string> {
    try {
      const res = await this.axiosInstance.get(`Employee/${employeeId}/ssn`);
      if (res.data && res.status === 200) {
        return res.data as string;
      } else {
        throw new Error('Failed to retrieve employee SSN');
      }
    } catch (error) {
      console.error('Error retrieving employee SSN:', error);
      throw error;
    }
  }

  public async getEmployeeDetails(id: string | number): Promise<EmployeeDetails> {
    try {
      const url = `${baseUrlEmployeeApi}/${id}/details`;
      return await this.PerformFetch<EmployeeDetails>(url);
    } catch (error) {
      console.error(this.errormessage(ActionType.Fetch), error);
      return Promise.reject(error);
    }
  }

  public async updateEmployeeContactAsync(contact: Contact): Promise<boolean> {
    try {
      const response = await this.axiosInstance.put<boolean>(
        `${baseUrlEmployeeApi}/contact`,
        contact
      );

      return response && response.status === 200 ? true : false;
    } catch (error) {
      console.error(
        "An unexpected error occured attempting to update the employee contact.",
        error
      );
    }
  }

  public async checkEmployeeContactCanBeDeletedAsync(employeeContactId: number): Promise<boolean> {
    try {
      const url = `${baseUrlEmployeeApi}/contact/${employeeContactId}/canBeDeleted`;
      return await this.PerformFetch<boolean>(url);
    } catch (error) {
      console.error(this.errormessage(ActionType.Fetch), error);
    }
  }

  public async deleteEmployeeContactAsync(
    employeeContactId: number
  ): Promise<boolean> {
    try {
      const response = await this.axiosInstance.delete<boolean>(
        `${baseUrlEmployeeApi}/contact/${employeeContactId}`
      );

      return response && response.status === 200 ? true : false;
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to delete the employee contact details..",
        error
      );
    }
  }

  public async createEmployeeAsync(employee: CreateEmployeeInput): Promise<CreateEmployeeResult> {
    const response = await this.PerformPost<CreateEmployeeResult>(`${baseUrlEmployeeApi}`, employee, false);

    return response as CreateEmployeeResult;
  }

  public async getContactsMasterData(): Promise<ContactMasterData> {
    let masterData: ContactMasterData;
    try {
      const url = `${baseUrlEmployeeApi}/getContactMasterData`;
      return await this.PerformFetch<ContactMasterData>(url);
    } catch (error) {
      console.error(this.errormessage(ActionType.Fetch), error);
    }
    return masterData;
  }

  public async addNewContact(contactInput: ContactInput): Promise<boolean> {
    let contactCreated: boolean;
    try {
      const response = await this.axiosInstance.post<boolean>(`${baseUrlEmployeeApi}/contact`, contactInput
      );
      if (
        response &&
        response.status === 200
      ) {
        contactCreated = response?.data;
      } else {
        throw new Error("Failed to parse Employee contact");
      }
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to save the Employee contact.",
        error
      );
    }
    return contactCreated;
  }

  public async updatePrimaryContactAsync(employeeContactId: number): Promise<boolean> {
    let primaryContactedUpdated = false;
    try {
      const response = await this.axiosInstance.put<boolean>(`${baseUrlEmployeeApi}/primaryContact?contactId=${employeeContactId}`);

      primaryContactedUpdated = response && response.data ? true : false;
    } catch (error) {
      console.error("An unexpected error occurred attempting to update the primary contact.", error);
    }
    return primaryContactedUpdated;
  }

  public async getEmployeeStatusListAsync(): Promise<Object> {
    const url = `${baseUrlEmployeeApi}/employeeStatusesByMonth`;
    try {
      const result: any = await this.PerformFetch<Object>(url);
      return result;
    } catch (error) {
      console.error("An unexpected error occurred attempting to get the employee status list.",
        error
      );
    }
  }

  public async getEmployeeDeductionsListAsync(employeeId: number): Promise<EmployeeDeduction[]> {
    let employeeDeductionData: EmployeeDeduction[] = [];
    const url = `${baseUrlEmployeeApi}/${employeeId}/deductions`;
    try {
      employeeDeductionData = await this.PerformFetch<EmployeeDeduction[]>(url);

    } catch (error) {
      console.error("An unexpected error occurred attempting to get the employee deductions list.",
        error
      );
      return Promise.reject(error);
    }
    return employeeDeductionData;
  }

  //#region Note
  public async getEmployeeNotesAsync(employeeId: number): Promise<Note[]> {
    let notes: Note[];
    try {
      const employeeNotes = await this.PerformFetch<Note[]>(`${baseUrlEmployeeApi}/${employeeId}/notes?IsDeleted=false`);
      notes = employeeNotes;
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to retrieve the employee notes.",
        error
      );
    }
    return notes;
  }

  public async deleteEmployeeNoteAsync(employeeNoteId: number): Promise<boolean> {
    try {
      return await this.PerformDelete<boolean>(`${baseUrlEmployeeApi}/notes/${employeeNoteId}`);
    } catch (error) {
      console.error("An unexpected error occurred attempting to delete the employee note", error);
    }
  }

  public async createEmployeeNoteAsync(employeeId: number, data: Note): Promise<boolean> {
    try {
      return await this.PerformPost<boolean>(`${baseUrlEmployeeApi}/${employeeId}/notes`, data);
    } catch (error) {
      console.error("An unexpected error occurred attempting to create the employee note", error);
    }
  }

  public async getEmployeeCurrentLogin(): Promise<EmployeeCurrentLogin> {
    let employeeCurrentLogin: EmployeeCurrentLogin;
    try {
      employeeCurrentLogin = await this.PerformFetch<EmployeeCurrentLogin>(baseUrlEmployeeApi + "/me/ids");
    } catch (error) {
      console.error("An unexpected error occurred attempting to retrieve the currently logged in employee info");
    }
    return employeeCurrentLogin;
  }
  //#endregion Note

  public async getEmployment(employeeId: string | number): Promise<Employment> {
    let employmentInfor: Employment;
    try {
      const url = `${baseUrlEmployeeApi}/${employeeId}/employmentInformation`;
      employmentInfor = await this.PerformFetch<Employment>(url);
    } catch (error) {
      console.error(this.errormessage(ActionType.Fetch), error);
      throw error;
    }
    return employmentInfor;
  }

  public async updateEmployeePersonalInformationAsync(employeePersonalInfoInput: EmployeePersonalInfoInput): Promise<EmployeeDetails> {
    try {
      const employeeId = employeePersonalInfoInput.employeeId;

      const response = await this.axiosInstance.put<EmployeeDetails>(
        `${baseUrlEmployeeApi}/${employeeId}/personalInfo`,
        employeePersonalInfoInput
      );

      return response.data;
    } catch (error) {
      console.error(
        "An unexpected error occured attempting to update the employee personal information.",
        error
      );
      if (error.response.data.status === HttpStatusCode.Conflict && error.response.data.detail === MESSAGE.HR_APPROVAL.UPDATE_ERROR_DETAIL_RESPONSE) {
        notifyError(MESSAGE.HR_APPROVAL.UPDATE_ERROR);
      }
      return Promise.reject(error);
    }
  }

  public async getEmployeeMinorityCodeList(): Promise<MinorityCode[]> {
    try {
      const response = await this.axiosInstance.get<MinorityCode[]>(`foundationIntegration/minorityCodes?IsSynced=true`);
      return response.data;
    } catch (error) {
      console.error(
        "An unexpected error occured attempting to get employee minority code list.",
        error
      );
      return Promise.reject(error);
    }
  }

  public async updateEmployment(employment: Partial<Employment>): Promise<boolean> {
    try {
      const response = await this.axiosInstance.put<boolean>(`${baseUrlEmployeeApi}/${employment.employeeId}/employmentInformation`, employment);
      return response && response.status === 200 ? true : false;
    } catch (error) {
      console.error("An unexpected error occured attempting to update the employment.", error);
      if (error.response.data.status === HttpStatusCode.Conflict && error.response.data.detail === MESSAGE.HR_APPROVAL.UPDATE_ERROR_DETAIL_RESPONSE) {
        notifyError(MESSAGE.HR_APPROVAL.UPDATE_ERROR);
      }
      throw error;
    }
  }

  public async getEmployeeStatus(employeeId: number | string): Promise<number> {
    let employeeStatus: number;
    try {
      const response = await this.axiosInstance.get<number>(`${baseUrlEmployeeApi}/${employeeId}/status`);
      if (response && response.status === 200) {
        employeeStatus = response.data;
      }
      return employeeStatus
    } catch (error) {
      console.error("An unexpected error occured attempting to get employee status.", error);
      throw error;
    }
  }

  public async updateEmployeeStatus(employeeId: number | string, statusId: number | string): Promise<boolean> {
    try {
      const response = await this.axiosInstance.put<boolean>(`${baseUrlEmployeeApi}/${employeeId}/status?statusId=${statusId}`, statusId);
      return response && response.status === 200 ? true : false
    } catch (error) {
      console.error("An unexpected error occured attempting to update the employee status.", error);
      throw error;
    }
  }

  public async checkHRApprovalCategoryEmployeePendingFoundationStatusExistsAsync(employeeId: number): Promise<boolean> {
    try {
      const response = await this.axiosInstance.get<boolean>(`${baseUrlEmployeeApi}/${employeeId}/hasPendingFoundationStatus`);
      return response.data;
    } catch (error) {
      console.error("An unexpected error occured attempting to check if Employee has Pending Foundation status.", error);
      throw error;
    }
  }

  public async getEmployeeW4RenderedDocumentInformation(employeeId: number | string): Promise<EmployeeRenderedDocumentInformation[]> {
    let employeeW4RenderedDocumentInformationList: EmployeeRenderedDocumentInformation[];
    try {
      const url = `${baseUrlEmployeeApi}/${employeeId}/employeeW4RenderedDocument`;
      const response = await this.axiosInstance.get<EmployeeRenderedDocumentInformation[]>(url);
      if (response && response.status === 200) {
        employeeW4RenderedDocumentInformationList = response.data;
        return employeeW4RenderedDocumentInformationList;
      }
    } catch (error) {
      console.error("An unexpected error occured attempting to get Employee Rendered Document Information for W4 tab.", error);
      throw error;
    }
    return employeeW4RenderedDocumentInformationList;
  }

  public async getEmployeeFederalRenderedDocumentInformation(employeeId: number | string): Promise<EmployeeRenderedDocumentInformation[]> {
    let employeeFederalRenderedDocumentInformationList: EmployeeRenderedDocumentInformation[];
    try {
      const url = `${baseUrlEmployeeApi}/${employeeId}/employeeFederalRenderedDocument`;
      const response = await this.axiosInstance.get<EmployeeRenderedDocumentInformation[]>(url);
      if (response && response.status === 200) {
        employeeFederalRenderedDocumentInformationList = response.data;
        return employeeFederalRenderedDocumentInformationList;
      }
    } catch (error) {
      console.error("An unexpected error occured attempting to get Employee Rendered Document Information for Federal tab.", error);
      throw error;
    }
    return employeeFederalRenderedDocumentInformationList;
  }
}

export const whqEmployeesApi = new WhqEmployeesApi([
  AccessTokenRequestInterceptor,
  AccessTokenResponseInterceptor,
]);
