import { Country } from '@/models/Country';

export class CNStore {
    private static countryItems: Country[] = [
        {
            id: 0,
            abbreviation: '',
            name: '',
            sequence: 1,
        },
        {
            id: 1,
            abbreviation: 'US',
            name: 'United States',
            sequence: 2,
        },
        {
            id: 2,
            abbreviation: 'CA',
            name: 'Canada',
            sequence: 3,
        },
        {
            id: 3,
            abbreviation: 'XX',
            name: 'Other',
            sequence: 4,
        },
    ];

    public async getCountries(): Promise<Country[]> {
        return Promise.resolve(JSON.parse(JSON.stringify(CNStore.countryItems)));
    }
}

export const CountryStore: CNStore = new CNStore();
