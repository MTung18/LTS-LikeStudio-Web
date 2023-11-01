export class Shift {
    id: number;
    shiftFsNo: string;
    shiftName: string;
    isActive: boolean;
    isDeleted: boolean;
  
    public constructor(init?: Partial<Shift>) {
      Object.assign(this, init);
    }
  }