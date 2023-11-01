import { defineComponent, PropType } from 'vue';
import { GoogleAPIAddress } from '@/models/GoogleAPIAddress';
import { UIFieldMapForAddress } from '@/models/UIFieldMapForAddress';
import UIFieldStore from '@/stores/UIFieldStore';
import { Country } from '@/models/Country';
import { CountryStore } from '@/stores/CountryStore';
import { IconDefinition, library } from '@fortawesome/fontawesome-svg-core';
import { faAsterisk } from '@fortawesome/pro-solid-svg-icons';
import FsInput from '@/components/global/fsInput/fsInput.vue';
import FsMultiselectList from '@/components/global/fsInput/fsMultiselectList/fsMultiselectList.vue';
import { useAddressInputAndBlurEvent } from '@/composables/useAddressInputAndBlurEvent';
import { Field } from 'vee-validate';

library.add(
    faAsterisk as IconDefinition,
)

export default defineComponent({
    name: 'FsAddress',
    components: {
        FsInput,
        FsMultiselectList,
        VeeField: Field
    },
    props: {
        index: Number,
        googleAddress: Object as PropType<GoogleAPIAddress>,
        labelPrepend: {
            type: String,
            default: ''
        },
        uiFieldMap: {
            type: Object as PropType<UIFieldMapForAddress>,
            default: () => new UIFieldMapForAddress()
        },
        uiFieldStore: {
            type: Object as PropType<UIFieldStore>,
            default: () => new UIFieldStore()
        },
        isCountryEnabled: {
            type: Boolean,
            default: true
        }
    },
    setup() {
        return { ...useAddressInputAndBlurEvent() }
    },
    data() {
        return {
            internalGoogleAddress: {} as GoogleAPIAddress,
            countryItems: [] as Country[],
            countryTouched: false,
            countrySelected: new Country()
        }
    },
    computed: {
        selectedCountryId(): number {
            const country: Country = this.countryItems.find((c: Country) => c.abbreviation === this.googleAddress.country);
            if (country) {
                return country.id;
            } else {
                return null;
            }
        },
        postalCodeMinLength(): number {
            const postalLengths: { [country: string]: number } = {
                US: 5,
                CA: 6,
                XX: 0,
            };
            return postalLengths[this.googleAddress.country || 'XX'];
        },
        postalCodePattern(): RegExp {
            const postalPatterns: { [country: string]: RegExp } = {
                US: /^\d{5}(-?\d{4})?$/,
                CA: /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/,
                XX: /.*/,
            };
            return postalPatterns[this.googleAddress.country || 'XX'];
        }
    },
    watch: {
        countrySelected: {
            async handler(newValue, oldValue) {
                if (this.googleAddress && this.internalGoogleAddress && this.countrySelected) {
                    this.internalGoogleAddress.country = this.countrySelected.abbreviation;
                }
            },
            immediate: true
        },
        googleAddress: {
            async handler(newValue, oldValue) {
                this.internalGoogleAddress = newValue;
                await this.processCountry();
            },
            immediate: true
        },
        internalGoogleAddress: {
            async handler(newValue, oldValue) {
                this.$emit('update:googleAddress', this.internalGoogleAddress);
            },
            deep: true
        }
    },
    async created(): Promise<void> {
        this.countryItems = await CountryStore.getCountries();
    },
    async mounted(): Promise<void> {
        this.registerInputAndBlurEvent(this.uiFieldMap.address1, this.onAddress1Blur, this.updateAddress1);
    },
    unmounted(): void {
        this.deRegisterInputAndBlurEvent(this.uiFieldMap.address1, this.onAddress1Blur, this.updateAddress1);
    },
    methods: {
        async processCountry(): Promise<void> {
            this.countryItems = await CountryStore.getCountries();
            this.countrySelected = this.countryItems.find((element: Country) => element.abbreviation === this.internalGoogleAddress.country);
        },
        async onAddress1Blur(): Promise<void> {
            this.trimAddress1();
        },
        updateAddress1(event: any): void {
            this.internalGoogleAddress.address1 = event.target.value ?? '';
            if (this.internalGoogleAddress.address1 && this.internalGoogleAddress.address1.trim().length > 0) {
                this.setDefaultCountry();
            }
        },
        trimAddress1(): void {
            this.internalGoogleAddress.address1 = this.internalGoogleAddress?.address1?.substring(0, 255)?.trim();
        },
        addressInput(event: string): void {
            if (event?.trim().length > 0) {
                this.setDefaultCountry();
            }
        },
        formatState(event: any): void {
            this.internalGoogleAddress.state_Province = this.googleAddress.state_Province.toUpperCase();
        },
        formatZip(event: any): void {
            this.internalGoogleAddress.zip_PostalCode = this.googleAddress.zip_PostalCode.toUpperCase();
        },
        updateCountry(event: any): void {
            this.countryTouched = true;
        },
        setDefaultCountry(): void {
            if (!this.countryTouched && !this.googleAddress.country) {
                this.internalGoogleAddress.country = 'US';
                this.countryTouched = true;
            }
        },
        setAddress(place: any): void {
            this.internalGoogleAddress = this.parseGoogleAddress(place);
            if (place.address_components) {
                this.internalGoogleAddress = this.parseGoogleAddress(place);
            }
        },
        async clearAddress(): Promise<void> {
            this.internalGoogleAddress.address1 = '';
            this.internalGoogleAddress.address2 = '';
            this.internalGoogleAddress.city = '';
            this.internalGoogleAddress.state_Province = '';
            this.internalGoogleAddress.zip_PostalCode = '';
            this.internalGoogleAddress.country = '';
            this.countryTouched = false;
        },
        parseGoogleAddress(place: any): GoogleAPIAddress {
            let houseNum = '';
            let road = '';
            let city = '';
            let stateProvince = '';
            let country = '';
            let zipCode = '';

            /* tslint:disable */
            for (let i = 0; i < place.address_components.length; i++) {
                const addressType = place.address_components[i].types[0];
                /* tslint:enable */

                switch (addressType) {
                    case 'street_number':
                        houseNum = place.address_components[i].short_name + ' ';
                        break;
                    case 'route':
                        road = place.address_components[i].long_name;
                        break;
                    case 'locality':
                        city = place.address_components[i].long_name.substring(0, 50);
                        break;
                    case 'administrative_area_level_1':
                        stateProvince = place.address_components[i].short_name.substring(0, 3);
                        break;
                    case 'country': {
                        const countryCode: any = place.address_components[i].short_name;
                        if (countryCode === 'US' || countryCode === 'CA') {
                            country = countryCode;
                        } else {
                            country = 'XX';
                        }
                        this.countryTouched = true;
                        break;
                    }
                    case 'postal_code':
                        zipCode = place.address_components[i].short_name.substring(0, 10);
                        break;
                    default:
                        break;
                }
            }
            this.internalGoogleAddress.address1 = (houseNum + road).substring(0, 255);
            return new GoogleAPIAddress({
                address1: (houseNum + road).substring(0, 255),
                address2: '',
                city,
                state_Province: stateProvince,
                zip_PostalCode: zipCode,
                country,
                countries: [],
            });
        }
    }
})