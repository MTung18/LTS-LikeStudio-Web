export class Request {
  public id: number;
  public employeeId: number;
  public fullName: string;
  public supervisorId: number;
  public supervisorFullName: string; 
  public totalHours: number;
  public note: string;
  public planTypeId: number;
  public planTypeName: string;
  public status: number;
  public rejectReason: string;
  public currentBalance: number;
  public dateFilter: string;
  public requestDates: [{
    date: string,
    fromTime: string,
    toTime: string
  }]

  public constructor(init?: Partial<Request>) {
    Object.assign(this, init);
  }
}

export type RequestDate = {
  date: string,
  fromTime: string,
  toTime: string
}