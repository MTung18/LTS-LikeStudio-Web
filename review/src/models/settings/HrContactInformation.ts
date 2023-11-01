export class HrContactInformation {
  public hrContactEmail: string;
  public hrContactPhoneNumber: string;

  public constructor(init?: Partial<HrContactInformation>) {
    Object.assign(this, init);
  }
}