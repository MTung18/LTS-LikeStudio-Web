export class BaseHQPersonPhone {
    public id: number;
    public phoneId: number;
    public personId: number;
    public phoneNumber: string;
    public phoneExtension: string;
    public isMain: boolean;
    public allowText: boolean;
    public phoneNumberType: number;
    public changeTrackingDate: Date;
  
    public constructor(init?: Partial<BaseHQPersonPhone>) {
      Object.assign(this, init);
    }
  }
  