import DropdownOption from '../DropdownOptions';
import { LocalTaxCode } from '../foundationIntegration/LocalTaxCode';
import PayrollStateTaxCode from '../foundationIntegration/PayrollStateTaxCode';
import { TaxGroup } from '../foundationIntegration/TaxGroup';

export class FederalFilingStatus {
  id: number;
  federalFilingStatusDescription: string;
}
export class StateFilingStatus {
  id: number;
  stateFilingStatusDescription: string;
}

export class PayrollTaxOverride {
  id: number;
  payrollTaxOverrideDescription: string;
}
export class PayrollTaxAddOn {
  id: number;
  payrollTaxAddOnDescription: string;
}

export class EmployeePayrollFederalTaxDetail {
  id: number;
  employeeId: number;
  useXxxxOrLaterW4Version: boolean;
  federalFilingStatusId?: number;
  federalFilingStatus?: {
    id: number;
    federalFilingStatusName: string;
    federalFilingStatusDescription: string;
  };
  hasCheckboxWithholding: boolean;
  claimDependents: number;
  otherIncome: number;
  deductions: number;
  extraWithholding: number;
  payrollTaxOverrideId?: number;
  payrollTaxOverride?: PayrollTaxOverride;
  federalW4?: string;
  exemptions: number;
  amount: number;
  percent: number;
  isResident: boolean;
  resident?: DropdownOption;
  payrollTaxAddOnId?: number;
  payrollTaxAddOn?: PayrollTaxAddOn;
}

export class EmployeePayrollStateTaxCodeDetails {
  id: number;
  employeeId: number;
  isNew?: boolean;
  payrollStateTaxCodeId?: number;
  payrollStateTaxCode?: PayrollStateTaxCode;
  stateFilingStatusId?: number;
  stateFilingStatus?: {
    id: number;
    stateFilingStatusName: string;
    stateFilingStatusDescription: string;
  };
  exemptions: number;
  amount: number;
  percent: number;
  payrollTaxOverrideId?: number;
  payrollTaxOverride?: PayrollTaxOverride;
  payrollTaxAddOnId?: number;
  payrollTaxAddOn?: PayrollTaxAddOn;
  isResident: boolean;
  resident?: DropdownOption;
  isStateLocalMakeup: boolean;
  stateLocalMakeup?: DropdownOption;
  stateW4?: string;
}

export class EmployeePayrollLocalTaxCodeDetails {
  id: number;
  employeeId: number;
  isNew?: boolean;
  payrollStateTaxCode?: PayrollStateTaxCode;
  payrollLocalTaxCodeId?: number;
  payrollLocalTaxCode?: LocalTaxCode;
  payrollLocalTaxCodeOptions?: LocalTaxCode[];
  exemptions: number;
  amount: number;
  percent: number;
  payrollTaxOverrideId?: number;
  payrollTaxOverride?: PayrollTaxOverride;
  payrollTaxAddOnId?: number;
  payrollTaxAddOn?: PayrollTaxAddOn;
  isResident: boolean;
  resident?: DropdownOption;
}

export class EmployeeTaxInformation {
  employeeId: number;
  employeePayrollFederalTaxDetail: EmployeePayrollFederalTaxDetail;
  employeePayrollStateTaxCodeDetails: EmployeePayrollStateTaxCodeDetails[];
  employeePayrollLocalTaxCodeDetails: EmployeePayrollLocalTaxCodeDetails[];
  isResidenceTax?: boolean;
  payrollLocalTaxGroup: TaxGroup;
}
