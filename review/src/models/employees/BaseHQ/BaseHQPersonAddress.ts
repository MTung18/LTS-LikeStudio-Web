export class BaseHQPersonAddress {
    public id: number;
    public addressId: number;
    public personId: number;
    public address1: string;
    public address2: string;
    public city: string;
    public state: string;
    public zip: string;
    public country: string;
    public personAddressType: number;
    public changeTrackingDate: Date;
  
    public constructor(init?: Partial<BaseHQPersonAddress>) {
      Object.assign(this, init);
    }
  }
  