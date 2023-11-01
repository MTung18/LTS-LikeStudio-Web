export enum DocumentTypes {
  EmployeeDocument = 'employeedoc',
  ClientDocument = 'clientdoc',
  EmployeeDirectDepositDocument = 'directdepositdoc',
  EmployeeW4 = 'employeeW4',
  EmployeeW4ByState = 'employeeW4ByState',
  EmployeeI9 = 'employeeI9',
  EmployeeVEVRAA = 'employeeVEVRAA',
  EmployeeVEVRAAHrm = "EmployeeVEVRAAHrm",
  SignatureEmployeeDocument = 'SignatureEmployee',
  QuickHireWotc = 'quickHireWotc',
  HrOnboardWotc = 'hrOnboardWotc',
  HrOnboardDirectDeposit = 'HrOnboardDirectDeposit',
  // EEO Files
  EEOQuickHiresDocument = 'eeoQuickHiresDoc',
  EmployeeFederalReporting = 'employeeFederalReporting'
}

const APP_PREFIX = 'WorkforceHQ';

export async function makeDocumentPath(documentType: DocumentTypes, clientId = 'shared', id: string = null, optionalName: string = null) {
  const optionalString = `${optionalName ? `/${optionalName}` : ''}`

  switch (documentType.toLowerCase()) {
    case DocumentTypes.ClientDocument.toLowerCase():
      return `General/Document`;
    case DocumentTypes.EmployeeDocument.toLowerCase():
      return `Employees/${id}/General`;
    case DocumentTypes.EmployeeDirectDepositDocument.toLowerCase():
      return `${APP_PREFIX}/HR-Documents/${clientId}/${id}/DirectDeposit`;
    case DocumentTypes.EmployeeW4.toLowerCase():
      return `Employees/${id}/Financial/W4`;
    case DocumentTypes.EmployeeW4ByState.toLowerCase():
      return `Employees/${id}/Financial/W4/W4Form${optionalString}`;
    case DocumentTypes.EmployeeI9.toLowerCase():
      return `Employees/${id}/Personal/I-9`;
    case DocumentTypes.EmployeeVEVRAA.toLowerCase():
      return `Employees/${id}/Personal/VEVRAA`;
    case DocumentTypes.EmployeeVEVRAAHrm.toLowerCase():
      return `Employees/${id}/Personal/VEVRAAHrm`;
    case DocumentTypes.SignatureEmployeeDocument.toLowerCase():
      return `Employees/${id}/Personal/SignatureEmployee`;
    case DocumentTypes.QuickHireWotc.toLocaleLowerCase():
      return `Employees/${id}/Personal/QuickHireWotc`;
    case DocumentTypes.HrOnboardWotc.toLocaleLowerCase():
      return `Employees/${id}/Personal/HrOnboardWotc`;
    case DocumentTypes.EEOQuickHiresDocument.toLocaleLowerCase():
      return `Employees/${id}/Personal/EEO`;
    case DocumentTypes.EmployeeFederalReporting.toLowerCase():
      return `Employees/${id}/Personal`;
    case DocumentTypes.HrOnboardDirectDeposit.toLowerCase():
      return `Employees/${id}/Personal/HrOnboardDirectDeposit`
  }
}

export function getProductUrl(url: string): string {

  try {
    const hostname = window.location.hostname;
    const regex = /(-dev|-qa|-staging)/;
    const match = hostname.match(regex);
    const envSuffix = match ? match[1] : '';
    return url.replace('{{EnvironmentUrlExtension}}', envSuffix);

  } catch(error) {

    console.log(error);

    return url;

  }
}
