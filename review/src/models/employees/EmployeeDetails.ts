import { BaseHQPersonAddress } from './BaseHQ/BaseHQPersonAddress';
import { BaseHQPersonPhone } from "./BaseHQ/BaseHQPersonPhone";
import { MinorityCode } from "../foundationIntegration/MinorityCode"
import Gender from './Gender';
import MaritalStatus from './MaritalStatus';

export default class EmployeeDetails {
    public id: number;
    public honorificId: number;
    public fullName: string;
    public firstName: string;
    public lastName: string;
    public middleName: string;
    public suffix: string;
    public gender: Gender;
    public genderId: number;
    public email: string;
    public ssn: string;
    public dateOfBirth: Date;
    public maritalStatus: MaritalStatus;
    public terminationDate: Date;
    public terminationReason: string;
    public jobTitle: string;
    public mainPhone: BaseHQPersonPhone;
    public address: BaseHQPersonAddress;
    public employeeStatusId?: number;
    public isVeteran: boolean;
    public isNonResidentAlien: boolean;
    public isMultiracial: boolean;
    public minorityCode: MinorityCode;
    public minorityCodeId: number;
    public isNonBinaryTransgender: boolean;
    public driversLicenseState: string;
    public driversLicenseNumber: string;
    public driversLicenseExpirationDate: Date;

    public constructor(init?: Partial<EmployeeDetails>) {
        Object.assign(this, init);
    }
}
