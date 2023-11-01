import { GoogleAPIAddress } from './../GoogleAPIAddress';
import Contact from "./Contact";
import EmailAddress from "./EmailAddress";
import PhoneInput from "./PhoneInput";
import { dateForFSInput } from '@/functions/DateUtilityFunctions';
import NamePrefix from '@/models/employees/NamePrefix';
import Gender from '@/models/employees/Gender';
import RelationshipType from '@/models/employees/RelationshipType';
import { EmailType } from '@/enums/EmailType';
import { PhoneType } from '@/enums/PhoneType';
import { AddressType } from '@/enums/AddressType';
import { Address } from './Address';

export default class ContactInput extends Contact {
    employeeId: number;
    relationTypeId: number;
    phone: PhoneInput;
    email: EmailAddress;
    prefixId: number | null;
}

export class ContactInputFormData extends ContactInput {

    public contactAddress: GoogleAPIAddress;
    public prefixDropdown: NamePrefix;
    public relationshipDropdown: RelationshipType;
    public genderDropdown: Gender;
    public socialSecurityNumber: string;

    public constructor(init?: Partial<ContactInput>) {
        super();
        
        if(init)
        {
            this.id = init.id;
            this.isBeneficiary = init.isBeneficiary;
            this.isEmergencyContact = init.isEmergencyContact;
            this.isDependent = init.isDependent;
            this.isPrimaryContact = init.isPrimaryContact;
            this.prefixId = init.namePrefixId
            this.firstName = init.firstName;
            this.middleName = init.middleName;
            this.lastName = init.lastName;
            this.suffix = init.suffix;
            this.phoneId = init.phoneId;
            this.phoneNumber = init.phoneNumber?.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
            this.emailId = init.emailId;
            this.relationshipId = init.relationshipId;
            this.genderId = init.genderId;
            this.emailAddress = init.emailAddress;

            if (init.birthDate) {
                this.birthDate = dateForFSInput(init.birthDate);
            }
            this.ssn = init.ssn;
            this.address = init.address;
            // Binding dropdown values
            this.phone = new PhoneInput();

            if (init.phoneId) {
                this.phone.id = init.phoneId;
                this.phone.phoneNumber = init.phoneNumber;
            }

            this.email = new EmailAddress();
            if (init.emailId) {
                this.email.id = init.emailId;
                this.email.email = init.emailAddress;
            }

            this.contactAddress = new GoogleAPIAddress();
            if (init.address && init.address.id) {
                this.contactAddress.address1 = init.address.address1;
                this.contactAddress.address2 = init.address.address2;
                this.contactAddress.city = init.address.city;
                this.contactAddress.state_Province = init.address.state;
                this.contactAddress.zip_PostalCode = init.address.zip;
            }

            this.prefixDropdown = new NamePrefix({ id: init.namePrefixId, name: init.prefix });
            this.relationshipDropdown = new RelationshipType({ id: init.relationshipId, name: init.relation });
            this.genderDropdown = new Gender({ id: init.genderId, name: init.gender });
        }  
        else
        {
            this.email = new EmailAddress();
            this.contactAddress = new GoogleAPIAddress();
            this.phone = new PhoneInput();
        }      
    }

    public toContactInput(isEdit?:boolean) : ContactInput
    {
        const contactInput = new ContactInput();
        
        contactInput.id = this.id;
        contactInput.employeeId = this.employeeId;
        contactInput.isBeneficiary = this.isBeneficiary || false;
        contactInput.isEmergencyContact = this.isEmergencyContact || false;
        contactInput.isDependent = this.isDependent || false;;
        contactInput.isPrimaryContact = this.isPrimaryContact|| false;
        contactInput.firstName = this.firstName;
        contactInput.middleName = this.middleName;
        contactInput.lastName = this.lastName;
        contactInput.suffix = this.suffix;
        contactInput.phoneId = this.phoneId;
        contactInput.phoneNumber = this.phoneNumber;
        contactInput.emailId = this.emailId;
        contactInput.relationshipId = this.relationshipId;
        contactInput.birthDate = this.birthDate;

        if (this.prefixDropdown) 
        { 
            contactInput.prefixId = this.prefixDropdown.id; 
        }
        if (this.relationshipDropdown) 
        { 
            contactInput.relationTypeId = this.relationshipDropdown.id; 
        }
        if (this.genderDropdown) 
        { 
            contactInput.genderId = this.genderDropdown.id ;
        }
        
        if(this.emailAddress && this.emailAddress !== "")
        {
            contactInput.email = new EmailAddress();
            contactInput.email.email = this.emailAddress;
            contactInput.email.emailAddressTypeId = EmailType.Main;
            contactInput.email.id = isEdit === true ? this.email.id : 0;
        }
        else
        {
            contactInput.email = null;
        }

        if(this.phoneNumber && this.phoneNumber !== "")
        {
            contactInput.phone = new PhoneInput();
            contactInput.phone.phoneNumber = this.phoneNumber?.replace(/[^\d]/g, '');
            contactInput.phone.phoneTypeId = PhoneType.Main;
            contactInput.phone.id = isEdit === true ? this.phone.id : 0;
        }
        else
        {
            contactInput.phone = null;
        }

        if(this.socialSecurityNumber && this.socialSecurityNumber !== "")
        {
            contactInput.ssn = Number.parseInt(this.socialSecurityNumber.replaceAll('-', ''));
        }

        if (this.contactAddress.address1 || this.contactAddress.address2
            || this.contactAddress.city || this.contactAddress.state_Province || this.contactAddress.zip_PostalCode) {
    
            contactInput.address = new Address();

            contactInput.address.address1 = this.contactAddress.address1
            contactInput.address.address2 = this.contactAddress.address2;
            contactInput.address.city = this.contactAddress.city;
            contactInput.address.state = this.contactAddress.state_Province;
            contactInput.address.zip = this.contactAddress.zip_PostalCode;
            contactInput.address.addressTypeId = AddressType.Main;
            contactInput.address.id = isEdit === true ? this.address?.id : 0;
        }
        else
        {
            contactInput.address = null;
        }

        return contactInput;
    }       
}