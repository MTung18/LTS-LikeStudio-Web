# Edit Employee Personal Info

## Endpoint
`PUT /v{version}/Employees/{employeeId}/personalInfo`

## Originating User Story
[#24420: Edit Personal Tab](https://dev.azure.com/fsllc/Portfolio/_workitems/edit/24420/)

## Description
This endpoint accepts a payload describing changes to Employee personal data for use in the WorkforceHQ Human Resource Management (HRM) and Employee Self Service (ESS) systems.

The data in the payload must be distributed to two different systems:
- The BaseHQ[^1] database that acts as a central location in HQ Suite for all shared contact data
- The WorkforceHQ database that serves application-specific data to HRM and ESS

[^1]: _At time of writing, the BaseHQ database and API are not complete, and this data lives in the ProjectHQ database with access via the PHQ Projects API._ 

The above two functions will be handled internally in the WorkforceHQ API. First, WHQ API will call the BaseHQ API and update the Employee's Person record, identified by `PHQPersonId`, with the supplied contact data from the initial request. Upon successful update of the Person record, WHQ API will update the Employee record in the WHQ database via its direct database connection.

When the workflow is complete, the endpoint will return a an `EmployeeDetails` object suitable for binding to the Employee Personal Info page in the HRM app. 

## Flow Description

On receipt of a Create User request to the POST Employee endpoint, the WHQ API executes the following steps:

1. Validate the payload.
2. Call the BaseHQ API's GET Person endpoint, passing the `PHQPersonId` as a query parameter, and examine the response:
    1. (Response 200) Read the payload into memory as a `Person` integration object, and modify it with the desired changes.
    2. (Response 404) Error: the Person record should exist.
3. Update the BaseHQ Person record by calling the BaseHQ PUT person endpoint.
4. Update the `Employee` object in the WorkforceHQ database's Employee table with any changes indicated in the originating request.
5. Return the updated Employee data, mapped as an `EmployeeDetails` object, to the front-end.

## Request Model

```typescript
public class EmployeePersonalInfoInput {
    public employeeId: number;
    public general?: EmployeePersonalInfoGeneralInput,      // must have permission WHQ_251_3138
    public eeo?: EmployeePersonalInfoEEOInput,              // must have permission WHQ_251_3139
    public sensitive?: EmployeePersonalInfoSensitiveInput   // must have permission WHQ_251_3140
}

public class EmployeePersonalInfoGeneralInput
{
    public honorificId: number; // called Prefix on Update Personal Info page
    public firstName: string;
    public middleName: string;
    public lastName: string;
    public suffix: string;

    public email: string;
    public phoneNumber: string;
    public address: Address;

    public genderId?: number;
    public maritalStatusId?: number;

    public dateOfBirth: Date;
    public ssn: string;
}

public class EmployeePersonalInfoEEOInput {
    public isVeteran: boolean;
    public isNonResidentAlien: boolean;
    public isMultiracial: boolean;
    public isNonBinaryTransgender: boolean;
    public minorityCodeId?: number;
}

public class EmployeePersonalInfoSensitiveInput {
    public driversLicenseState: string;
    public driversLicenseNumber: string;
    public driversLicenseExpirationDate: Date;
}
```

## Sample Request

```typescript
{
    employeeId: 86,
    general: {
        honorificId: 0,
        firstName: "Canton",
        middleName: "Everett",
        lastName: "Delaware",
        suffix: "III",
        email: "xfbi@example.org",
        phoneNumber: "4404404440"
        address: {
            address1: "935 Pennsylvania Ave NW",
            address2: null,
            city: "Washington",
            state: "DC",
            zip: "20535",
            country: "US"
        }
        genderId: 3,
        maritalStatusId: 2,
        dateOfBirth: "1969-07-21T02:51:30Z",
        ssn: "123-45-4567"
    },
    eeo: {
        isVeteran: true,
        isNonResidentAlien: false,
        isMultiracial: false,
        isNonBinaryTransgender: true,
        minorityCodeId: 76,
    },
    sensitive: {
        driversLicenseState: "DC",
        driversLicenseNumber: "XF912345",
        driversLicenseExpirationDate: "2028-07-21"
    }
}
```

## Request Validation

See [#24420: Edit Personal Tab](https://dev.azure.com/fsllc/Portfolio/_workitems/edit/24420/)

## Security Validation

The user must have the "View Employee Personal Tab" permission (`WHQ_251_3137`) to send a request to the endpoint.

If the user does not have the required permission to submit a sub-element of the `EmployeePersonalInfoInput` model, they must submit the sub-element as null, or the request will be rejected with a 403 error.

|Element|Security Tag|Notes|
|-------|------------|-----|
|(any)|`WHQ_251_3137`|View Employee Personal Tab|
|general|`WHQ_251_3138`|View/Edit Employee General Info|
|eeo|`WHQ_251_3139`|View/Edit Employee EEO|
|sensitive|`WHQ_251_3140`|View/Edit Employee Sensitive|

## Expected Responses

### 200 OK
The request completed successfully.

The Person record has been updated in the BaseHQ database.

The Employee record has been updated in the WorkforceHQ database.

#### Response Model

```typescript
{
    public id: number;
    public honorificId: number;
    public fullName: string;
    public firstName: string;
    public middleName: string;
    public lastName: string;
    public suffix: string;
    public gender: Gender;
    public genderId: number;
    public email: string;
    public ssn: string;
    public dateOfBirth: Date;
    public maritalStatus: MaritalStatus;
    public terminationDate: string;
    public terminationReason: string;
    public jobTitle: string;
    public mainPhone: Phone;
    public address: GoogleAPIAddressInput;
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
}
```

#### Sample Response

```typescript
{
    id: 30,
    honorificId: 0,
    fullName: "Canton Everett Delaware III",
    firstName: "Canton",
    middleName: "Everett",
    lastName: "Delaware",
    suffix: "III",
    genderId: 3,
    gender: {
        id: 3,
        name: "Non-Binary",
    },
    email: "xfbi@example.org",
    ssn: "XXX-XX-4567",
    dateOfBirth: "1969-07-21T02:51:30Z",
    maritalStatus: {
        maritalStatusId: 2;
        maritalStatusName: "M"
    },
    terminationDate: null,
    terminationReason: null,
    jobTitle: "Agent",
    mainPhone: {
        id: 74,
        number: "4404404440",
        allowTexts: true,
        main: true,
        extension: "",
        notes: "",
        phoneNumberTypeId: 1,
        phoneNumberType: "",
        isValidPhoneNumber: true
    },
    address: {
        address1: "935 Pennsylvania Ave NW",
        address2: null,
        city: "Washington",
        state_Province: "DC",
        zip_PostalCode: "20535",
        country: "US"
    },
    employeeStatusId: 4,
    isVeteran: true,
    isNonResidentAlien: false,
    isMultiracial: false,
    minorityCode: {
        id: 76,
        minorityCodetName: "More than one race",
        minorityCodeFsNo: "M+";
        isActive: true,
        isDeleted: false
    },
    minorityCodeId: 76,
    isNonBinaryTransgender: true,
    driversLicenseState: "DC",
    driversLicenseNumber: "XF912345",
    driversLicenseExpirationDate: "2028-07-21"
```

### 401 Unauthorized
The requesting user is not logged in. Either the token is missing or is invalid.

### 403 Forbidden
An requesting user does not have authority to make changes to this Employee's personal details.

### 409 Conflict
The Person record indicated by the Employee's PHQPersonId does not exist in the BaseHQ database.

(This would indicate a bad data condition that we would have to resolve)

### 422 Bad request
The request object failed validation. The response should conform to [RFC 7807](https://datatracker.ietf.org/doc/html/rfc7807). 

See [Handle errors in ASP.NET Core Web APIs](https://learn.microsoft.com/en-us/aspnet/core/web-api/handle-errors?view=aspnetcore-6.0) for information on how to generate the response with a `ValidationProblemDetails` object. 

#### Response Model

```typescript
{
    type: string,
    title: string,
    status: number,
    traceId: string,
    errors: { [key: string]: string[] }
}
```

#### Sample Response

```typescript
{
    type: 'https://httpstatuses.com/422'
    title: 'One or more validation errors occurred',
    status: 422,
    traceId: '....'
    errors: {
        firstName: [
            'First Name is required'
        ],
        phoneNumber: [
            'Phone number does not match pattern',
            'Phone number is too long'
        ]
    }
}
```

### 502 Bad Gateway

An upstream call to the BaseHQ API failed. Details in the Problem document.

#### Sample Response

```typescript
{
    type: 'https://httpstatuses.com/502'
    title: 'BaseHQ PUT call failed with code: 500',
    status: 502,
    traceId: '....'
}
```

## Interfaces

This sections describes the protocols used to communicate with other resources.

### BaseHQ API

See [BaseHQ Endpoints](https://foundationsoftwareinc.sharepoint.com/teams/PeopleHQ-HRWebApp/_layouts/OneNote.aspx?id=%2Fteams%2FPeopleHQ-HRWebApp%2FSiteAssets%2FPeopleHQ%20-%20HR%20Web%20App%20Notebook&wd=target%28Feature%20Design%2FBaseHQ%20Integration.one%7C093BD361-7C03-4CBD-B6AA-68C0BFD2C799%2FBaseHQ%20API%20Endpoints%7C735EA087-C98E-4EC5-85F0-1E5C62572443%2F%29)

Data to update:
- Name information
- Email Address (update)
- Main Phone (update)
- Home Address (add or update)

#### Endpoints

##### Get Person by PersonId

Used to retrieve the current BaseHQ Person record so it can be updated via PUT. 

`GET {basehq-url}/v1/People/{personId}`

where:
- basehq-url = the endpoint of the BaseHQ API in the current environment
- personId = the PHQPerson on the Employee record

The client id will be on the requesting auth token.

###### Expected Response

Response Code: 200 OK
Response Body: A Person model containing the BaseHQ person matching the supplied PHQPersonId.

This is a documented sample response from BaseHQ.

```typescript
{
	"id": 1,
	"clientId": 1,
	"originProductGuid": "89368a9a-30b0-4946-b2b3-74988926314f",
	"userGuid": "89368a9a-30b0-4946-b2b3-77302739276a",
	"active": true,
	"deleted": false,
	"isEmployee": true,
	"suffix": "III",
	"firstName": "Canton",
	"middleName": "Everett",
	"lastName": "Delaware",
	"employeeIdNumber": null,
	"email": {
		"id": 1,
		"email": "xfbi@example.org",
		"emailAddressStatus": 0,
		"changeTrackingDate": "sysstarttime"
	},
	"mainPhone": {
		"id": 1, // PersonPhoneId
        "phoneId": 1, 
        "personId": 1, // Should match top level id
		"phoneNumber": "555-555-5555",
		"isMain": true,
		"allowText": false,
		"phoneExtension": null,
		"personPhoneNumberType": 0,
		"changeTrackingDate": "sysstarttime"
	},
	"addresses": [{
		"id": 1, // PersonAddressId
        "addressId": 1,
        "personId": 1 // Should match top level id
		"address1": "123 Main Street",
		"address2": null,
		"city": "Cleveland",
		"state": "OH",
		"zip": "12345",
		"country": "US",
        "personAddressType": 2, // Home address
		"changeTrackingDate": "sysstarttime"
	}],
	"alternatePhones": [{
		"id": 2, // PersonPhoneId
        "phoneId": 2, 
        "personId": 1, // Should match top level id
		"phoneNumber": "555-555-5556",
		"isMain": false,
		"allowText": true,
		"phoneExtension": null,
		"personPhoneNumberType": 2,
		"changeTrackingDate": "sysstarttime"
	}],
	"changeTrackingDate": "sysstarttime"
}
```

##### Update BaseHQ Person

`PUT {basehq-url}/v1/People/{personId}`

where:
- basehq-url = the endpoint of the BaseHQ API in the current environment
- personId = the PHQPerson on the Employee record

The client id will be on the requesting auth token.

###### Request Model

```typescript
{ 
    id: number,
    active: boolean,
    isEmployee: boolean,
    suffix: string, 
    firstName: string, 
    middleName: string, 
    lastName: string, 
    email: { 
        id: number,
        email: string, 
    }
    mainPhone: {
        id: number,
        phoneNumber: string,
        allowText: boolean,
        phoneExtension: string,
        personPhoneNumberType: number 
    },
    addresses: [
        {
            id: number,
            address1: string,
            address2: string,
            city: string,
            state: string,
            zip: string,
            country: string,
            addressType: number // 1 = Business, 2 = Home
        }
    ],
    alternatePhones: [
        {
            id: number,
            phoneNumber: string,
            allowText: boolean,
            phoneExtension: string,
            personPhoneNumberType: number 
        }
    ]
}
```

###### Sample Request

```typescript
{
	"id": 1,
	"active": true,
	"isEmployee": true,
	"suffix": "III",
	"firstName": "Canton",
	"middleName": "Everett",
	"lastName": "Delaware",
	"employeeIdNumber": null,
	"email": {
		"id": 1,
		"email": "xfbi@example.org"
	},
	"mainPhone": {
		"id": 1,
		"phoneNumber": "555-555-5555",
		"allowText": false,
		"phoneExtension": null,
		"personPhoneNumberType": null
	},
	"addresses": [
        {
            "id": 1,
            "address1": "123 Main Street",
            "address2": null,
            "city": "Cleveland",
            "state": "OH",
            "zip": "12345",
            "country": "US",
            "addressType": 2
        }
    ],
	"alternatePhones": [
        {
            "id": 2,
            "phoneNumber": "555-555-5556",
            "allowText": true,
            "phoneExtension": null,
            "personPhoneNumberType": 2
	    }
    ]
}
```

###### Expected Response

Response Code: 200 OK
Response Body: A Person model reflecting the updated record.

See [BaseHQ Endpoints](https://foundationsoftwareinc.sharepoint.com/teams/PeopleHQ-HRWebApp/_layouts/OneNote.aspx?id=%2Fteams%2FPeopleHQ-HRWebApp%2FSiteAssets%2FPeopleHQ%20-%20HR%20Web%20App%20Notebook&wd=target%28Feature%20Design%2FBaseHQ%20Integration.one%7C093BD361-7C03-4CBD-B6AA-68C0BFD2C799%2FBaseHQ%20API%20Endpoints%7C735EA087-C98E-4EC5-85F0-1E5C62572443%2F%29)

## Data Mapping

This section describes the data elements to populate in each system.

### BaseHQ Database

Column default values are not shown unless overridden by the request 

#### Person Table

|Column|Source|Notes|
|------|------|-----|
|PersonId|Employee.PHQPersonId|PK for BaseHQ Person|
|FirstName|firstName|From originating request payload|
|MiddleName|middleName|From originating request payload|
|LastName|lastName|From originating request payload|
|Suffix|suffix|From originating request payload|
|EmailAddressId|BaseHQ GET email.id|FK to EmailAddress.EmailAddressId|

#### EmailAddress Table

E-mail is required by WorkforceHQ and a row will always be present, so this is always an update.

|Column|Source|Notes|
|------|------|-----|
|EmailAddressId|BaseHQ GET email.id|PK for BaseHQ EmailAddress|
|EmailAddress|email|From originating request|

#### Phone Table

A main phone is required by WorkforceHQ and a row will always be present, so this is always an update.

If the BaseHQ GET endpoint returns any entries in the alternatePhones array, they should be returned unmodified to the PUT endpoint so that they are preserved.

|Column|Source|Notes|
|------|------|-----|
|PhoneId|BaseHQ GET mainPhone.phoneId|PK for BaseHQ Phone|
|IsMain|`true`|Constant, overrides default value|
|PhoneNumber|phoneNumber|From originating request|

#### Address Table

It is possible the addresses array returned by the BaseHQ GET endpoint will be empty or will not contain a home address, so this may be either an insert or an update. The update will operate on the first home address. If there is no home address, one will be created.

All address entries returned from the BaseHQ GET endpoint with the exception of the first home address should be returned unmodified to the PUT endpoint so that they are preserved. 

|Column|Source|Notes|
|------|------|-----|
|AddressId|BaseHQ GET addresses{addressType=2}.first (exists) or *Generated A (new)|PK for BaseHQ Address|
|Address1|address.address1|From originating request|
|Address2|address.address2|From originating request|
|City|address.city|From originating request|
|State|address.state|From originating request|
|Zip|address.zip|From originating request|
|Country|address.country|From originating request|

#### PersonPhone Table

A main phone is required by WorkforceHQ and a row will always be present, so this is always an update.

If the BaseHQ GET endpoint returns any entries in the alternatePhones array, they should be returned unmodified to the PUT endpoint so that they are preserved.

|Column|Source|Notes|
|------|------|-----|
|PersonPhoneId|BaseHQ GET mainPhone.id|PK for BaseHQ PersonPhone|
|PersonId|Employee.PHQPersonId|FK to BaseHQ Person|
|PhoneId|BaseHQ GET mainPhone.phoneId|FK to BaseHQ Phone|

#### PersonAddress Table

It is possible the addresses array returned by the BaseHQ GET endpoint will be empty or will not contain a home address, so this may be either an insert or an update. The update will operate on the first home address. If there is no home address, one will be created.

All address entries returned from the BaseHQ GET endpoint with the exception of the first home address should be returned unmodified to the PUT endpoint so that they are preserved. 

|Column|Source|Notes|
|------|------|-----|
|PersonAddressId|BaseHQ GET addresses{addressType=2}.first.id (exists) or *Generated PA (new)|PK for BaseHQ PersonAddress|
|PersonId|Employee.PHQPersonId|FK to BaseHQ Person|
|AddressId|BaseHQ GET addresses{addressType=2}.first.addressId (exists) or *Generated A (new)|PK for BaseHQ Address|
|PersonAddressTypeId|`2`|Constant, overrides default value|

### WorkforceHQ Database

#### Employee Table

|Column|Source|Notes|
|------|------|-----|
|EmployeeId|employeeId|PK for WorkforceHQ Employee|
|HonorificId|honorificId|From originating request - FK to WorkforceHQ shared.Honorific|
|UpdateEmployeeId|UserInformation.EmployeeId|From UserInformation middleware|
|GenderId|genderId|From originating request - FK to WorkforceHQ shared.Gender|
|MaritalStatusId|maritalStatusId|From originating request - FK to WorkforceHQ shared.MaritalStatus|
|DateOfBirth|dateOfBirth|From originating request|
|SocialSecurityNo|ssn|From originating request|
|IsVeteran|isVeteran|From originating request|
|IsNonResidentAlien|isNonResidentAlien|From originating request|
|IsMultiracial|isMultiracial|From originating request|
|IsNonBinaryTransgender|isNonBinaryTransgender|From originating request|
|MinorityCodeId|minorityCodeId|From originating request - FK to WorkforceHQ dbo.MinorityCode|
|DriversLicenseState|driversLicenseState|From originating request|
|DriversLicenseNumber|driversLicenseNumber|From originating request|
|DriversLicenseExpirationDate|driversLicenseExpirationDate|From originating request|
