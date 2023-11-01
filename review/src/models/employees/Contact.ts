import { Address } from "./Address";

export default class Contact {
  public id: number;
  public firstName: string;
  public middleName?: string;
  public lastName: string;
  public relation: string;
  public relationshipId: number;
  public namePrefixId?: number;
  public prefix?: string;
  public phoneId: number;
  public phoneNumber: string;
  public phoneExtension: string;
  public suffix: string;
  public emailAddress?: string;
  public emailId?: number;
  public gender?: string;
  public genderId?: number;
  public birthDate?: string | Date;
  public ssn?: number;
  public address?: Address;
  public isEmergencyContact: boolean;
  public isDependent: boolean;
  public isBeneficiary: boolean;
  public isPrimaryContact: boolean;

  public constructor(init?: Partial<Contact>) {
    Object.assign(this, init);
  }
}
