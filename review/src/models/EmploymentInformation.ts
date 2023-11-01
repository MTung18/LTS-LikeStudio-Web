import CurrentOnboards from "./CurrentOnboards";

export default class EmploymentInformation {
  isFormDone: boolean;
  hiredDate: string;
  startDate: string;
  employmentStatus: EmploymentStatusT;
  jobTitle: JobTitleT;
  department: DepartmentT;
  reportingManager: ManagerT;
  additionalManager: Array<ManagerT>;
  stateOfHire: StateOfHireT;
  union: UnionT;
  trade: TradeT;
  acaExempt: boolean;
  oshaLevel: string;
  oshaCertificationNumber: string;
  oshaTradeLicense: string;
  workerCompState: WorkersCompStateT;
  workerCompClassNumber: WorkersCompClassT;
  corporateOfficer: boolean;
  costCodeNumber: CostCodeT;
  generalLiabilityState: GeneralLiabilityStateT;
  generalLiabilityClass: GeneralLiabilityClassT;
  ownerOperator: boolean;
}

export class EmploymentStatusT {
  text: string;
  value: string;
}

export class JobTitleT {
  id: number;
  name: string;
}

export class DepartmentT {
  id: number;
  departmentName: string;
  isActive: boolean;
  departmentFsNo: string;
  isDeleted: boolean;
}

export class TradeT {
  id: number;
  tradeName: string;
  isActive: boolean;
  tradeFsNo: string;
  isDeleted: boolean;
}

export class UnionT {
  id: number;
  unionName: string;
  isActive: boolean;
  unionFsNo: string;
  isDeleted: boolean;
}

export class CostCodeT {
  id: number;
  costCodeName: string;
  isActive: boolean;
  costCodeFsNo: string;
  isDeleted: boolean;
}

export class GeneralLiabilityStateT {
  id: number;
  generalLiabilityStateName: string;
  isActive: boolean;
  generalLiabilityStateFsNo: string;
  isDeleted: boolean;
}

export class GeneralLiabilityClassT {
  id: number;
  generalLiabilityClassName: string;
  isActive: boolean;
  generalLiabilityClassFsNo: string;
  generalLiabilityStateId: number;
  isDeleted: boolean;
  displayName: string;
}

export class WorkersCompClassT {
  workersCompStateAbbreviation: string;
  workersCompStateId: number;
  id: number;
  workersCompClassName: string;
  isActive: boolean;
  workersCompClassFsNo: string;
  isDeleted: boolean;
  displayName: string;
}

export class WorkersCompStateT {
  id: number;
  workersCompStateName: string;
  isActive: boolean;
  workersCompStateFsNo: string;
  isDeleted: boolean;
}

export class ManagerT extends CurrentOnboards {
  jobTittle: string;
}

export class StateOfHireT {
  id: number;
  payrollStateTaxCodeName: string;
  isActive: boolean;
  payrollStateTaxCodeFsNo: string;
  isDeleted: boolean;
}
