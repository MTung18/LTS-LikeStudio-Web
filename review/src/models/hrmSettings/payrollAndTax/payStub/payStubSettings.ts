import { PayStubShowSectionT } from "@/models/hrmSettings/payrollAndTax/payStub/showSections";
import { PayStubDateT } from "@/models/hrmSettings/payrollAndTax/payStub/payStubDate";

export class payStubSettings {
  public id: number;
  public payStub: PayStubDateT[];
  public showSections: PayStubShowSectionT;

  public constructor(init?: Partial<payStubSettings>) {
    Object.assign(this, init);
  }
}
