export default interface PayrollHistory {
  employeeInfomation: Partial<EmployeeInfomation[]>;
  currentHoursEarnings: PayrollHistoryDataObject[];
  yearToDateHoursEarnings: PayrollHistoryDataObject[];
  taxesDeductions: TaxesDeductions[];
  finges: PayrollHistoryDataObject[];
  netPay: NetPay;
}

interface EmployeeInfomation {
  CompanyName: string;
  AddressLine1: string;
  AddressLine2: string;
  State: string;
  PhoneNumber: string;
  EarningsStatement: string;
  Check: string;
  PayDate: string;
  PayPeriod: string;
  EmployeeName: string;
  EmployeeId: string;
  Address: string;
}

interface TaxesDeductions {
  federal: PayrollHistoryDataObject[];
  state: PayrollHistoryDataObject[];
  localTaxesDeductions: PayrollHistoryDataObject[];
}

interface NetPay {
  name: string;
  actuallyReceived: string;
}

interface PayrollHistoryDataObject {
  description: string;
  hours: number | string;
  payRate: number | string;
  earnings: number | string;
  curent: number | string;
  ytd: number | string;
}

export default interface FsPaystubDetail {
  payStubGeneral: PaystubGeneral
  fedTaxList: TaxListDescription[]
  stateTaxList: TaxListDescription[]
  localTaxList: TaxListDescription[]
  miscDeductionsList: TaxListDescription[]
  unionDeductionsList: TaxListDescription[]
  directDepositDistList: TaxListDescription[]
  earningsList: TaxListDescription[]
  hoursList: TaxListDescription[]
  fringesList: TaxListDescription[]
  paycheckCurrentEarningsList: PaycheckCurrentEarningsList[]
  paycheckYTDEarningsList: PaycheckYTDEarningsList[]
  paycheckSubTotalsList: PaycheckSubTotalsList
  activeFiltersJSON: string
}

interface PaystubGeneral {
  checkDate: string
  periodStarts: string
  periodEnds: string
  checkNo: string
  timecardXref: number
  checkAmount: number
  grossPay: number
  totalDeductions: number
  fringes: number
  unionDeductions: number
  companyName: string
  companyAddress: string
  companyAddressLocation: string
  address: string
  addressLocation: string
  fullName: string
  empNo: string
  checkDateString: string
  periodStartsString: string
  periodEndsString: string
  companyPhone: string
}

interface PaycheckCurrentEarningsList {
  earnTypeNo: string
  earnTypeDescription: string
  earnTypeFlag: string
  quantityType: string
  hours: number
  payRate: number
  amount: number
  payRateDisplay: string
}

interface PaycheckYTDEarningsList {
  earnTypeId: string
  earnType: string
  yTDHours: number
  yTDAmount: number
}

interface PaycheckSubTotalsList {
  hoursCurrent: number
  hoursYTD: number
  earningsCurrent: number
  earningsYTD: number
  fringesCurrent: number
  fringesYTD: number
  miscDeductionsCurrent: number
  miscDeductionsYTD: number
  unionDeductionsCurrent: number
  unionDeductionsYTD: number
  localCurrent: number
  localYTD: number
  stateCurrent: number
  stateYTD: number
  fedCurrent: number
  fedYTD: number
  taxesDeductionsCurrent: number
  taxesDeductionsYTD: number
}

interface TaxListDescription {
  description: string
  shortDesc: string
  currentVal: number
  current401k: number
  ytdVal: number
  yTD401k: number
  taxable: string
  displayDescription: string
  bankAccountNo: string
  bankAccountType: string
  amount: number
}