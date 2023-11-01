export const FEDERAL_FILING_STATUS_OPTIONS = [
  { id: 1, federalFilingStatusDescription: 'Single or Married Filing Separately' },
  { id: 2, federalFilingStatusDescription: 'Married Filing Jointly or Qualifying Surviving Spouse' },
  { id: 3, federalFilingStatusDescription: 'Head of Household' }
];

export const STATE_FILING_STATUS_OPTIONS = [
  { id: 1, stateFilingStatusDescription: 'Single' },
  { id: 2, stateFilingStatusDescription: 'Married Filing Separately' },
  { id: 3, stateFilingStatusDescription: 'Married Filing Jointly' },
  { id: 4, stateFilingStatusDescription: 'Head of household' }
]

export const OVERRIDE_OPTIONS = [
  { id: 1, payrollTaxOverrideDescription: 'None' },
  { id: 2, payrollTaxOverrideDescription: 'No Tax Withheld' },
  { id: 3, payrollTaxOverrideDescription: 'No Taxable Earnings' },
  { id: 4, payrollTaxOverrideDescription: 'Fixed' },
  { id: 5, payrollTaxOverrideDescription: 'Fixed - No Exemptions' }
];

export const ADD_ON_OPTIONS = [
  { id: 1, payrollTaxAddOnDescription: 'None' },
  { id: 2, payrollTaxAddOnDescription: 'Add On' },
  { id: 3, payrollTaxAddOnDescription: 'Only' },
  { id: 4, payrollTaxAddOnDescription: 'Highest Rate' }
];

export const YES_NO_OPTIONS = [
  { id: 1, name: 'Yes' },
  { id: 2, name: 'No' }
];
