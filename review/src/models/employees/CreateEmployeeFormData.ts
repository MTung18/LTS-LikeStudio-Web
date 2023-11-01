import CreateEmployeeInput from "./CreateEmployeeInput";
import Honorific from "./Honorific"
import Employee from "./Employee"
import PhoneInput from "./PhoneInput";
import PermissionGroupLookup from '../settings/PermissionGroupLookup';
import PayrollStateTaxCode from "@/models/foundationIntegration/PayrollStateTaxCode";

export default class CreateEmployeeFormData {
    honorificSelected: Honorific;
    honorificTypeAhead: Honorific[];
    firstName: string;
    middleName: string;
    lastName: string;
    suffix: string;
    email: string;
    phone: PhoneInput;
    phoneNumber: string;
    startDate: Date;
    supervisorSelected?: Employee;
    supervisorTypeahead: Employee[];
    additionalSupervisorsSelected?: Employee[];
    additionalSupervisorsTypeahead: Employee[];
    securedAccess: boolean;
    workLocationsSelected: PayrollStateTaxCode[];
    workLocationsTypeahead: PayrollStateTaxCode[];
    permissionGroupSelected: PermissionGroupLookup;
    permissionGroupTypeahead: PermissionGroupLookup[];
    initialEmployeeStatusId: number;
    employmentStatusId: number;

    public toCreateEmployeeInput(): CreateEmployeeInput {
      const input: CreateEmployeeInput = new CreateEmployeeInput();

      input.honorificId = this.honorificSelected?.honorificId;
      input.firstName = this.firstName?.trim();
      input.middleName = this.middleName?.trim();
      input.lastName = this.lastName?.trim();
      input.suffix = this.suffix?.trim();
      input.email = this.email?.trim();
      input.phoneNumber = this.phone.phoneNumber ? this.phone.phoneNumber.replace(/[^\d]/g, '') : '';
      input.startDate = this.startDate;
      input.supervisorId = this.supervisorSelected?.id;
      input.additionalSupervisors = this.additionalSupervisorsSelected?.map(sup => sup.id);
      input.securedAccess = this.securedAccess;
      input.workLocations = this.workLocationsSelected?.map(wl => wl.id);
      input.permissionGroupId = this.permissionGroupSelected.id;
      input.initialEmployeeStatusId = this.initialEmployeeStatusId;
      input.employmentStatusId = this.employmentStatusId;

      return input
    }

    public constructor(init?: Partial<CreateEmployeeFormData>) {
      Object.assign(this, init);
      this.phone = new PhoneInput();
    }
}