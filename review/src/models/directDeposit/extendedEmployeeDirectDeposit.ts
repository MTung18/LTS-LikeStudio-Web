
import { EmployeeDirectDeposit } from '@/models/employees/employeeDirectDepositModel';
import { ExtendedUploadFileModel } from '../hqSuite/hqUploadFile';

export class ExtendedEmployeeDirectDeposit extends EmployeeDirectDeposit {
    file: ExtendedUploadFileModel;
    isNew: boolean;
    isValid: boolean;
    public constructor(init?: Partial<ExtendedEmployeeDirectDeposit>) {
        super();
        Object.assign(this, init);
    }
}