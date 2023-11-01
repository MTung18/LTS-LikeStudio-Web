import EmployeeDetails from '@/models/employees/EmployeeDetails';
import { BaseHQPersonAddress } from './BaseHQ/BaseHQPersonAddress';
import Gender from './Gender';
import MaritalStatus from './MaritalStatus';
import Honorific from './Honorific';
import { MinorityCode } from '../foundationIntegration/MinorityCode';

export default class EmployeePersonalInfoInput  {
    public employeeId: number;
    public general?: EmployeePersonalInfoGeneralInput;       // must have permission WHQ_251_3138
    public eeo?: EmployeePersonalInfoEEOInput;               // must have permission WHQ_251_3139
    public sensitive?: EmployeePersonalInfoSensitiveInput;   // must have permission WHQ_251_3140
  
    public constructor(init?: Partial<EmployeePersonalInfoInput>) {
        Object.assign(this, init);
    }
}

export class EmployeePersonalInfoGeneralInput
{
    public honorificId: number;
    public firstName: string;
    public middleName: string;
    public lastName: string;
    public suffix: string;

    public email: string;
    public phoneNumber: string;
    public address: BaseHQPersonAddress;

    public genderId?: number;
    public maritalStatusId?: number;

    public dateOfBirth: Date;
    public ssn: string;

    public constructor(init?: Partial<EmployeePersonalInfoGeneralInput>) {
        Object.assign(this, init);
    }
}

export class EmployeePersonalInfoEEOInput {
    public isVeteran: boolean;
    public isNonResidentAlien: boolean;
    public isMultiracial: boolean;
    public isNonBinaryTransgender: boolean;
    public minorityCodeId?: number;

    public constructor(init?: Partial<EmployeePersonalInfoEEOInput>) {
        Object.assign(this, init);
    }
}

export class EmployeePersonalInfoSensitiveInput {
    public driversLicenseState: string;
    public driversLicenseNumber: string;
    public driversLicenseExpirationDate: Date;

    public constructor(init?: Partial<EmployeePersonalInfoSensitiveInput>) {
        Object.assign(this, init);
    }
}

export class EmployeePersonalInfoFormData {    
    public employeeId: number;
    public honorific: Honorific;
    public firstName: string;
    public middleName: string;
    public lastName: string;
    public suffix: string;
    public email: string;
    public phoneNumber: string;
    public address: BaseHQPersonAddress;
    public gender: Gender;
    public maritalStatus: MaritalStatus;
    public dateOfBirth: Date;
    public ssn: string;
    public isVeteran: boolean;
    public isNonResidentAlien: boolean;
    public isMultiracial: boolean;
    public isNonBinaryTransgender: boolean;
    public minorityCode?: MinorityCode;
    public driversLicenseState: string;
    public driversLicenseNumber: string;
    public driversLicenseExpirationDate: Date;

    public constructor(init?: Partial<EmployeePersonalInfoFormData | EmployeeDetails>) {
        if(init && (init instanceof EmployeeDetails))
        {
            this.employeeId = init.id;
            this.firstName = init.firstName;
            this.middleName = init.middleName;
            this.lastName = init.lastName;
            this.suffix = init.suffix;
            this.email = init.email;
            this.phoneNumber = init.mainPhone?.phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
            this.address = init.address ? init.address : new BaseHQPersonAddress();
            this.maritalStatus = init.maritalStatus;
            this.dateOfBirth = init.dateOfBirth;
            this.ssn = init.ssn?.replace(/-/g, "");
            this.isVeteran = init.isVeteran;
            this.isNonResidentAlien = init.isNonResidentAlien;
            this.isMultiracial = init.isMultiracial;
            this.isNonBinaryTransgender = init.isNonBinaryTransgender;
            this.minorityCode = init.minorityCode;
            this.driversLicenseState = init.driversLicenseState;
            this.driversLicenseNumber = init.driversLicenseNumber;
            this.driversLicenseExpirationDate = init.driversLicenseExpirationDate;
        }
        else
        {
            Object.assign(this, init);
        }
    }

    public toEmployeePersonalInfoInput(permissions? :Record<string, boolean>) : EmployeePersonalInfoInput
    {
        const employeePersonalInfoInput = new EmployeePersonalInfoInput();

        const employeePersonalInfoGeneralInput = new EmployeePersonalInfoGeneralInput({
            honorificId : this.honorific?.honorificId,
            firstName   : this.firstName,
            middleName  : this.middleName,
            lastName    : this.lastName,
            suffix      : this.suffix,
            email       : this.email,
            phoneNumber : this.phoneNumber.replace(/[^\d]/g, ''),
            address     : this.address,
            genderId    : this.gender?.id,
            maritalStatusId : this.maritalStatus?.maritalStatusId,
            dateOfBirth : this.dateOfBirth,
            ssn         : this.ssn,
        });

        employeePersonalInfoGeneralInput.address.state = 
            employeePersonalInfoGeneralInput.address.state.toUpperCase();

        const employeePersonalInfoEEOInput = new EmployeePersonalInfoEEOInput({
            isVeteran          : this.isVeteran,
            isNonResidentAlien : this.isNonResidentAlien,
            isMultiracial      : this.isMultiracial,
            isNonBinaryTransgender: this.isNonBinaryTransgender,
            minorityCodeId     : this.minorityCode?.id,
        });

        const employeePersonalInfoSensitiveInput = new EmployeePersonalInfoSensitiveInput({
            driversLicenseState : this.driversLicenseState.toUpperCase(),
            driversLicenseNumber : this.driversLicenseNumber,
            driversLicenseExpirationDate : this.driversLicenseExpirationDate,
        });

        employeePersonalInfoInput.employeeId = this.employeeId;

        if(permissions)
        {   
            employeePersonalInfoInput.general    = permissions["WHQ_251_3138"] ? employeePersonalInfoGeneralInput   : null;
            employeePersonalInfoInput.eeo        = permissions["WHQ_251_3139"] ? employeePersonalInfoEEOInput       : null;
            employeePersonalInfoInput.sensitive  = permissions["WHQ_251_3140"] ? employeePersonalInfoSensitiveInput : null;
        }   
        else
        {
            employeePersonalInfoInput.general    = employeePersonalInfoGeneralInput;
            employeePersonalInfoInput.eeo        = employeePersonalInfoEEOInput;
            employeePersonalInfoInput.sensitive  = employeePersonalInfoSensitiveInput;
        }

        return employeePersonalInfoInput;
    }
}
