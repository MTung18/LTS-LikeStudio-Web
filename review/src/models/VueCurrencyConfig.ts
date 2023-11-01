import { CurrencyInputOptions, NumberRange } from 'vue-currency-input';

export class VueCurrencyConfig implements CurrencyInputOptions {
    public currency: string = 'USD';
    public locale: string = 'en';
    public autoDecimalMode: boolean = false;
    public precision: number | NumberRange = 2;
    public distractionFree: boolean | object = false;
    public valueAsInteger: boolean = false;
    public valueRange?: { min: number, max: number } = undefined;
    public allowNegative: boolean = true;

    public constructor(init?: Partial<VueCurrencyConfig>) {
        Object.assign(this, init);
    }
}