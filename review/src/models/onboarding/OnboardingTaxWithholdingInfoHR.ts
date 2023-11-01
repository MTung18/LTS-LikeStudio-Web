export class OnboardingTaxWithholdingHRState {
    public stateId: number;
    public stateInfo: StateInfo;
    public filingStatus: any;
    public exemptions: number;
    public extraStateWithholdingAmount: number;
    public extraStateWithholdingPercent: number;
    public override: any;
    public addOn: any;
    public residence: any;
    public stLocMakeup: any;

    public constructor(init?: Partial<OnboardingTaxWithholdingHRState>) {
        Object.assign(this, init);
    }
}

export class OnboardingTaxWithholdingHRLocal {
    public localId: number;
    public stateInfo: StateInfo;
    public locality: any;
    public exemptions: number;
    public extraLocalWithholdingAmount: number;
    public extraLocalWithholdingPercent: number;
    public override: any;
    public addOn: any;
    public residence: any;
    public constructor(init?: Partial<OnboardingTaxWithholdingHRLocal>) {
        Object.assign(this, init);
    }
}

export interface LocalTaxAuthorityDropdown {
    id: number;
    payrollLocalTaxCodeName: string;
}

export interface TaxGroupDropdown {
    id: number;
    payrollLocalTaxGroupName: string;
}

export interface StateInfo {
    value: number;
    text: string;
    name: string;
}