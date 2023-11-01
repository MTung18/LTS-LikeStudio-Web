export class Address {
  public address1: string;
  public address2: string;
  public city: string;
  public state: string;
  public zip: string;
  public country: string;
  public addressType: string;
  public addressTypeId: number;
  public id: number;
  
  public constructor(init?: Partial<Address>) {
    Object.assign(this, init);
  }
}
