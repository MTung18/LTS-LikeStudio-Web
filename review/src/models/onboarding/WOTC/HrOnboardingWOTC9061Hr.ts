export interface OnboardingWOTC9061Hr {
  status: string;
  isActive: boolean;
  isFormDone: boolean;
  name: string;
  address: string;
  city: string;
  state: {
    text: string;
    value: string
  };
  zipCode: string;
  phone: string;
  federalId: string;
  startDate: string;
  startWage: string;
  position: string;
  employerSignaturePath: string;
  dateSignatureUTC: string;
}

  