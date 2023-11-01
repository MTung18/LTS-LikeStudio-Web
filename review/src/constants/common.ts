import { States } from '@/enums/State'

export const EMERGENCY_CONTACT = 1;
export const DEPENDENT = 2;
export const BENEFICIARY = 3;
export const STATUS_OK = 200;
export const STATUS_CREATED = 201;

interface State {
  value: string,
  text: string,
  instruction?: string,
  worksheet?: string,
  file?: string,
}

export const maxSize10MB = 10485760;

export const STATES: State[] = [
  { value: States.ALABAMA, text: "Alabama" },
  { value: States.ALASKA, text: "Alaska" },
  { value: States.ARIZONA, text: "Arizona" },
  { value: States.ARKANSAS, text: "Arkansas" },
  { value: States.CALIFORNIA, text: "California" },
  { value: States.COLORADO, text: "Colorado" },
  { value: States.CONNECTICUT, text: "Connecticut" },
  { value: States.DELAWARE, text: "Delaware" },
  { value: States.DISTRICT_OF_COLUMBIA, text: "District of Columbia" },
  { value: States.FLORIDA, text: "Florida" },
  { value: States.GEORGIA, text: "Georgia" },
  { value: States.HAWAII, text: "Hawaii" },
  { value: States.IDAHO, text: "Idaho" },
  { value: States.ILLINOIS, text: "Illinois" },
  { value: States.INDIANA, text: "Indiana" },
  { value: States.IOWA, text: "Iowa" },
  { value: States.KANSAS, text: "Kansas" },
  { value: States.KENTUCKY, text: "Kentucky" },
  { value: States.LOUISIANA, text: "Louisiana" },
  { value: States.MAINE, text: "Maine" },
  { value: States.MARYLAND, text: "Maryland" },
  { value: States.MASSACHUSETTS, text: "Massachusetts" },
  { value: States.MICHIGAN, text: "Michigan" },
  { value: States.MINNESOTA, text: "Minnesota" },
  { value: States.MISSISSIPPI, text: "Mississippi" },
  { value: States.MISSOURI, text: "Missouri" },
  { value: States.MONTANA, text: "Montana" },
  { value: States.NEBRASKA, text: "Nebraska" },
  { value: States.NEVADA, text: "Nevada" },
  { value: States.NEW_HAMPSHIRE, text: "New Hampshire" },
  { value: States.NEW_JERSEY, text: "New Jersey" },
  { value: States.NEW_MEXICO, text: "New Mexico" },
  { value: States.NEW_YORK, text: "New York" },
  { value: States.NORTH_CAROLINA, text: "North Carolina" },
  { value: States.NORTH_DAKOTA, text: "North Dakota" },
  { value: States.OHIO, text: "Ohio" },
  { value: States.OKLAHOMA, text: "Oklahoma" },
  { value: States.OREGON, text: "Oregon" },
  { value: States.PENNSYLVANIA, text: "Pennsylvania" },
  { value: States.RHODE_ISLAND, text: "Rhode Island" },
  { value: States.SOUTH_CAROLINA, text: "South Carolina" },
  { value: States.SOUTH_DAKOTA, text: "South Dakota" },
  { value: States.TENNESSEE, text: "Tennessee" },
  { value: States.TEXAS, text: "Texas" },
  { value: States.UTAH, text: "Utah" },
  { value: States.VERMONT, text: "Vermont" },
  { value: States.VIRGINIA, text: "Virginia" },
  { value: States.WASHINGTON, text: "Washington" },
  { value: States.WEST_VIRGINIA, text: "West Virginia" },
  { value: States.WISCONSIN, text: "Wisconsin" },
  { value: States.WYOMING, text: "Wyoming" },
];

export const PREFIX_OPTIONS = [
  { value: 0, text: "" },
  { value: 1, text: "Mr." },
  { value: 2, text: "Mrs." },
  { value: 3, text: "Ms." },
  { value: 4, text: "Miss" },
];

export const RELATIONSHIP_OPTIONS = [
  { value: 1, text: "Brother" },
  { value: 2, text: "Child" },
  { value: 3, text: "Friend" },
  { value: 4, text: "Father" },
  { value: 5, text: "Grandparent" },
  { value: 6, text: "Mother" },
  { value: 7, text: "Other" },
  { value: 8, text: "Sister" },
  { value: 9, text: "Domestic Partner" },
  { value: 10, text: "Spouse" },
  { value: 11, text: "Step Child" },
  { value: 12, text: "Ex-Spouse" },
];

export const TYPE_CONTACT_INFO_OPTIONS = [
  { text: "Emergency Contact", value: 1 },
  { text: "Dependent", value: 2 },
  { text: "Beneficiary", value: 3 },
];

export const DISTRIBUTION_METHODS = {
  amount: "Dollar Amount",
  percentageNet: "Percent of Net",
  percentageRemaining: "Percent of Remaining",
  remaining: "Remaining"
};

export const MAX_FILE_SIZE_WARNING_MESSAGE = "File size must be under 10MB";
export const MAX_FILE_SIZE = 10000000;

export const BANK_ACCOUNT_TYPE_OPTIONS = [
  { name: `Checking`, id: 1 },
  { name: `Savings`, id: 2 },
];

export const BANK_ACCOUNT_STATUS_OPTIONS = [
  { name: `Active`, id: true },
  { name: `Inactive`, id: false },
];

export const DISTRIBUTION_METHOD_OPTIONS = [
  { name: `Dollar Amount`, id: 1 },
  { name: `Percent of Net`, id: 2 },
  { name: `Percent of Remaining`, id: 3 },
  { name: `Remaining`, id: 4 },
];

export const PERSONAL_INFO_MARITAL_OPTIONS = [
  { value: 1, text: "Single" },
  { value: 2, text: "Married" },
  { value: 3, text: "Divorced" },
  { value: 4, text: "Separated" },
  { value: 5, text: "Widowed" },
  { value: 6, text: "Prefer not to say" },
];

export const PERSONAL_INFO_GENDER_OPTIONS = [
  { value: 1, text: 'Female' },
  { value: 2, text: 'Male' },
  { value: 3, text: 'Prefer not to respond' }
]

export const PERSONAL_INFO_RACE_OPTIONS = [
  {
    id: 1,
    value: 'Hispanic or Latino',
    description: 'a person of Cuban, Mexican, Chicano, Puerto Rican, South or Central American, or other Spanish culture or origin, regardless of race'
  },
  {
    id: 2,
    value: 'White (Not Hispanic or Latino)',
    description: 'a person having origins in any of the original peoples of Europe, the Middle East, or North Africa.'
  },
  {
    id: 3,
    value: 'Black or African American (Not Hispanic or Latino)',
    description: 'a person having origins in any of the black racial groups of Africa.'
  },
  {
    id: 4,
    value: 'Asian (Not Hispanic or Latino)',
    description: 'a person having origins in any of the original peoples of the Far East, Southeast Asia, or the Indian subcontinent including, for example, Cambodia, China, India, Japan, Korea, Malaysia, Pakistan, the Philippine Islands, Thailand, and Vietnam.'
  },
  {
    id: 5,
    value: 'Native Hawaiian or Other Pacific Islander (Not Hispanic or Latino)',
    description: 'a person having origins in any of the original peoples of Hawaii, Guam, Samoa, or other Pacific Islands.'
  },
  {
    id: 6,
    value: 'American Indian or Alaska Native (Not Hispanic or Latino)',
    description: 'a person having origins in any of the original peoples of North and South America (including Central America), and who maintains tribal affiliation or community attachment.'
  },
  {
    id: 7,
    value: 'Two or More Races (Not Hispanic or Latino)',
    description: 'a person who primarily identifies with two or more of the above race/ethnicity categories.'
  },
  {
    id: 8,
    value: 'I do not wish to disclose.',
    description: ''
  },
]

export const APPROVAL_STATUS = {
  pendingHRM: "Pending HRM",
  pendingFoundation: "Pending Foundation",
  approved: "Approved",
  rejected: "Rejected",
  new: "New"
}

export const CITIZENSHIP_STATUS = [
  { text: "A citizen of the United States", value: 1 },
  { text: "A noncitizen national of the United States", value: 2 },
  { text: "A lawful permanent resident", value: 3 },
  { text: "An alien authorized to work until", value: 4 }
]

export const PAY_TYPE = [
  { text: "Hourly", value: 1 },
  { text: "Salary", value: 2 }
]

export enum ONBOARDING_FORM_STATUS {
  NOT_STARTED = 1,
  IN_PROGRESS = 2,
  COMPLETED = 3
}

export const COUNTRY_LIST = [
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "MX", name: "Mexico" },
  { code: "GB", name: "United Kingdom" },
  { code: "FR", name: "France" },
  { code: "DE", name: "Germany" },
  { code: "IT", name: "Italy" },
  { code: "ES", name: "Spain" },
  { code: "JP", name: "Japan" },
  { code: "CN", name: "China" },
  { code: "IN", name: "India" },
  { code: "AU", name: "Australia" },
  { code: "NZ", name: "New Zealand" },
  { code: "BR", name: "Brazil" },
  { code: "AR", name: "Argentina" },
  { code: "CL", name: "Chile" },
  { code: "CO", name: "Colombia" },
  { code: "PE", name: "Peru" },
  { code: "UY", name: "Uruguay" },
  { code: "RU", name: "Russia" },
  { code: "UA", name: "Ukraine" },
  { code: "PL", name: "Poland" },
  { code: "SE", name: "Sweden" },
  { code: "FI", name: "Finland" },
  { code: "NO", name: "Norway" },
  { code: "DK", name: "Denmark" },
  { code: "NL", name: "Netherlands" },
  { code: "BE", name: "Belgium" },
  { code: "CH", name: "Switzerland" },
  { code: "AT", name: "Austria" },
  { code: "CZ", name: "Czech Republic" },
  { code: "HU", name: "Hungary" },
  { code: "SK", name: "Slovakia" },
  { code: "SI", name: "Slovenia" },
  { code: "HR", name: "Croatia" },
  { code: "RS", name: "Serbia" },
  { code: "BG", name: "Bulgaria" },
  { code: "RO", name: "Romania" },
  { code: "TR", name: "Turkey" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "QA", name: "Qatar" },
  { code: "KW", name: "Kuwait" },
  { code: "OM", name: "Oman" },
  { code: "ZA", name: "South Africa" },
  { code: "EG", name: "Egypt" },
  { code: "NG", name: "Nigeria" },
  { code: "KE", name: "Kenya" },
  { code: "TZ", name: "Tanzania" },
  { code: "UG", name: "Uganda" },
];

export const FEDERAL_FILING_STATUS_OPTIONS = [
  { id: 1, name: 'Single or Married Filing Separately' },
  { id: 2, name: 'Married Filing Jointly or Qualifying Surviving Spouse' },
  { id: 3, name: 'Head of Household' }
];

export const STATE_FILING_STATUS_OPTIONS = [
  { id: 1, name: 'Single' },
  { id: 2, name: 'Head of Household' },
  { id: 3, name: 'Married Filing Separately' },
  { id: 4, name: 'Married Filing Jointly' }
]

export const FEDERAL_TAX_WITHHOLDING_INFO_OVERRIDE_OPTIONS = [
  { id: 1, name: 'None' },
  { id: 2, name: 'No Tax Withheld' },
  { id: 3, name: 'No Taxable Earnings' }
];

export const NON_FEDERAL_TAX_WITHHOLDING_INFO_OVERRIDE_OPTIONS = [
  { id: 1, name: 'None' },
  { id: 2, name: 'No Tax Withheld' },
  { id: 3, name: 'No Taxable Earnings' },
  { id: 4, name: 'Fixed' },
  { id: 5, name: 'Fixed - No Exemptions' }
];

export const FEDERAL_AUTHORITY_OPTIONS = [
  { id: 1, name: 'Federal' },
  { id: 2, name: 'State', default: true },
  { id: 3, name: 'Local' }
];

export const TAX_WITHHOLDING_INFO_ADD_ON_OPTIONS = [
  { id: 1, name: 'None' },
  { id: 2, name: 'Add On' },
  { id: 3, name: 'Only' },
  { id: 4, name: 'Highest Rate' }
];

export const YES_NO_OPTIONS = [
  { id: 1, name: 'Yes' },
  { id: 2, name: 'No' }
];

export const MAX_FILE_NAME_LENGTH = 50;
