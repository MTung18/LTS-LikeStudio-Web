export interface Payroll {
  id: number;
  employeeId: number;
  namePayStub: string;
  payDate: string;
  payPeriod: string;
  availableDate: string;
  availableToEmployeeOnDate: string;
  updatedDate: string;
  filterPayDate?: string;
  filterPayPeriod?: string;
  filterAvailableToEmployeeOnDate?: string;
}

export interface updateAvailableDateToEmployee {
  availableToEmployeeOnDate: string;
  employeeId: number;
  payDate: string;
  year: number
}
