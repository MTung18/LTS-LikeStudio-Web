export class Department{
    id: number;
    departmentName: string;
    departmentFsNo: string;
    isActive: boolean;
    isDeleted: boolean;

    public constructor(init?: Partial<Department>) {
      Object.assign(this, init);
    }
}