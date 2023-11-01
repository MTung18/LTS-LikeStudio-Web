import { Country } from './Country';
import { GoogleAPIAddressInput } from './GoogleAPIAddressInput';

export class GoogleAPIAddress {
    public address1: string = '';
    public address2: string = '';
    public city: string = '';
    public state_Province: string = '';
    public zip_PostalCode: string = '';
    public country: string = '';
    public countries: Country[];

    public constructor(init?: Partial<GoogleAPIAddress>) {
        Object.assign(this, init);
    }

    public toGoogleAPIAddressInput(): GoogleAPIAddressInput {
        return new GoogleAPIAddressInput({
            address1: this.address1,
            address2: this.address2,
            city: this.city,
            state_Province: this.state_Province,
            zip_PostalCode: this.zip_PostalCode,
            country: this.country,
        });
    }
}
